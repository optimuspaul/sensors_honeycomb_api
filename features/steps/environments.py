from utils import neo4j, graphql_client
from behave import *
from uuid import uuid4

use_step_matcher("re")


CREATE_ENVIRONMENT = """
mutation CreateEnvironment(
  $environment_id: ID
  $name: String!
  $transparent_classroom_id: Int
  $description: String
  $location: String
) {
  CreateEnvironment(
    environment_id: $environment_id
    name: $name
    transparent_classroom_id: $transparent_classroom_id
    description: $description
    location: $location
  ) {
    environment_id
    name
  }
}


"""

ENVIRONMENTS = """
query {
  Environment {
    environment_id
    name
    description
    transparent_classroom_id
    location
  }
}
"""

ENVIRONMENTS_BY_NAME = """
query Environment($name: String){
  Environment(name: $name) {
    environment_id
    name
    description
    transparent_classroom_id
    location
  }
}
"""


@given(u'a list of environments')
def step_impl(context):
    client = graphql_client()
    context.environment_map = dict()
    for row in context.table.rows:
        uuid = row.get("environment_id")
        context.environment_map[uuid] = {
            "environment_id": uuid,
            "name": row.get("name"),
            "transparent_classroom_id": 1,
            "description": row.get("description"),
            "location": "Somehwere, NH",
        }
        client.execute(CREATE_ENVIRONMENT, context.environment_map[uuid])


@then(u'there are `(?P<num>[0-9]*)` environments')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(ENVIRONMENTS)
    environments = result.get("Environment")
    assert len(environments) == int(num)
    for env in environments:
        uuid = env.get("environment_id")
        expected = context.environment_map[uuid]
        for key in expected.keys():
            assert env[key] == expected[key]


@then('the `(?P<name>.*)` environment can be verified')
def step_impl(context, name):
    client = graphql_client()
    result = client.execute(ENVIRONMENTS_BY_NAME, {"name": name})
    environments = result.get("Environment")
    assert len(environments) == 1
    assert environments[0]["name"] == name
