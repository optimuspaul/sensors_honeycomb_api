from utils import neo4j, graphql_client
from behave import *
from uuid import uuid4

use_step_matcher("re")


CREATE_PERSON = """
mutation CreatePerson(
  $person_id: ID
  $first_name: String!
  $surnames: [String!]
  $transparent_classroom_id: Int
  $person_type: PersonType
  $short_name: String
) {
  CreatePerson(
    person_id: $person_id
    first_name: $first_name
    surnames: $surnames
    transparent_classroom_id: $transparent_classroom_id
    person_type: $person_type
    short_name: $short_name
  ) {
    person_id
  }
}


"""

PERSON = """
query {
  Person {
    person_id
    name
    first_name
    surnames
    transparent_classroom_id
    person_type
    short_name
  }
}
"""

PERSON_BY_ID = """
query Person($person_id: ID){
  Person(person_id: $person_id) {
    person_id
    name
    first_name
    surnames
    transparent_classroom_id
    person_type
    short_name
  }
}

"""

ASSIGN_PERSON_TO_ENVIRONMENT = """
mutation AddPersonEnvironments($person_id: ID!, $environment_id: ID!, $start_date: String!) {
    AddPersonEnvironments(from: {person_id: $person_id}, to: {environment_id: $environment_id}, data: {start: {formatted: $start_date}}) {
        from {
            name
        }
        to {
            name
        }
        start {
            formatted
        }
        end {
            formatted
        }
    }
}
"""


ENVIRONMENT_BY_NAME_AT_DATE = """
query Environment($environment_id: ID, $date: String) {
  Environment(filter: {environment_id: $environment_id}) {
    name
    persons(filter: {AND: [{start_lt: {formatted: $date}}, {OR: [{end: null}, {end_gt: {formatted: $date}}]}]}) {
      Person {
        name
        first_name
      }
      start {
        formatted
      }
      end {
        formatted
      }
    }
  }
}
"""


@given(u'a list of persons')
def step_impl(context):
    client = graphql_client()
    context.person_map = dict()
    for row in context.table.rows:
        uuid = row.get("person_id")
        context.person_map[uuid] = {
            "person_id": uuid,
            "first_name": row.get("first_name"),
            "surnames": row.get("surnames").split(","),
            "transparent_classroom_id": int(row.get("transparent_classroom_id")),
            "person_type": row.get("person_type"),
            "short_name": row.get("short_name"),
        }
        client.execute(CREATE_PERSON, context.person_map[uuid])


@then(u'there are `(?P<num>[0-9]*)` persons')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(PERSON)
    persons = result.get("Person")
    assert len(persons) == int(num)
    for person in persons:
        uuid = person.get("person_id")
        expected = context.person_map[uuid]
        for key in expected.keys():
            assert person[key] == expected[key]


@then(u'the `(?P<person_id>[0-9]*)` person has a name of `(?P<name>.*)`')
def step_impl(context, person_id, name):
    client = graphql_client()
    result = client.execute(PERSON_BY_ID, {"person_id": person_id})
    print(result)
    persons = result.get("Person")
    assert len(persons) == 1
    assert persons[0]["name"] == name


@when(u'person `(?P<person_id>[0-9]*)` is assigned to `(?P<environment>[0-9]*)` at `(?P<date>.*)`')
def step_impl(context, person_id, environment, date):
    client = graphql_client()
    result = client.execute(ASSIGN_PERSON_TO_ENVIRONMENT, {"person_id": person_id, "environment_id": environment, "start_date": date})
    print(result)
    AddPersonEnvironments = result.get("AddPersonEnvironments")
    assert AddPersonEnvironments['to']['name'] is not None
    assert AddPersonEnvironments['from']['name'] is not None
    assert AddPersonEnvironments['start']["formatted"][:-1] == date[:-9]


@then(u'the `(?P<environment>[0-9]*)` has `(?P<num>[0-9]*)` person assignments at  `(?P<date>.*)`')
def step_impl(context, environment, num, date):
    client = graphql_client()
    result = client.execute(ENVIRONMENT_BY_NAME_AT_DATE, {"environment_id": environment, "date": date})
    env = result.get("Environment")
    print(result)
    assert len(env) == 1
    assert len(env[0]['persons']) == int(num)
