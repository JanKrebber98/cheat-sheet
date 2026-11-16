"""Führt SQL-Beispiele in einer Datenbank-Engine aus und vergleicht die Ergebniskommentare.

Wird von scripts/check-sql.js aufgerufen:  python sql_runner.py <engine> <jobs.json>
engine: sqlite | pg | mysql | mssql.  jobs.json: [{"id": ..., "script": ...}, ...]
Gibt JSON aus: [{"id", "ok", "error", "problems", "output"}, ...]

Jedes Beispiel läuft in einer eigenen, frischen Datenbank. Ergebniskommentare sind
Kommentarblöcke, deren erste Zeile die Spaltennamen der Abfrage enthält:
    SELECT name, preis FROM produkte ORDER BY preis;
    -- name  | preis
    -- Kabel | 4.50
    -- …                     (optional: weitere Zeilen weggelassen)
Zahlen werden nach Wert verglichen (4.5 = 4.50), Spaltennamen ohne Groß-/Kleinschreibung.
"""
import concurrent.futures as cf
import datetime
import decimal
import json
import os
import re
import sys
import time
import uuid

ENGINE = sys.argv[1]
JOBS = json.load(open(sys.argv[2], encoding='utf-8'))
PW = 'Cheat_Sheet1!'
PORTS = {'pg': 55432, 'mysql': 53306, 'mssql': 51433}


# ---------- Werte so darstellen, wie man sie im jeweiligen Client sieht ----------
def fmt(v):
    if v is None:
        return 'NULL'
    if isinstance(v, bool):
        return ('1' if v else '0') if ENGINE in ('mysql', 'mssql') else ('true' if v else 'false')
    if isinstance(v, decimal.Decimal):
        return format(v, 'f')
    if isinstance(v, float):
        return repr(v)
    if isinstance(v, datetime.datetime):
        return v.isoformat(sep=' ')
    if isinstance(v, (datetime.date, datetime.time)):
        return v.isoformat()
    if isinstance(v, datetime.timedelta):
        return str(v)
    if isinstance(v, (bytes, bytearray, memoryview)):
        return ('0x' if ENGINE == 'mssql' else '\\x') + bytes(v).hex()
    if isinstance(v, uuid.UUID):
        return str(v)
    if isinstance(v, (dict, list)):
        return json.dumps(v, ensure_ascii=False)
    return str(v)


def result(cur):
    return ([d[0] for d in cur.description], [[fmt(v) for v in r] for r in cur.fetchall()])


# ---------- Engines: jede liefert eine Liste (Spalten, Zeilen) je Ergebnismenge ----------
def run_sqlite(script):
    import sqlite3
    db = sqlite3.connect(':memory:', autocommit=True)
    db.execute('PRAGMA foreign_keys = ON')
    out, buf = [], ''
    for line in script.splitlines(keepends=True):
        buf += line
        if not sqlite3.complete_statement(buf):
            continue
        stmt, buf = buf.strip(), ''
        cur = db.execute(stmt)
        if cur.description:
            out.append(result(cur))
    rest = '\n'.join(l for l in buf.splitlines() if l.strip() and not l.strip().startswith('--'))
    if rest:
        raise RuntimeError('unvollständige Anweisung am Ende (fehlt ein Semikolon?): ' + rest[:200])
    return out


def connect_retry(fn):
    # Container brauchen nach dem Start einige Sekunden, bis sie Verbindungen annehmen.
    deadline = time.time() + 120
    while True:
        try:
            return fn()
        except Exception:
            if time.time() > deadline:
                raise
            time.sleep(2)


