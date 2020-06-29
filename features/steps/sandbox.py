from utils import neo4j
from behave import *


use_step_matcher("re")


DEFAULT_DATE = "2020-07-15T10:10:00.000+0000"


@given(u'a location called `(?P<name>[a-zA-Z ]*)`')
def make_location(context, name):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        session.run("MERGE (a:Location{name: $name}) RETURN a", parameters={"name": name})


@given(u'a person named `(?P<name>[a-zA-Z ]*)`')
def make_person(context, name):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        session.run("MERGE (a:Person{name: $name}) RETURN a", parameters={"name": name})


@when(u'`(?P<person>[a-zA-Z ]*)` is assigned to `(?P<location>[a-zA-Z ]*)`')
def assign_person_to_location(context, person, location):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person, "location": location, "date": DEFAULT_DATE}
        session.run(
            "MATCH (:Person{ name: $person})-[r:ASSIGNED]->(:Location) WHERE r.end IS NULL SET r.end = datetime($date);",
            parameters=parameters
        )
        session.run("""
                MATCH (peep:Person{name: $person}),(home:Location{name: $location})
                MERGE (peep)-[r:ASSIGNED{ start: datetime($date)}]->(home)
                ON MATCH SET r.end = NULL
                RETURN type(r);
            """,
            parameters=parameters
        )


@when(u'`(?P<person>[a-zA-Z ]*)` is assigned to `(?P<location>[a-zA-Z ]*)` at `(?P<date>[0-9-:.+T]*)`')
def assign_person_to_location_at_date(context, person, location, date):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person, "location": location, "date": date}
        session.run(
            "MATCH (:Person{ name: $person})-[r:ASSIGNED]->(:Location) WHERE r.end IS NULL SET r.end = datetime($date);",
            parameters=parameters
        )
        session.run("""
                MATCH (peep:Person{name: $person}),(home:Location{name: $location})
                MERGE (peep)-[r:ASSIGNED{ start: datetime($date)}]->(home)
                ON MATCH SET r.end = NULL
                RETURN type(r);
            """,
            parameters=parameters
        )


@then(u'there is a location named `(?P<location>[a-zA-Z ]*)`')
def check_person(context, location):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"location": location}
        results = session.run(
            "MATCH (l:Location{ name: $location})  RETURN l",
            parameters=parameters
        )
        records = list(results)
        print(records)
        assert len(records) == 1
        record = records[0]
        keys = record.keys()
        assert "l" in keys
        assert record.get("l")["name"] == location


@then(u'there is a person named `(?P<person>[a-zA-Z ]*)`')
def check_person(context, person):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person}
        results = session.run(
            "MATCH (p:Person{ name: $person})  RETURN p",
            parameters=parameters
        )
        records = list(results)
        print(records)
        assert len(records) == 1
        record = records[0]
        keys = record.keys()
        assert "p" in keys
        assert record.get("p")["name"] == person


@then(u'`(?P<person>[a-zA-Z ]*)` has an edge to `(?P<location>[a-zA-Z ]*)`')
def check_relationship(context, person, location):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person, "location": location}
        results = session.run(
            "MATCH (p:Person{ name: $person})-[r:ASSIGNED]->(l:Location{name: $location}) return p, r, l",
            parameters=parameters
        )
        records = list(results)
        print(records)
        assert len(records) == 1
        record = records[0]
        keys = record.keys()
        assert "p" in keys
        assert record.get("p")["name"] == person
        assert "r" in keys
        assert record.get("r")["start"] is not None
        assert record.get("r")["end"] is None
        assert "l" in keys
        assert record.get("l")["name"] == location


@then(u'`(?P<person>[a-zA-Z ]*)` has an edge to `(?P<location>[a-zA-Z ]*)` with end')
def check_relationship(context, person, location):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person, "location": location}
        results = session.run(
            "MATCH (p:Person{ name: $person})-[r:ASSIGNED]->(l:Location{name: $location}) return p, r, l",
            parameters=parameters
        )
        records = list(results)
        print(records)
        assert len(records) == 1
        record = records[0]
        keys = record.keys()
        assert "p" in keys
        assert record.get("p")["name"] == person
        assert "r" in keys
        assert record.get("r")["start"] is not None
        assert record.get("r")["end"] is not None
        assert "l" in keys
        assert record.get("l")["name"] == location


@then(u'at `(?P<date>[0-9-:.+T]*)` there are `(?P<qty>[0-9]*)` persons assigned to `(?P<location>[a-zA-Z ]*)`')
def check_assignments(context, date, qty, location):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"date": date, "location": location}
        results = session.run(
            "MATCH (l:Location{name: $location})<-[a:ASSIGNED]-(p:Person) WHERE a.start <= datetime($date) AND (a.end IS NULL OR a.end >= datetime($date)) RETURN p, a, l;",
            parameters=parameters
        )
        records = list(results)
        print(len(records))
        assert len(records) == int(qty)



@then(u'`(?P<person>[a-zA-Z ]*)` is assigned to `(?P<location>[a-zA-Z ]*)` at `(?P<date>[0-9-:.+T]*)`')
def check_assignment(context, person, location, date):
    driver = use_fixture(neo4j, context)
    with driver.session() as session:
        parameters = {"person": person, "date": date}
        results = session.run(
            "MATCH (l:Location)<-[a:ASSIGNED]-(p:Person{name: $person}) WHERE a.start <= datetime($date) AND (a.end IS NULL OR a.end >= datetime($date)) RETURN p, a, l;",
            parameters=parameters
        )
        records = list(results)
        assert len(records) == 1
        record = records[0]
        keys = record.keys()
        assert "l" in keys
        assert record.get("l")["name"] == location
