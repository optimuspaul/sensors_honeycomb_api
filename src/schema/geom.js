exports.typeDefs = `

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

  type IntrinsicCalibration @beehiveTable(table_name: "intrinsiccalibrations", pk_column: "intrinsic_calibration_id") {
    intrinsic_calibration_id: ID!
    start: Datetime!
    end: Datetime
    sensor_installation: SensorInstallation! @beehiveRelation(target_type_name: "SensorInstallation")
    camera_matrix: [[Float!]!]!
    distortion_coefficients: [Float!]!
  }

  type IntrinsicCalibrationList {
    data: [IntrinsicCalibration!]!
    page_info: PageInfo!
  }

  input IntrinsicCalibrationInput {
    start: Datetime!
    end: Datetime
    sensor_installation: ID!
    camera_matrix: [[Float!]!]!
    distortion_coefficients: [Float!]!
  }

  input IntrinsicCalibrationUpdateInput {
    start: Datetime
    end: Datetime
    sensor_installation: ID
    camera_matrix: [[Float!]!]
    distortion_coefficients: [Float!]
  }

  type ExtrinsicCalibration @beehiveTable(table_name: "extrinsiccalibrations", pk_column: "extrinsic_calibration_id") {
    extrinsic_calibration_id: ID!
    start: Datetime!
    end: Datetime
    sensor_installation: SensorInstallation! @beehiveRelation(target_type_name: "SensorInstallation")
    coordinate_space: CoordinateSpace! @beehiveRelation(target_type_name: "CoordinateSpace")
    translation_vector: [Float!]!
    rotation_vector: [Float!]!
  }

  type ExtrinsicCalibrationList {
    data: [ExtrinsicCalibration!]!
    page_info: PageInfo!
  }

  input ExtrinsicCalibrationInput {
    start: Datetime!
    end: Datetime
    sensor_installation: ID!
    coordinate_space: ID!
    translation_vector: [Float!]!
    rotation_vector: [Float!]!
  }

  input ExtrinsicCalibrationUpdateInput {
    start: Datetime
    end: Datetime
    sensor_installation: ID
    coordinate_space: ID
    translation_vector: [Float!]
    rotation_vector: [Float!]
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

  type PoseModel @beehiveTable(table_name: "posemodels", pk_column: "pose_model_id") {
    pose_model_id: ID!
    model_name: String!
    model_variant_name: String
    keypoint_names: [String!]!
    keypoint_descriptions: [String!]
    keypoint_connectors: [[Int!]!]
  }

  type PoseModelList {
    data: [PoseModel!]!
    page_info: PageInfo!
  }

  input PoseModelInput {
    model_name: String!
    model_variant_name: String
    keypoint_names: [String!]!
    keypoint_descriptions: [String!]
    keypoint_connectors: [[Int!]!]
  }

  input PoseModelUpdateInput {
    model_name: String
    model_variant_name: String
    keypoint_names: [String!]
    keypoint_descriptions: [String!]
    keypoint_connectors: [[Int!]!]
  }

  type Keypoint {
    coordinates: [Float!]!
    quality: Float
  }

  input KeypointInput {
    coordinates: [Float!]!
    quality: Float
  }

  type PositionAssignment @beehiveTable(table_name: "position_assignments", pk_column: "position_assignment_id") {
    position_assignment_id: ID!
    assigned_type: AssignableTypeEnum
    assigned: Assignable! @beehiveUnionResolver(target_types: ["Device", "Person", "Material", "Tray"])
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
    assigned_type: AssignableTypeEnum
    assigned: ID!
    coordinate_space: ID!
    coordinates: [Float!]!
    description: String
    start: Datetime
    end: Datetime
  }

  input PositionAssignmentUpdateInput {
    assigned_type: AssignableTypeEnum
    assigned: ID
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

    # Get the list of intrinsic calibrations
    intrinsicCalibrations(page: PaginationInput): IntrinsicCalibrationList @beehiveList(target_type_name: "IntrinsicCalibration")
    # Get an intrinsic calibration
    getIntrinsicCalibration(intrinsic_calibration_id: ID!): IntrinsicCalibration @beehiveGet(target_type_name: "IntrinsicCalibration")
    # Find instrinsic calibrations based on one or more of their properties
    findIntrinsicCalibrations(sensor_installation: ID, page: PaginationInput): IntrinsicCalibrationList @beehiveSimpleQuery(target_type_name: "IntrinsicCalibration")
    # Find intrinsic calibrations using a complex query
    searchIntrinsicCalibrations(query: QueryExpression!, page: PaginationInput): IntrinsicCalibrationList @beehiveQuery(target_type_name: "IntrinsicCalibration")

    # Get the list of extrinsic calibrations
    extrinsicCalibrations(page: PaginationInput): ExtrinsicCalibrationList @beehiveList(target_type_name: "ExtrinsicCalibration")
    # Get an extrinsic calibration
    getExtrinsicCalibration(extrinsic_calibration_id: ID!): ExtrinsicCalibration @beehiveGet(target_type_name: "ExtrinsicCalibration")
    # Find extrinsic calibrations based on one or more of their properties
    findExtrinsicCalibrations(sensor_installation: ID, coordinate_space: ID, page: PaginationInput): ExtrinsicCalibrationList @beehiveSimpleQuery(target_type_name: "ExtrinsicCalibration")
    # Find extrinsic calibrations using a complex query
    searchExtrinsicCalibrations(query: QueryExpression!, page: PaginationInput): ExtrinsicCalibrationList @beehiveQuery(target_type_name: "ExtrinsicCalibration")

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

    # Get the list of pose models
    poseModels(page: PaginationInput): PoseModelList @beehiveList(target_type_name: "PoseModel")
    # Get a pose model
    getPoseModel(pose_model_id: ID!): PoseModel @beehiveGet(target_type_name: "PoseModel")
    # Find pose models based on one or more of their properties
    findPoseModels(model_name: String, model_variant_name: String, page: PaginationInput): PoseModelList @beehiveSimpleQuery(target_type_name: "PoseModel")
    # Find pose models using a complex query
    searchPoseModels(query: QueryExpression!, page: PaginationInput): PoseModelList @beehiveQuery(target_type_name: "PoseModel")

    # Get the list of position assignments
    positionAssignments(page: PaginationInput): PositionAssignmentList @beehiveList(target_type_name: "PositionAssignment")
    # Get a position assignment
    getPositionAssignment(position_assignment_id: ID!): PositionAssignment @beehiveGet(target_type_name: "PositionAssignment")
    # Find position assignments based on one or more of their properties
    findPositionAssignments(assigned_type: AssignableTypeEnum, assigned: ID, coordinate_space: ID, page: PaginationInput): PositionAssignmentList @beehiveSimpleQuery(target_type_name: "PositionAssignment")
    # Find position assignments using a complex query
    searchPositionAssignments(query: QueryExpression!, page: PaginationInput): PositionAssignmentList @beehiveQuery(target_type_name: "PositionAssignment")
  }

  extend type Mutation {
    # Create a new instrinsic calibration
    createIntrinsicCalibration(intrinsicCalibration: IntrinsicCalibrationInput): IntrinsicCalibration @beehiveCreate(target_type_name: "IntrinsicCalibration")
    # Update an intrinsic calibration
    updateIntrinsicCalibration(intrinsic_calibration_id: ID!, intrinsicCalibration: IntrinsicCalibrationUpdateInput): IntrinsicCalibration @beehiveUpdate(target_type_name: "IntrinsicCalibration")
    # Delete an intrinsic calibration
    deleteIntrinsicCalibration(intrinsic_calibration_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "IntrinsicCalibration")

    # Create a new extrinsic calibration
    createExtrinsicCalibration(extrinsicCalibration: ExtrinsicCalibrationInput): ExtrinsicCalibration @beehiveCreate(target_type_name: "ExtrinsicCalibration")
    # Update an extrinsic calibration
    updateExtrinsicCalibration(extrinsic_calibration_id: ID!, extrinsicCalibration: ExtrinsicCalibrationUpdateInput): ExtrinsicCalibration @beehiveUpdate(target_type_name: "ExtrinsicCalibration")
    # Delete an extrinsic calibration
    deleteExtrinsicCalibration(extrinsic_calibration_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "ExtrinsicCalibration")

    # Create a new coordinate space
    createCoordinateSpace(coordinateSpace: CoordinateSpaceInput): CoordinateSpace @beehiveCreate(target_type_name: "CoordinateSpace")
    # Update a coordinate space
    updateCoordinateSpace(space_id: ID!, coordinateSpace: CoordinateSpaceUpdateInput): CoordinateSpace @beehiveUpdate(target_type_name: "CoordinateSpace")
    # Delete a coordinate space
    deleteCoordinateSpace(space_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "CoordinateSpace")

    # Create a new pose model
    createPoseModel(poseModel: PoseModelInput): PoseModel @beehiveCreate(target_type_name: "PoseModel")
    # Update a pose model
    updatePoseModel(pose_model_id: ID!, poseModel: PoseModelUpdateInput): PoseModel @beehiveUpdate(target_type_name: "PoseModel")
    # Delete a pose model
    deletePoseModel(pose_model_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PoseModel")

    # Create a new position assignment
    assignToPosition(positionAssignment: PositionAssignmentInput!): PositionAssignment @beehiveCreate(target_type_name: "PositionAssignment")
    # Update a position assignment
    updatePositionAssignment(position_assignment_id: ID!, positionAssignment: PositionAssignmentUpdateInput): PositionAssignment @beehiveUpdate(target_type_name: "PositionAssignment")
    # Delete a position assignment
    deletePositionAssignment(position_assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PositionAssignment")
  }


`;
