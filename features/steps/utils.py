import os
import json
from collections import OrderedDict
from uuid import uuid4

from dotenv import load_dotenv
from behave import *
from neo4j import GraphDatabase
import requests


load_dotenv()

use_step_matcher("re")


@given(u'a clean database')
def step_impl(context):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        results = session.run("MATCH (n) DETACH DELETE n")

@fixture
def neo4j(context):
    driver = GraphDatabase.driver(
            "neo4j://localhost",
            auth=(os.getenv("NEO_USERNAME"), os.getenv("NEO_PASSWORD")),
            encrypted=False
        )
    yield driver
    driver.close()


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


def graphql_client():
    return Client("http://localhost:4000/graphql")


def table_row_dict(row):
    result = dict()
    uuid = None
    for key, value in row.items():
        typ, name = key.split(":")
        if typ == "id":
            result[name] = uuid = value
        if typ == "s":
            result[name] = value
        if typ == "i":
            result[name] = int(value)
        if typ == "f":
            result[name] = float(value)
        if typ == "sl":
            result[name] = value.split(',')
        if typ == "fl":
            result[name] = [float(v) for v in value.split(',')]
        if typ == "il":
            result[name] = [int(v) for v in value.split(',')]
    return uuid, result
