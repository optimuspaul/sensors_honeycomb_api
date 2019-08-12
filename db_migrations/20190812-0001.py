import json
import os
import psycopg2


conn = psycopg2.connect(f'host={os.environ["PGHOST"]} password={os.environ["POSTGRES_PASSWORD"]} user={os.environ["POSTGRES_USER"]} dbname={os.environ["POSTGRES_DB"]}')
conn.autocommit = False

cur = conn.cursor()
wcur = conn.cursor()


def should_migrate(data):
    return "observer" in data


def migrate(data_id, data):
    if "observer" in data:
        observer = data["observer"]
        print(observer)
        del data["observer"]
        data["associations"] = []
        data["source"] = {
            "type": "MEASURED",
            "source": observer,
        }
        data["timestamp"] = data["observed_time"]
        del data["observed_time"]
        wcur.execute("UPDATE honeycomb.datapoints SET data = %s WHERE data_id = %s;", (json.dumps(data), data_id))


cur.execute("SELECT data_id, data FROM honeycomb.datapoints;")

batch = cur.fetchmany(100)

while batch:
    for row in batch:
        if should_migrate(row[1]):
            print(f'{row[0]} will be migrated')
            migrate(row[0], row[1])
    batch = cur.fetchall()
    conn.commit()
