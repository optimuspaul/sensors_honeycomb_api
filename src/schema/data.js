exports.typeDefs = `

type Datapoint @beehiveTable(
                table_name: "datapoints",
                pk_column: "data_id",
                table_type: native,
                native_exclude: ["file"],
                native_indexes: [
                    {name: "created", type: btree, columns: ["created"]},
                    {name: "timestamp", type: btree, columns: ["timestamp"]},
                    {name: "format_ts", type: btree, columns: ["format", "timestamp"]},
                    {name: "associations_ts", type: btree, columns: ["associations", "timestamp"]},
                    {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
                    {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
                    {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
                ]) {
    data_id: ID!
    parents: [Datapoint] @beehiveRelation(target_type_name: "Datapoint")
    # format of the data
    format: String
    # Data stored on S3
    file: S3File @s3file(keyPrefix: "datapoints", bucketName: "wildfower-honeycomb-datapoints-us-east-2", region: "us-east-2")
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Which objects are associated with this data
    associations: [Association!] @beehiveUnionResolver(target_types: ["Device", "Environment", "Person", "Material"])
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # tags used to identify datapoints for classification
    tags: [String!]
}

type DatapointList{
    data: [Datapoint!]!
    page_info: PageInfo!
}

input DatapointInput {
    # format of the data
    format: String
    file: S3FileInput
    timestamp: Datetime!
    associations: [ID!]
    parents: [ID!]
    duration: Int
    source: ID
    source_type: DataSourceType!
    tags: [String!]
}

input DatapointUpdateInput {
    format: String
    timestamp: Datetime
    associations: [ID!]
    parents: [ID!]
    duration: Int
    source: ID
    source_type: DataSourceType
    tags: [String!]
}

type RadioPing @beehiveTable(
    table_name: "radiopings",
    pk_column: "radio_ping_id",
    table_type: native,
    native_exclude: ["signal_strength", "time_of_flight"],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
        {name: "tag_device_ts", type: btree, columns: ["tag_device", "timestamp"]},
        {name: "anchor_device_ts", type: btree, columns: ["anchor_device", "timestamp"]},
        {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
        {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
        {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
    ]
) {
    radio_ping_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Tag device associated with this ping
    tag_device: Device! @beehiveRelation(target_type_name: "Device")
    # Anchor device associated with this ping
    anchor_device: Device! @beehiveRelation(target_type_name: "Device")
    # Signal strength of the ping
    signal_strength: Float
    # Time of flight of the ping
    time_of_flight: Float
    # Source of the data
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    # Source type of the data source
    source_type: DataSourceType
    # Tags used to identify datapoints for classification
    tags: [String!]
}

type RadioPingList{
    data: [RadioPing!]
    page_info: PageInfo!
}

input RadioPingInput {
    timestamp: Datetime!
    tag_device: ID!
    anchor_device: ID!
    signal_strength: Float
    time_of_flight: Float
    source: ID
    source_type: DataSourceType
    tags: [String!]
}

type Position @beehiveTable(
    table_name: "positions",
    pk_column: "position_id",
    table_type: native,
    native_exclude: ["coordinates", "duration"],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
        {name: "object_ts", type: btree, columns: ["object", "timestamp"]},
        {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
        {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
        {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
    ]
) {
    position_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Coordinate space in which the position is specified
    coordinate_space: CoordinateSpace! @beehiveRelation(target_type_name: "CoordinateSpace")
    # Object associated with this position
    object: Positionable! @beehiveUnionResolver(target_types: ["Device", "Material", "Tray", "Person", "Environment"])
    # Coordinates of the position in the specified coordinate space
    coordinates: [Float!]!
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # tags used to identify datapoints for classification
    tags: [String!]
}

union Positionable @beehiveUnion = Device | Material |Tray | Person | Environment

type PositionList{
    data: [Position!]
    page_info: PageInfo!
}

input PositionInput {
    timestamp: Datetime!
    coordinate_space: ID!
    object: ID!
    coordinates: [Float!]!
    duration: Int
    source: ID
    source_type: DataSourceType
    tags: [String!]
}

type Pose3D @beehiveTable(
    table_name: "poses3d",
    pk_column: "pose_id",
    table_type: native,
    native_exclude: ["keypoints", "duration"],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
        {name: "person_ts", type: btree, columns: ["person", "timestamp"]},
        {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
        {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
        {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
    ]
) {
    pose_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Coordinate space in which the keypoints are specified
    coordinate_space: CoordinateSpace! @beehiveRelation(target_type_name: "CoordinateSpace")
    # Pose model from which the keypoints are derived
    pose_model: PoseModel! @beehiveRelation(target_type_name: "PoseModel")
    # Keypoints of the pose in the specified coordinate space
    keypoints: [Keypoint!]!
    # Person associated with this pose
    person: Person @beehiveRelation(target_type_name: "Person")
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # tags used to identify datapoints for classification
    tags: [String!]
}

type Pose3DList{
    data: [Pose3D!]
    page_info: PageInfo!
}

input Pose3DInput {
    timestamp: Datetime!
    coordinate_space: ID!
    pose_model: ID!
    keypoints: [KeypointInput!]!
    person: ID
    duration: Int
    source: ID
    source_type: DataSourceType
    tags: [String!]
}

type Pose2D @beehiveTable(
    table_name: "poses2d",
    pk_column: "pose_id",
    table_type: native,
    native_exclude: ["keypoints", "duration"],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
        {name: "person_ts", type: btree, columns: ["person", "timestamp"]},
        {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
        {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
        {name: "source_ts_track_label", type: btree, columns: ["source", "timestamp", "track_label"]},
        {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
    ]
) {
    pose_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Camera associated with this pose
    camera: Device! @beehiveRelation(target_type_name: "Device")
    # label of track assigned by pose tracking inference
    track_label: String
    # label of track assigned by pose tracking inference
    # Pose model from which the keypoints are derived
    pose_model: PoseModel! @beehiveRelation(target_type_name: "PoseModel")
    # Keypoints of the pose in the specified coordinate space
    keypoints: [Keypoint!]!
    # Person associated with this pose
    person: Person @beehiveRelation(target_type_name: "Person")
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # tags used to identify datapoints for classification
    tags: [String!]
}

type Pose2DList{
    data: [Pose2D!]
    page_info: PageInfo!
}

input Pose2DInput {
    timestamp: Datetime!
    camera: ID!
    pose_model: ID!
    keypoints: [KeypointInput!]!
    person: ID
    duration: Int
    source: ID
    source_type: DataSourceType
    tags: [String!]
}

enum DataSourceType {
    GROUND_TRUTH
    GENERATED_TEST
    MEASURED
    INFERRED
}

type InferenceExecution @beehiveTable(table_name: "inferences", pk_column: "inference_id") {
    inference_id: ID!
    name: String
    notes: String
    model: String
    version: String
    data_sources: [Datapoint!] @beehiveRelation(target_type_name: "Datapoint")
    data_results: [Datapoint!] @beehiveRelationFilter(target_type_name: "Datapoint", target_field_name: "observer")
    execution_start: Datetime!
}

type InferenceExecutionList {
    data: [InferenceExecution!]!
    page_info: PageInfo!
}

input InferenceExecutionInput {
    name: String
    notes: String
    model: String
    version: String
    data_sources: [ID!]
    data_results: [ID!]
    execution_start: Datetime!
}

input InferenceExecutionUpdateInput {
    name: String
    notes: String
    model: String
    version: String
    data_sources: [ID!]
    data_results: [ID!]
    execution_start: Datetime
}

union Association @beehiveUnion = Device | Environment | Person | Material
union SourceObject @beehiveUnion = Assignment | Person | InferenceExecution | Environment

extend type Query {
    # Get the list of datapoints
    datapoints(page: PaginationInput): DatapointList @beehiveList(target_type_name: "Datapoint")
    # Get a datapoint
    getDatapoint(data_id: ID!): Datapoint @beehiveGet(target_type_name: "Datapoint")
    # Find datapoints using a complex query
    searchDatapoints(query: QueryExpression!, page: PaginationInput): DatapointList @beehiveQuery(target_type_name: "Datapoint")

    # Get the list of radio pings
    radioPings(page: PaginationInput): RadioPingList @beehiveList(target_type_name: "RadioPing")
    # Get a radio ping
    getRadioPing(radio_ping_id: ID!): RadioPing @beehiveGet(target_type_name: "RadioPing")
    # Find positions using a complex query
    searchRadioPings(query: QueryExpression!, page: PaginationInput): RadioPingList @beehiveQuery(target_type_name: "RadioPing")

    # Get the list of positions
    positions(page: PaginationInput): PositionList @beehiveList(target_type_name: "Position")
    # Get a position
    getPosition(position_id: ID!): Position @beehiveGet(target_type_name: "Position")
    # Find positions using a complex query
    searchPositions(query: QueryExpression!, page: PaginationInput): PositionList @beehiveQuery(target_type_name: "Position")

    # Get the list of 3D poses
    poses3D(page: PaginationInput): Pose3DList @beehiveList(target_type_name: "Pose3D")
    # Get a 3D pose
    getPose3D(pose_id: ID!): Pose3D @beehiveGet(target_type_name: "Pose3D")
    # Find 3D poses using a complex query
    searchPoses3D(query: QueryExpression!, page: PaginationInput): Pose3DList @beehiveQuery(target_type_name: "Pose3D")

    # Get the list of 2D poses
    poses2D(page: PaginationInput): Pose2DList @beehiveList(target_type_name: "Pose2D")
    # Get a 2D pose
    getPose2D(pose_id: ID!): Pose2D @beehiveGet(target_type_name: "Pose2D")
    # Find 2D poses using a complex query
    searchPoses2D(query: QueryExpression!, page: PaginationInput): Pose2DList @beehiveQuery(target_type_name: "Pose2D")

    # Get the list of inference executions
    inferenceExecutions(page: PaginationInput): InferenceExecutionList @beehiveList(target_type_name: "InferenceExecution")
    # Get an inference execution
    getInferenceExecution(inference_id: ID!): InferenceExecution! @beehiveGet(target_type_name: "InferenceExecution")
    # Find inference executions based on one or more of their properties
    findInferenceExecutions(name: String, model: String, version: String, page: PaginationInput): InferenceExecutionList @beehiveSimpleQuery(target_type_name: "InferenceExecution")
    # Find materials using a complex query
    searchInferenceExecutions(query: QueryExpression!, page: PaginationInput): InferenceExecutionList @beehiveQuery(target_type_name: "InferenceExecution")
}

extend type Mutation {
    # Create a new datapoint
    createDatapoint(datapoint: DatapointInput): Datapoint @beehiveCreate(target_type_name: "Datapoint", s3_file_fields: ["file"])
    # Delete a datapoint
    deleteDatapoint(data_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Datapoint")

    # Create a new radio ping
    createRadioPing(radioPing: RadioPingInput): RadioPing @beehiveCreate(target_type_name: "RadioPing")
    # Delete a radio ping
    deleteRadioPing(radio_ping_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "RadioPing")

    # Create a new position
    createPosition(position: PositionInput): Position @beehiveCreate(target_type_name: "Position")
    # Delete a position
    deletePosition(position_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Position")

    # Create a new 3D pose
    createPose3D(pose3D: Pose3DInput): Pose3D @beehiveCreate(target_type_name: "Pose3D")
    # Delete a 3D pose
    deletePose3D(pose_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose3D")

    # Create a new 2D pose
    createPose2D(pose2D: Pose2DInput): Pose2D @beehiveCreate(target_type_name: "Pose2D")
    # Delete a 2D pose
    deletePose2D(pose_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose2D")

    tagDatapoint(data_id: ID!, tags: [String!]!): Datapoint! @beehiveListFieldAppend(target_type_name: "Datapoint", field_name: "tags", input_field_name: "tags")
    untagDatapoint(data_id: ID!, tags: [String!]!): Datapoint! @beehiveListFieldDelete(target_type_name: "Datapoint", field_name: "tags", input_field_name: "tags")

    # Create a new inference execution
    createInferenceExecution(inferenceExecution: InferenceExecutionInput): InferenceExecution @beehiveCreate(target_type_name: "InferenceExecution")
    # Update an inference execution
    updateInferenceExecution(inference_id: ID!, inferenceExecution: InferenceExecutionUpdateInput): InferenceExecution @beehiveUpdate(target_type_name: "InferenceExecution")
    # Delete an inference execution
    deleteInferenceExecution(inference_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "InferenceExecution")
}


`;