def pg_statements(script):
    # Trennt an ; außerhalb von Strings, "Bezeichnern", $tag$-Blöcken und Kommentaren.
    # BEGIN ATOMIC … END (SQL-Standard-Funktionsrumpf) bleibt zusammen; CASE … END darin zählt mit.
    out, buf, i, n, depth = [], [], 0, len(script), 0
    while i < n:
        c = script[i]
        word = (c.isalpha() and not (i and (script[i - 1].isalnum() or script[i - 1] == '_'))) and \
            re.match(r'(BEGIN\s+ATOMIC|CASE|END)\b', script[i:], re.I)
        if word and (depth or word.group(1).upper().startswith('BEGIN')):
            kw = word.group(1).upper()
            depth += -1 if kw == 'END' else 1
            buf.append(word.group(0)); i += len(word.group(0))
        elif script.startswith('--', i):
            j = script.find('\n', i)
            j = n if j < 0 else j
            buf.append(script[i:j]); i = j
        elif script.startswith('/*', i):
            j = script.find('*/', i + 2)
            j = n if j < 0 else j + 2
            buf.append(script[i:j]); i = j
        elif c in ("'", '"'):
            j = i + 1
            while j < n:
                if script[j] == c:
                    if j + 1 < n and script[j + 1] == c:
                        j += 2
                        continue
                    break
                j += 1
            buf.append(script[i:j + 1]); i = j + 1
        elif c == '$' and (m := re.match(r'\$([A-Za-z_][A-Za-z0-9_]*)?\$', script[i:])) and not (i and (script[i - 1].isalnum() or script[i - 1] == '_')):
            tag = m.group(0)
            j = script.find(tag, i + len(tag))
            j = n if j < 0 else j + len(tag)
            buf.append(script[i:j]); i = j
        elif c == ';' and depth == 0:
            out.append(''.join(buf)); buf = []; i += 1
        else:
            buf.append(c); i += 1
    out.append(''.join(buf))
    # Nur Kommentare/Leerraum → keine Anweisung
    return [s for s in out if re.sub(r'--[^\n]*|/\*.*?\*/', '', s, flags=re.S).strip()]


def run_pg(script):
    import psycopg
    name = 'ex_' + uuid.uuid4().hex[:12]
    admin = connect_retry(lambda: psycopg.connect(host='127.0.0.1', port=PORTS['pg'], user='postgres', password=PW, dbname='postgres', autocommit=True))
    admin.execute(f'CREATE DATABASE {name}')
    out, notices = [], []
    try:
        with psycopg.connect(host='127.0.0.1', port=PORTS['pg'], user='postgres', password=PW, dbname=name, autocommit=True) as conn:
            conn.add_notice_handler(lambda d: notices.append(d.message_primary))
            cur = conn.cursor()
            # Einzeln senden wie psql: Mehrere Anweisungen in einem Aufruf liefen sonst als eine
            # implizite Transaktion, und ein ROLLBACK im Beispiel nähme alles davor mit zurück.
            for stmt in pg_statements(script):
                cur.execute(stmt)
                if cur.description:
                    out.append(result(cur))
    finally:
        admin.execute(f'DROP DATABASE IF EXISTS {name} WITH (FORCE)')
        admin.close()
    return out, notices


def mysql_statements(script):
    # DELIMITER ist ein Befehl des mysql-Clients, nicht des Servers: hier selbst auswerten.
    stmts, buf, delim = [], [], ';'
    for line in script.splitlines():
        m = re.match(r'\s*DELIMITER\s+(\S+)\s*$', line, re.I)
        if m:
            delim = m.group(1)
            continue
        buf.append(line)
        if line.rstrip().endswith(delim):
            text = '\n'.join(buf).rstrip()
            stmts.append(text[: -len(delim)])
            buf = []
    rest = '\n'.join(l for l in buf if l.strip() and not l.strip().startswith('--'))
    if rest:
        raise RuntimeError('unvollständige Anweisung am Ende (fehlt ein Semikolon?): ' + rest[:200])
    return stmts


def run_mysql(script):
    import pymysql
    from pymysql.constants import CLIENT
    name = 'ex_' + uuid.uuid4().hex[:12]
    kw = dict(host='127.0.0.1', port=PORTS['mysql'], user='root', password=PW, charset='utf8mb4', autocommit=True,
              client_flag=CLIENT.MULTI_STATEMENTS)
    admin = connect_retry(lambda: pymysql.connect(**kw))
    admin.cursor().execute(f'CREATE DATABASE {name}')
    out = []
    try:
        conn = pymysql.connect(database=name, **kw)
        try:
            cur = conn.cursor()
            # Ohne DELIMITER geht das Skript am Stück an den Server (Mehrfachanweisungen erlaubt).
            chunks = mysql_statements(script) if re.search(r'^\s*DELIMITER\s', script, re.M | re.I) else [script]
            for stmt in chunks:
                if not stmt.strip() or all(l.strip().startswith('--') or not l.strip() for l in stmt.splitlines()):
                    continue
                cur.execute(stmt)
                while True:
                    if cur.description:
                        out.append(result(cur))
                    if not cur.nextset():
                        break
        finally:
            conn.close()
    finally:
        admin.cursor().execute(f'DROP DATABASE IF EXISTS {name}')
        admin.close()
    return out


