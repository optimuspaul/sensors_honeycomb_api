from uuid import uuid4

import sure
from behave import *

from utils import neo4j, graphql_client

use_step_matcher("re")


CREATE_INTRINSIC_CALIBRATION = """
mutation CreateIntrinsicCalibration(
    $intrinsic_calibration_id: ID
    $start: String
    $end: String
    $distortion_coefficients: [Float!]!
    $image_width: Int!
    $image_height: Int!
) {
  CreateIntrinsicCalibration(
        intrinsic_calibration_id: $intrinsic_calibration_id
        start: {formatted: $start}
        end: {formatted: $end}
        distortion_coefficients: $distortion_coefficients
        image_width: $image_width
        image_height: $image_height
    ){
    intrinsic_calibration_id
    start {
        year
    }
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
        start {
            year
            month
            day
            formatted
            timezone
        }
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

ADDINTRINSICCALIBRATIONCAMERA_MATRIX = """
mutation AddIntrinsicCalibrationCamera_matrix(
  $matrix_id: ID!
  $intrinsic_calibration_id: ID!
) {
  AddIntrinsicCalibrationCamera_matrix(
    to: {matrix_id: $matrix_id}
    from: {intrinsic_calibration_id: $intrinsic_calibration_id}
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

@given(u'a list of Matrix')
def step_impl(context):
    client = graphql_client()
    context.matricies = dict()
    for row in context.table.rows:
        uuid = row.get("matrix_id")
        context.matricies[uuid] = {
            "matrix_id": uuid,
            "height": int(row.get("height")),
            "width": int(row.get("width")),
            "components": [float(n) for n in row.get("components").split(",")],
        }
        result = client.execute(CREATE_MATRIX, context.matricies[uuid])
        item = result.get("CreateMatrix")
        item.get("matrix_id").should.equal(uuid)


@given(u'a list of IntrinsicCalibrations')
def step_impl(context):
    client = graphql_client()
    context.calibrations = dict()
    for row in context.table.rows:
        uuid = row.get("intrinsic_calibration_id")
        context.calibrations[uuid] = {
            "intrinsic_calibration_id": uuid,
            "start": row.get("start"),
            "end": row.get("end"),
            "device": row.get("device"),
            "distortion_coefficients": [float(n) for n in row.get("distortion_coefficients").split(",")],
            "image_width": int(row.get("image_width")),
            "image_height": int(row.get("image_height")),
        }
        result = client.execute(CREATE_INTRINSIC_CALIBRATION, context.calibrations[uuid])
        item = result.get("CreateIntrinsicCalibration")
        item.get("intrinsic_calibration_id").should.equal(uuid)


@then(u'intrinsic_calibration `(?P<intrinsic_calibration_id>[0-9]+)` has a start of `(?P<date>.*)`')
def step_impl(context, intrinsic_calibration_id, date):
    client = graphql_client()
    result = client.execute(INTRINSIC_CALIBRATIONS, {"id": intrinsic_calibration_id})
    items = result.get("IntrinsicCalibration")
    items.should.have.length_of(1)
    items[0]["intrinsic_calibration_id"].should.equal(intrinsic_calibration_id)
    print(f'expected: {date}  got {items[0]["start"]["formatted"]}')
    items[0]["start"]["formatted"].should.equal(date)


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
    [float(c) for c in components.split(",")].should.be.equal(items[0]["components"])


@when(u'assigning Matrix `(?P<matrix_id>[0-9]+)` to IntrinsicCalibration `(?P<intrinsic_calibration_id>[0-9]+)`')
def step_impl(context, intrinsic_calibration_id, matrix_id):
    client = graphql_client()
    result = client.execute(ADDINTRINSICCALIBRATIONCAMERA_MATRIX, {"matrix_id": matrix_id, "intrinsic_calibration_id": intrinsic_calibration_id})
    item = result.get("AddIntrinsicCalibrationCamera_matrix")
    {
        "from": {"intrinsic_calibration_id": intrinsic_calibration_id},
        "to": {"matrix_id": matrix_id}
    }.should.equal(item)


@then(u'IntrinsicCalibration `(?P<intrinsic_calibration_id>[0-9]+)` has a camera_matrix `(?P<matrix_id>[0-9]+)` with components: `(?P<components>[0-9,.]+)`')
def step_impl(context, intrinsic_calibration_id, matrix_id, components):
    client = graphql_client()
    result = client.execute(INTRINSIC_CALIBRATIONS, {"id": intrinsic_calibration_id})
    items = result.get("IntrinsicCalibration")
    items.should.have.length_of(1)
    items[0]["intrinsic_calibration_id"].should.equal(intrinsic_calibration_id)
    items[0]["camera_matrix"]["matrix_id"].should.equal(matrix_id)
    items[0]["camera_matrix"]["components"].should.equal([float(c) for c in components.split(",")])
