exports.typeDefs = `

  union GeometricObject = SensorInstallation | CoordinateSpace

  interface Tuple {
    x: Float!
    y: Float!
    z: Float!
  }

  type Vector implements Tuple {
    x: Float!
    y: Float!
    z: Float!
  }

  type Point implements Tuple {
    x: Float!
    y: Float!
    z: Float!
  }

  type Pair {
    x: Float!
    y: Float!
  }

  input TupleInput {
    x: Float!
    y: Float!
    z: Float!
  }

  # this needs to be looked at more closely. Not sure I have all the values, I think distortion is in there too.
  type CameraParameters {
    camera_matrix: [Float!]
    distortion_coeffs: [Float!]
  }

  type ExtrinsicCalibration {
    start: Datetime!
    end: Datetime
    translation: Tuple!
    rotation: Tuple!
    # list of the objects involved, must be exactly two
    objects: [GeometricObject!]
  }

  type CoordinateSpace @beehiveTable(table_name: "spaces", pk_column: "space_id") {
    space_id: ID!
    name: String
    axis_names: [String!]!
    origin_description: String
    axis_descriptions: [String!]
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    start: Datetime!
    end: Datetime
  }

  type CoordinateSpaceList {
    data: [CoordinateSpace!]!
    page_info: PageInfo!
  }

  input CoordinateSpaceInput {
    name: String
    axis_names: [String!]!
    origin_description: String
    axis_descriptions: [String!]
    environment: ID!
    start: Datetime!
    end: Datetime
  }

  input CoordinateSpaceUpdateInput {
    name: String
    axis_names: [String!]
    origin_description: String
    axis_descriptions: [String!]
    environment: ID
    start: Datetime
    end: Datetime
  }

  type PositionAssignment @beehiveAssignmentType(table_name: "position_assignments", assigned_field: "assignment", exclusive: true, pk_column: "position_assignment_id") {
    position_assignment_id: ID!
    assignment: Assignment! @beehiveRelation(target_type_name: "Assignment")
    coordinate_space: CoordinateSpace! @beehiveRelation(target_type_name: "CoordinateSpace")
    coordinates: [Float!]!
    description: String
    start: Datetime
    end: Datetime
  }

  type PositionAssignmentList {
    data: [PositionAssignment!]
    page_info: PageInfo
  }

  input PositionAssignmentInput {
    assignment: ID!
    coordinate_space: ID!
    coordinates: [Float!]!
    description: String
    start: Datetime
    end: Datetime
  }

  input PositionAssignmentUpdateInput {
    assignment: ID
    coordinate_space: ID
    coordinates: [Float!]
    description: String
    start: Datetime
    end: Datetime
  }

  input CalibrationInput {
    translation: TupleInput!
    rotation: TupleInput!
  }



  extend type Query {

    # Get the list of coordinate spaces
    coordinateSpaces(page: PaginationInput): CoordinateSpaceList @beehiveList(target_type_name: "CoordinateSpace")
    # Get a coordinate space
    getCoordinateSpace(space_id: ID!): CoordinateSpace @beehiveGet(target_type_name: "CoordinateSpace")
    # Get a coordinateSpace (DEPRECATED; use getCoordinateSpace instead)
    coordinateSpace(space_id: ID): CoordinateSpace! @beehiveGet(target_type_name: "CoordinateSpace")
    # Find coordinate spaces based on one or more of their properties
    findCoordinateSpaces(name: String, environment: ID, page: PaginationInput): CoordinateSpaceList @beehiveSimpleQuery(target_type_name: "CoordinateSpace")
    # Find coordinateSpace(s) (DEPRECATED; use findCoordinateSpaces instead)
    findCoordinateSpace(environment: ID, name: String, page:PaginationInput): CoordinateSpaceList! @beehiveSimpleQuery(target_type_name: "CoordinateSpace")
    # Find coordinate spaces using a complex query
    searchCoordinateSpaces(query: QueryExpression!, page: PaginationInput): CoordinateSpaceList @beehiveQuery(target_type_name: "CoordinateSpace")

    # Get the list of position assignments
    positionAssignments(page: PaginationInput): PositionAssignmentList @beehiveList(target_type_name: "PositionAssignment")
    # Get a position assignment
    getPositionAssignment(position_assignment_id: ID!): PositionAssignment @beehiveGet(target_type_name: "PositionAssignment")
    # Find position assignments based on one or more of their properties
    findPositionAssignments(assignment: ID, coordinate_space: ID, page: PaginationInput): PositionAssignmentList @beehiveSimpleQuery(target_type_name: "PositionAssignment")
    # Find position assignments using a complex query
    searchPositionAssignments(query: QueryExpression!, page: PaginationInput): PositionAssignmentList @beehiveQuery(target_type_name: "PositionAssignment")
  }

  extend type Mutation {
    # Create a new coordinate space
    createCoordinateSpace(coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveCreate(target_type_name: "CoordinateSpace")
    # Update a coordinate space
    updateCoordinateSpace(space_id: ID!, coordinateSpace: CoordinateSpaceUpdateInput): CoordinateSpace @beehiveUpdate(target_type_name: "CoordinateSpace")
    # Delete a coordinate space
    deleteCoordinateSpace(space_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "CoordinateSpace")

    # Create a new position assignment
    createPositionAssignment(positionAssignment: PositionAssignmentInput!): PositionAssignment @beehiveCreate(target_type_name: "PositionAssignment")
    # Update a position assignment
    updatePositionAssignment(position_assignment_id: ID!, positionAssignment: PositionAssignmentUpdateInput): PositionAssignment @beehiveUpdate(target_type_name: "PositionAssignment")
    # Delete a position assignment
    deletePositionAssignment(position_assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PositionAssignment")
  }


`;