def run_mssql(script):
    import pymssql
    name = 'ex_' + uuid.uuid4().hex[:12]
    kw = dict(server='127.0.0.1', port=PORTS['mssql'], user='sa', password=PW, autocommit=True)
    admin = connect_retry(lambda: pymssql.connect(**kw))
    admin.cursor().execute(f'CREATE DATABASE {name}')
    out = []
    try:
        conn = pymssql.connect(database=name, **kw)
        try:
            cur = conn.cursor()
            # GO trennt Batches (Befehl von sqlcmd/SSMS, nicht des Servers)
            for batch in re.split(r'^\s*GO\s*$', script, flags=re.M | re.I):
                if not batch.strip() or all(l.strip().startswith('--') or not l.strip() for l in batch.splitlines()):
                    continue
                cur.execute(batch)
                while True:
                    if cur.description:
                        out.append(result(cur))
                    if not cur.nextset():
                        break
        finally:
            conn.close()
    finally:
        admin.cursor().execute(f'ALTER DATABASE {name} SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE {name}')
        admin.close()
    return out


# ---------- Ergebniskommentare vergleichen ----------
def comment_blocks(script):
    blocks, cur = [], None
    for line in script.splitlines():
        s = line.strip()
        if s.startswith('--'):
            if cur is None:
                cur = []
                blocks.append(cur)
            cur.append(s[2:].strip())
        else:
            cur = None
    return blocks


def cells(line):
    return [c.strip() for c in line.split('|')]


def same(a, b):
    if a == b:
        return True
    try:
        return decimal.Decimal(a) == decimal.Decimal(b)
    except Exception:
        return False


IDENT = re.compile(r'^[\wäöüÄÖÜß.]+$')


def compare(script, results):
    problems, blocks, used, start = [], comment_blocks(script), set(), 0
    for hdr, rows in results:
        want = [h.lower() for h in hdr]
        for j in range(start, len(blocks)):
            b = blocks[j]
            if [c.lower() for c in cells(b[0])] != want:
                continue
            used.add(j)
            start = j + 1
            exp = [cells(l) for l in b[1:]]
            trunc = bool(b[1:]) and b[-1] in ('…', '...')
            if trunc:
                exp = exp[:-1]
            ok = (len(exp) <= len(rows) if trunc else len(exp) == len(rows)) and all(
                len(e) == len(r) and all(same(x, y) for x, y in zip(e, r)) for e, r in zip(exp, rows))
            if not ok:
                problems.append('Ergebnis weicht vom Kommentar ab.\n    erwartet:    ' + ' / '.join(b[1:]) +
                                '\n    tatsächlich: ' + ' / '.join(' | '.join(r) for r in rows))
            break
    for j, b in enumerate(blocks):
        hc = cells(b[0])
        if j not in used and len(b) >= 2 and len(hc) >= 2 and all(IDENT.match(c) for c in hc):
            problems.append('Ergebniskommentar „' + b[0] + '“ passt zu keiner Abfrage (Spaltennamen oder Reihenfolge prüfen).')
    return problems


def show(results, notices):
    parts = ['NOTICE: ' + n for n in notices]
    for hdr, rows in results:
        parts.append('\n'.join([' | '.join(hdr)] + [' | '.join(r) for r in rows]))
    return '\n\n'.join(parts)


RUN = {'sqlite': run_sqlite, 'pg': run_pg, 'mysql': run_mysql, 'mssql': run_mssql}[ENGINE]


def job(j):
    try:
        r = RUN(j['script'])
        results, notices = r if isinstance(r, tuple) else (r, [])
        problems = compare(j['script'], results)
        return {'id': j['id'], 'ok': not problems, 'error': None, 'problems': problems, 'output': show(results, notices)}
    except Exception as e:
        msg = str(e).strip().splitlines()
        return {'id': j['id'], 'ok': False, 'error': type(e).__name__ + ': ' + ' '.join(msg[:4]), 'problems': [], 'output': ''}


# Erst eine Verbindung abwarten (Container-Start), dann parallel arbeiten.
if JOBS and ENGINE != 'sqlite':
    first = [job(JOBS[0])]
    rest = JOBS[1:]
else:
    first, rest = [], JOBS
with cf.ThreadPoolExecutor(max_workers=1 if ENGINE == 'sqlite' else int(os.environ.get('SQL_WORKERS', '6'))) as ex:
    results = first + list(ex.map(job, rest))
sys.stdout.reconfigure(encoding='utf-8')
print(json.dumps(results, ensure_ascii=False))
