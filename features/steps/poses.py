from uuid import uuid4

import sure
from behave import *

from utils import neo4j, graphql_client, table_row_dict

use_step_matcher("re")


CREATEPOSEMODEL = """
mutation CreatePoseModel(
  $pose_model_id: ID
  $model_name: String!
  $keypoint_names: [String!]!
  $keypoint_connectors: [String!]!
  $keypoint_descriptions: [String!]!
  $model_variant_name: String!
) {
  CreatePoseModel(
    pose_model_id: $pose_model_id
    model_name: $model_name
    model_variant_name: $model_variant_name
    keypoint_names: $keypoint_names
    keypoint_connectors: $keypoint_connectors
    keypoint_descriptions: $keypoint_descriptions
  ) {
    pose_model_id
  }
}
"""


@given(u'a list of PoseModels')
def step_impl(context):
    client = graphql_client()
    context.models = dict()
    for row in context.table.rows:
        uuid, vars = table_row_dict(row)
        context.models[uuid] = vars
        result = client.execute(CREATEPOSEMODEL, context.models[uuid])
        item = result.get("CreatePoseModel")
        item.get("pose_model_id").should.equal(uuid)


POSEMODEL = """
query {
  PoseModel {
    pose_model_id
  }
}
"""


@then(u'there are `(?P<num>[0-9]+)` PoseModels')
def step_impl(context, num):
    client = graphql_client()
    result = client.execute(POSEMODEL)
    models = result.get("PoseModel")
    models.should.have.length_of(int(num))
