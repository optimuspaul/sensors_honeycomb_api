from uuid import uuid4

import sure
from behave import *

from utils import neo4j, graphql_client, table_row_dict

use_step_matcher("re")


CREATE_COORDINATE_SPACE = """
mutation CreateCoordinateSpace(
  $space_id: ID
  $name: String
  $axis_names: [String!]!
  $origin_description: String
  $axis_descriptions: [String!]
  $start: String!
) {
  CreateCoordinateSpace(
    space_id: $space_id
    name: $name
    start: {formatted: $start}
    axis_names: $axis_names
    origin_description: $origin_description
    axis_descriptions: $axis_descriptions
  ) {
    space_id
    name
    origin_description
    axis_names
  }
}
"""


COORDINATE_SPACE = """
query {
  CoordinateSpace {
    space_id
  }
}
"""


@given(u'a list of CoordinateSpaces')
def step_impl(context):
    client = graphql_client()
    context.matricies = dict()
    for row in context.table.rows:
        uuid, obj = table_row_dict(row)
        context.matricies[uuid] = obj
        result = client.execute(CREATE_COORDINATE_SPACE, context.matricies[uuid])
        space = result.get("CreateCoordinateSpace")
        space.get("space_id").should.equal(uuid)
        space.get("name").should.equal(context.matricies[uuid]['name'])
        space.get("axis_names").should.equal(context.matricies[uuid]['axis_names'])
        space.get("origin_description").should.equal(context.matricies[uuid]['origin_description'])


@then(u'there are `(?P<num>[0-9]+)` CoordinateSpaces')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(COORDINATE_SPACE)
    spaces = result.get("CoordinateSpace")
    spaces.should.have.length_of(int(num))


CREATEEXTRINSICCALIBRATION = """
mutation CreateExtrinsicCalibration(
  $extrinsic_calibration_id: ID
  $translation_vector: [Float!]!
  $rotation_vector: [Float!]!
) {
  CreateExtrinsicCalibration(
    extrinsic_calibration_id: $extrinsic_calibration_id
    translation_vector: $translation_vector
    rotation_vector: $rotation_vector
  ) {
    extrinsic_calibration_id
  }
}
"""


@given(u'a list of ExtrinsicCalibrations')
def step_impl(context):
    client = graphql_client()
    context.matricies = dict()
    for row in context.table.rows:
        uuid, obj = table_row_dict(row)
        context.matricies[uuid] = obj
        result = client.execute(CREATEEXTRINSICCALIBRATION, context.matricies[uuid])
        calibration = result.get("CreateExtrinsicCalibration")
        calibration.get("extrinsic_calibration_id").should.equal(uuid)


ADDCOORDINATESPACEEXTRINSIC_CALIBRATIONS = """
mutation AddExtrinsicCalibrationCoordinate_space(
  $extrinsic_calibration_id: ID!
  $space_id: ID!
  $start: String!
) {
  AddExtrinsicCalibrationCoordinate_space(
    from: { extrinsic_calibration_id: $extrinsic_calibration_id }
    to: { space_id: $space_id }
    data: { start: { formatted: $start } }
  ) {
    start {
      formatted
    }
    from {
      extrinsic_calibration_id
    }
    to {
      space_id
    }
  }
}

"""


@when(u'ExtrinsicCalibration `(?P<extrinsic_calibration_id>[0-9]+)` is linked to `(?P<space_id>[0-9]+)` space starting `(?P<start>.*)`')
def step_impl(context, extrinsic_calibration_id, space_id, start):
    client = graphql_client()
    result = client.execute(ADDCOORDINATESPACEEXTRINSIC_CALIBRATIONS, {"extrinsic_calibration_id": extrinsic_calibration_id, "space_id": space_id, "start": start})
    calibration = result.get("AddExtrinsicCalibrationCoordinate_space")
    calibration.get("to").get("space_id").should.equal(space_id)
    calibration.get("from").get("extrinsic_calibration_id").should.equal(extrinsic_calibration_id)


EXTRINSICCALIBRATIONS = """
query {
  ExtrinsicCalibration {
    extrinsic_calibration_id
    rotation_vector
    coordinate_space {
      CoordinateSpace {
        space_id
      }
    }
  }
}
"""


@then(u'there are `(?P<num>[0-9]+)` ExtrinsicCalibrations')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(EXTRINSICCALIBRATIONS)
    calibrations = result.get("ExtrinsicCalibration")
    calibrations.should.have.length_of(int(num))


EXTRINSICCALIBRATION = """
query ExtrinsicCalibration($extrinsic_calibration_id: ID){
  ExtrinsicCalibration(extrinsic_calibration_id: $extrinsic_calibration_id){
    extrinsic_calibration_id
    rotation_vector
    coordinate_space {
      CoordinateSpace {
        space_id
      }
    }
  }
}
"""


@then(u'ExtrinsicCalibration `(?P<extrinsic_calibration_id>[0-9]+)` has a rotation_vector of `(?P<rotation_vector>[0-9-,.]+)` and is linked to `(?P<space_id>[0-9]+)` space')
def step_impl(context, extrinsic_calibration_id, rotation_vector, space_id):
    client = graphql_client()
    result = client.execute(EXTRINSICCALIBRATION, {"extrinsic_calibration_id": extrinsic_calibration_id})
    calibration = result.get("ExtrinsicCalibration")[0]
    calibration.get("rotation_vector").should.equal([float(c) for c in rotation_vector.split(',')])
    calibration.get("coordinate_space")[0].get("CoordinateSpace").should.equal({"space_id": space_id})
    calibration.get("extrinsic_calibration_id").should.equal(extrinsic_calibration_id)
