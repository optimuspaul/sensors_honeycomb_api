from collections import OrderedDict
from datetime import datetime
from functools import lru_cache
import json
import os
import psycopg2
from dotenv import load_dotenv

import requests


load_dotenv("post.env")


@lru_cache(maxsize=1)
def connection():
    conn = psycopg2.connect(f'host={os.environ["PGHOST"]} password={os.environ["PGPASSWORD"]} user={os.environ["PGUSER"]} dbname={os.environ["POSTGRES_DB"]}')
    conn.autocommit = True
    return conn


def cursor():
    conn = connection()
    cur = conn.cursor()
    cur.arraysize = 100
    return cur


class Client(object):

    def __init__(self, uri):
        self.uri = uri
        self.headers = {'Content-Type': 'application/json'}

    def execute(self, query, variables=None):
        payload = OrderedDict({
            'query': query,
            'variables': variables or {},
        })
        request = requests.post(self.uri, data=json.dumps(payload), headers=self.headers, timeout=2)
        request.raise_for_status()
        result = request.json()
        if "errors" in result:
            return result.get("errors")
        return result.get("data")


@lru_cache(maxsize=1)
def graphql_client():
    return Client("http://localhost:4000/graphql")
