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
    origin_description: String
    x_axis_description: String
    y_axis_description: String
    z_axis_description: String
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    start: Datetime!
    end: Datetime
  }

  type CoordinateSpaceList {
    data: [CoordinateSpace!]!
    page_info: PageInfo!
  }

  type PositionAssignment @beehiveAssignmentType(table_name: "position_assignments", assigned_field: "device", exclusive: true, pk_column: "position_assignment_id") {
    position_assignment_id: ID!
    device: Device! @beehiveRelation(target_type_name: "Device")
    coordinate_space: CoordinateSpace! @beehiveRelation(target_type_name: "CoordinateSpace")
    locaton: Point!
    description: String
    start: Datetime
    end: Datetime
  }

  input CoordinateSpaceInput {
    name: String
    origin_description: String
    x_axis_description: String
    y_axis_description: String
    z_axis_description: String
    environment: ID!
    start: Datetime!
    end: Datetime
  }

  input TupleInput {
    x: Float!
    y: Float!
    z: Float!
  }

  input CalibrationInput {
    translation: TupleInput!
    rotation: TupleInput!
  }

  input PositionAssignmentInput {
    device: ID!
    coordinate_space: ID!
    locaton: TupleInput!
    description: String
    start: Datetime
    end: Datetime
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
  }

  extend type Mutation {

    # Create a new coordinate space
    createCoordinateSpace(coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveCreate(target_type_name: "CoordinateSpace")
    # Update a coordinate space
    updateCoordinateSpace(space_id: ID!, coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveUpdate(target_type_name: "CoordinateSpace")
    # Delete a coordinate space
    deleteCoordinateSpace(space_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "CoordinateSpace")


    # Sets the static Position of a Device in the CoordinateSpace
    createPositionAssignment(positionAssignment: PositionAssignmentInput!): PositionAssignment @beehiveCreate(target_type_name: "PositionAssignment")
  }


`;
