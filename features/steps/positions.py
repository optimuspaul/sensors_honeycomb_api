from utils import neo4j, graphql_client
from behave import *
from uuid import uuid4

use_step_matcher("re")


@given(u'a list of Positions')
def step_impl(context):
    raise NotImplementedError(u'STEP: Given a list of Positions')
