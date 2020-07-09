from itertools import chain
import uuid

from db import cursor, graphql_client


def process_nodes(table_name, query, props, sql_override=None):
    print("-" * 80)
    print(f"importing {table_name}")
    print("-" * 80)
    cur = cursor()
    if sql_override is None:
        cur.execute(f"Select * FROM honeycomb.{table_name}")
    else:
        cur.execute(sql_override)
    rows = cur.fetchall()
    gql = graphql_client()
    params = "\n".join([f"${p[0]}: {p[1]}" for p in props])
    inner_params = "\n".join([f"{p[0]}: ${p[0]}" for p in props])
    gql_query = f"""
        mutation {query}(
          {params}
        ) {{
          {query} (
            {inner_params}
          ) {{
            {props[0][0]}
          }}
        }}"""
    for row in rows:
        data = row[1]
        print(row[1].get(props[1][0]))
        gql.execute(gql_query, {p[0]: p[2](data.get(p[0])) if len(p) == 3 else data.get(p[0]) for p in props})


def import_matricies():
    print("-" * 80)
    print("importing matricies")
    print("-" * 80)
    cur = cursor()
    cur.execute(f"Select * FROM honeycomb.intrinsiccalibrations")
    rows = cur.fetchall()
    gql = graphql_client()
    gql_query = f"""
        mutation MergeMatrix(
            $matrix_id: ID!
            $components: [Float!]!
            $width: Int!
            $height: Int!
        ) {{
          MergeMatrix(
                matrix_id: $matrix_id
                components: $components
                width: $width
                height: $height
            ){{
            matrix_id
          }}
        }}"""
    for row in rows:
        data = row[1]
        matrix = data.get("camera_matrix")
        components = list(chain(*matrix))
        matrix_id = str(uuid.uuid5(uuid.NAMESPACE_OID, str(matrix)))
        print(matrix_id)
        gql.execute(gql_query, {
            "matrix_id": matrix_id,
            "components": components,
            "width": 3,
            "height": 3,
        })


def link_matrix_to_intrinsic():
    print("-" * 80)
    print("linking matricies")
    print("-" * 80)
    cur = cursor()
    cur.execute(f"Select * FROM honeycomb.intrinsiccalibrations")
    rows = cur.fetchall()
    gql = graphql_client()
    gql_query = f"""
        mutation MergeMatrixCalibration(
            $matrix_id: ID!
            $intrinsic_calibration_id: ID!
        ) {{
          MergeMatrixCalibration(
                to: {{matrix_id: $matrix_id}}
                from: {{intrinsic_calibration_id: $intrinsic_calibration_id}}
            ){{
            from {{
                intrinsic_calibration_id
            }}
          }}
        }}"""
    for row in rows:
        data = row[1]
        matrix = data.get("camera_matrix")
        components = list(chain(*matrix))
        matrix_id = str(uuid.uuid5(uuid.NAMESPACE_OID, str(matrix)))
        intrinsic_calibration_id = data.get("intrinsic_calibration_id")
        print(f"{intrinsic_calibration_id} => {matrix_id}")
        gql.execute(gql_query, {
            "matrix_id": matrix_id,
            "intrinsic_calibration_id": intrinsic_calibration_id,
        })


def process_assignments(assigned_type, mutation, from_name, to_name):
    print("-" * 80)
    print(f"linking {assigned_type}")
    print("-" * 80)
    cur = cursor()
    cur.execute('select data from honeycomb.assignments where data@>\'{"assigned_type": "' + assigned_type + '"}\'')
    rows = cur.fetchall()
    gql = graphql_client()
    gql_query = f"""
        mutation {mutation}(
            ${to_name}: ID!
            ${from_name}: ID!
            $start: String!
            $end: String!
        ) {{
          {mutation}(
                to: {{{to_name}: ${to_name}}}
                from: {{{from_name}: ${from_name}}}
                data: {{start: {{formatted: $start}}, end: {{formatted: $end}}}}
            ){{
            from {{
                {from_name}
            }}
          }}
        }}"""
    gql_query_no_end = f"""
        mutation {mutation}(
            ${to_name}: ID!
            ${from_name}: ID!
            $start: String!
        ) {{
          {mutation}(
                to: {{{to_name}: ${to_name}}}
                from: {{{from_name}: ${from_name}}}
                data: {{start: {{formatted: $start}}}}
            ){{
            from {{
                {from_name}
            }}
          }}
        }}"""
    for row in rows:
        data = row[0]
        print(f"{data.get('assigned')} => {data.get('environment')}")
        if data.get("end") is None:
            gql.execute(gql_query_no_end, {
                "environment_id": data.get('environment'),
                from_name: data.get('assigned'),
                "start": data.get('start'),
            })
        else:
            gql.execute(gql_query, {
                "environment_id": data.get('environment'),
                from_name: data.get('assigned'),
                "start": data.get('start'),
                "end": data.get('end'),
            })




def link_device_assignments():
    process_assignments("DEVICE", "MergeEnvironmentDevice_assignments", "device_id", "environment_id")

def link_person_assignments():
    process_assignments("PERSON", "MergeEnvironmentPersons", "person_id", "environment_id")

def link_tray_assignments():
    process_assignments("TRAY", "MergeEnvironmentTray_assignments", "tray_id", "environment_id")
