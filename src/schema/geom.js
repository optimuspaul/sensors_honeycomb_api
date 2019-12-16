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
    name: String!
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
    name: String!
    environment: ID!
    start: Datetime
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
    # Get a coordinateSpace
    coordinateSpace(space_id: ID): CoordinateSpace! @beehiveGet(target_type_name: "CoordinateSpace")
    # Find coordinateSpace(s)
    findCoordinateSpace(environment: ID, name: String, page:PaginationInput): CoordinateSpaceList! @beehiveSimpleQuery(target_type_name: "CoordinateSpace")
  }

  extend type Mutation {
    # Creates a new Coordinate Space within an Environment
    createCoordinateSpace(coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveCreate(target_type_name: "CoordinateSpace")
    # Creates a new Coordinate Space within an Environment
    updateCoordinateSpace(space_id: ID, coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveUpdate(target_type_name: "CoordinateSpace")


    # Sets the static Position of a Device in the CoordinateSpace
    createPositionAssignment(positionAssignment: PositionAssignmentInput!): PositionAssignment @beehiveCreate(target_type_name: "PositionAssignment")
  }


`;
