from uuid import uuid4

import sure
from behave import *

from utils import neo4j, graphql_client, table_row_dict

use_step_matcher("re")


CREATE_DEVICE = """
mutation CreateDevice(
  $device_id: ID
  $name: String
  $device_type: DeviceType
  $description: String
  $serial_number: String
  $tag_id: String
  $mac_address: [String!]
  $part_number: String
) {
  CreateDevice(
    device_id: $device_id
    name: $name
    device_type: $device_type
    description: $description
    serial_number: $serial_number
    tag_id: $tag_id
    mac_address: $mac_address
    part_number: $part_number
  ) {
    device_id
  }
}
"""

DEVICES = """
query {
  Device {
    device_id
    name
    device_type
    description
    serial_number
    tag_id
    mac_address
    part_number
  }
}
"""


@given(u'a list of devices')
def step_impl(context):
    client = graphql_client()
    context.devices = dict()
    for row in context.table.rows:
        uuid, vars = table_row_dict(row)
        context.devices[uuid] = vars
        result = client.execute(CREATE_DEVICE, context.devices[uuid])
        item = result.get("CreateDevice")
        item.get("device_id").should.equal(uuid)


@then(u'there are `(?P<num>[0-9]*)` devices')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(DEVICES)
    devices = result.get("Device")
    devices.should.have.length_of(int(num))
    for device in devices:
        uuid = device.get("device_id")
        expected = context.devices[uuid]
        expected.should.equal(device)



DEVICE_ASSIGN = """
mutation AddEnvironmentDevice_assignments($device_id: ID!, $environment_id: ID!, $start: String!){
  AddEnvironmentDevice_assignments(
    from: { device_id: $device_id }
    to: { environment_id: $environment_id }
    data: { start: { formatted: $start } }
  ) {
    start {
      formatted
    }
  }
}
"""


@when(u'device `(?P<device>[0-9]*)` is assigned to `(?P<environment>[0-9]*)` on `(?P<date>.*)`')
def step_impl(context, device, environment, date):
    client = graphql_client()
    result = client.execute(DEVICE_ASSIGN, {"device_id": device, "environment_id": environment, "start": date})
    result.should.equal({'AddEnvironmentDevice_assignments': {'start': {'formatted': date}}})


ENVIRONMENT_WITH_ALL_ASSIGNMENTS = """
query Environment($environment_id: ID!){
  Environment(environment_id: $environment_id) {
    environment_id
    name
    device_assignments {
      start {
        formatted
      }
      Device {
        device_id
      }
    }
  }
}
"""


@then(u'environment `(?P<environment>[0-9]*)` has `(?P<num>[0-9]*)` assignments')
def step_impl(context, environment, num):
    client = graphql_client()
    result = client.execute(ENVIRONMENT_WITH_ALL_ASSIGNMENTS, {"environment_id": environment})
    envs = result.get("Environment")
    envs.should.have.length_of(1)
    envs[0].get("device_assignments").should.have.length_of(int(num))


ENVIRONMENT_WITH_FILTERED_ASSIGNMENTS = """
query Environment($environment_id: ID!, $date: String){
  Environment(environment_id: $environment_id) {
    environment_id
    name
    device_assignments(
      filter: {
        AND: [
          { start_lte: { formatted: $date } }
          {
            OR: [
              { end: null }
              { end_gt: { formatted: $date } }
            ]
          }
        ]
      }
    ) {
      start {
        formatted
      }
    Device {
      device_id
    }
    }
  }
}
"""



@then(u'environment `(?P<environment>[0-9]*)` has `(?P<num>[0-9]*)` assignments on `(?P<date>.*)`')
def step_impl(context, environment, num, date):
    client = graphql_client()
    result = client.execute(ENVIRONMENT_WITH_FILTERED_ASSIGNMENTS, {"environment_id": environment, "date": date})
    envs = result.get("Environment")
    envs.should.have.length_of(1)
    envs[0].get("device_assignments").should.have.length_of(int(num))
