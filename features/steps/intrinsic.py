from uuid import uuid4

import sure
from behave import *

from utils import neo4j, graphql_client, table_row_dict

use_step_matcher("re")


CREATE_INTRINSIC_CALIBRATION = """
mutation CreateIntrinsicCalibration(
    $intrinsic_calibration_id: ID
    $distortion_coefficients: [Float!]!
    $image_width: Int!
    $image_height: Int!
) {
  CreateIntrinsicCalibration(
        intrinsic_calibration_id: $intrinsic_calibration_id
        distortion_coefficients: $distortion_coefficients
        image_width: $image_width
        image_height: $image_height
    ){
    intrinsic_calibration_id
  }
}
"""

CREATE_MATRIX = """
mutation CreateMatrix(
    $matrix_id: ID
    $components: [Float!]!
    $width: Int!
    $height: Int!
) {
  CreateMatrix(
        matrix_id: $matrix_id
        components: $components
        width: $width
        height: $height
    ){
    matrix_id
  }
}
"""

INTRINSIC_CALIBRATIONS = """
query IntrinsicCalibration($id: ID!) {
    IntrinsicCalibration(intrinsic_calibration_id: $id) {
        intrinsic_calibration_id
        image_width
    }
}

"""


INTRINSIC_CALIBRATIONS_WITHMATRIX = """
query IntrinsicCalibration($id: ID!) {
    IntrinsicCalibration(intrinsic_calibration_id: $id) {
        intrinsic_calibration_id
        image_width
        camera_matrix {
            matrix_id
            components
        }
    }
}

"""


MATRIX = """
query Matrix($id: ID!) {
    Matrix(matrix_id: $id) {
        matrix_id
        height
        width
        components
        calibration {
            intrinsic_calibration_id
        }
    }
}

"""


@given(u'a list of Matrix')
def step_impl(context):
    client = graphql_client()
    context.matricies = dict()
    for row in context.table.rows:
        uuid, obj = table_row_dict(row)
        context.matricies[uuid] = obj
        result = client.execute(CREATE_MATRIX, context.matricies[uuid])
        item = result.get("CreateMatrix")
        item.get("matrix_id").should.equal(uuid)


@given(u'a list of IntrinsicCalibrations')
def step_impl(context):
    client = graphql_client()
    context.calibrations = dict()
    for row in context.table.rows:
        uuid, obj = table_row_dict(row)
        context.calibrations[uuid] = obj
        result = client.execute(CREATE_INTRINSIC_CALIBRATION, context.calibrations[uuid])
        item = result.get("CreateIntrinsicCalibration")
        item.get("intrinsic_calibration_id").should.equal(uuid)


@then(u'intrinsic_calibration `(?P<intrinsic_calibration_id>[0-9]+)` has a width of `(?P<width>[0-9]+)`')
def step_impl(context, intrinsic_calibration_id, width):
    client = graphql_client()
    result = client.execute(INTRINSIC_CALIBRATIONS, {"id": intrinsic_calibration_id})
    items = result.get("IntrinsicCalibration")
    items.should.have.length_of(1)
    items[0]["intrinsic_calibration_id"].should.equal(intrinsic_calibration_id)
    print(f'expected: {width}  got {items[0]["image_width"]}')
    items[0]["image_width"].should.equal(int(width))


@then(u'matrix `(?P<matrix_id>[0-9]+)` has a width of `(?P<width>[0-9]+)` a height of `(?P<height>[0-9]+)` and `(?P<components_len>[0-9]+)` components: `(?P<components>[0-9,.]+)`')
def step_impl(context, matrix_id, width, height, components_len, components):
    client = graphql_client()
    result = client.execute(MATRIX, {"id": matrix_id})
    items = result.get("Matrix")
    items.should.have.length_of(1)
    items[0]["matrix_id"].should.equal(matrix_id)
    int(width).should.be.equal(items[0]["width"])
    int(height).should.be.equal(items[0]["height"])
    items[0]["components"].should.have.length_of(int(components_len))
    # [float(c) for c in components.split(",")].should.be.equal([float(c) for c in items[0]["components"]])
    expected = [float(c) for c in components.split(",")]
    found = [float(c) for c in items[0]["components"]]
    print(expected)
    print(found)
    found.should.equal(expected)



ADDINTRINSICCALIBRATIONCAMERA_MATRIX = """
mutation AddMatrixCalibration(
  $matrix_id: ID!
  $intrinsic_calibration_id: ID!
) {
  AddMatrixCalibration(
    from: {intrinsic_calibration_id: $intrinsic_calibration_id}
    to: {matrix_id: $matrix_id}
  ) {
    from {
      intrinsic_calibration_id
    }
    to {
      matrix_id
    }
  }
}


"""


@when(u'assigning Matrix `(?P<matrix_id>[0-9]+)` to IntrinsicCalibration `(?P<intrinsic_calibration_id>[0-9]+)`')
def step_impl(context, intrinsic_calibration_id, matrix_id):
    client = graphql_client()
    result = client.execute(ADDINTRINSICCALIBRATIONCAMERA_MATRIX, {"intrinsic_calibration_id": intrinsic_calibration_id, "matrix_id": matrix_id})
    item = result.get("AddMatrixCalibration")
    item["from"]["intrinsic_calibration_id"].should.equal(intrinsic_calibration_id)
    item["to"]["matrix_id"].should.equal(matrix_id)

@then(u'IntrinsicCalibration `(?P<intrinsic_calibration_id>[0-9]+)` has a camera_matrix `(?P<matrix_id>[0-9]+)` with components: `(?P<components>[0-9,.]+)`')
def step_impl(context, intrinsic_calibration_id, matrix_id, components):
    client = graphql_client()
    result = client.execute(INTRINSIC_CALIBRATIONS_WITHMATRIX, {"id": intrinsic_calibration_id})
    items = result.get("IntrinsicCalibration")
    items.should.have.length_of(1)
    items[0]["intrinsic_calibration_id"].should.equal(intrinsic_calibration_id)
    items[0]["camera_matrix"]["matrix_id"].should.equal(matrix_id)
    expected = [float(c) for c in components.split(",")]
    found = [float(c) for c in items[0]["camera_matrix"]["components"]]
    print(expected)
    print(found)
    found.should.equal(expected)
