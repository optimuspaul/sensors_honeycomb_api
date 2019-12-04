from collections import Counter
from datetime import datetime
import json
import os
import psycopg2

print("== begin migration ==")

# prepares a db for a gradual migration of the datapoints, moving to native columns.
conn = psycopg2.connect(f'host={os.environ["PGHOST"]} password={os.environ["POSTGRES_PASSWORD"]} user={os.environ["POSTGRES_USER"]} dbname={os.environ["POSTGRES_DB"]}')
conn.autocommit = True

cur = conn.cursor()
cur.arraysize = 100
wcur = conn.cursor()

cur.execute("SELECT * FROM information_schema.tables WHERE table_schema = 'honeycomb' AND table_name = 'datapoints_v0';")
rows = cur.fetchall()

if rows:
    v0 = True
else:
    v0 = False

cur.execute("SELECT * FROM information_schema.tables WHERE table_schema = 'honeycomb' AND table_name = 'datapoints';")
rows = cur.fetchall()

DATA_EPOCH = datetime(2019, 5, 1)

if rows:
    cur.execute("Select * FROM honeycomb.datapoints LIMIT 0")
    colnames = [desc[0] for desc in cur.description]
    if "source" in colnames and "source_type" in colnames:
        print("datapoints has latest columns")
        if v0:
            cur.execute("SELECT data_id, data, created FROM honeycomb.datapoints_v0 LIMIT 1000")
            batch = cur.fetchall()
            sql = """INSERT INTO honeycomb.datapoints
                    (data_id, data, parents, format, timestamp, associations, duration, source, source_type, tags)
                    VALUES (%(data_id)s, %(data)s, %(parents)s, %(format)s, %(timestamp)s, %(associations)s, %(duration)s, %(source)s, %(source_type)s, %(tags)s) ON CONFLICT DO NOTHING"""
            stats = Counter({"total": 0, "migrate": 0, "skipped": 0})
            while batch:
                print("starting batch")
                for row in batch:
                    stats["total"] += 1
                    created = row[2]
                    if created >= DATA_EPOCH:
                        stats["migrate"] += 1
                        data = row[1]
                        vars = {
                            "data_id": row[0],
                            "data": json.dumps(data),
                            "parents": data.get("parents", None),
                            "format": data.get("format"),
                            "timestamp": data.get("timestamp"),
                            "associations": data.get("associations", None),
                            "duration": int(data.get("duration", 0)),
                            "source": data.get("source").get("source"),
                            "source_type": data.get("source").get("type"),
                            "tags": data.get("tags", None),
                        }
                        wcur.execute(sql, vars=vars)
                        wcur.execute("DELETE FROM honeycomb.datapoints_v0 WHERE data_id = %(id)s", vars={"id": row[0]})
                    else:
                        stats["skipped"] += 1
                cur.execute("SELECT data_id, data, created FROM honeycomb.datapoints_v0 LIMIT 1000")
                batch = cur.fetchall()
                conn.commit()
                print(stats)
        else:
            print("v0 does not exist, nothing to migrate")
    elif not v0:
        print("renaming table")
        cur.execute("ALTER TABLE honeycomb.datapoints RENAME TO datapoints_v0")
        print("<<run again after starting application>>")
    else:
        print("database in invalid state, requires manual cleanup or migration")
else:
    print("datapoints does not exist")
