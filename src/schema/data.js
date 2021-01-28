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
    # 2D poses associated with this datapoint
    poses2d: [Pose2D!] @beehiveRelationFilter(target_type_name: "Pose2D", target_field_name: "datapoint")
    # 3D poses associated with this datapoint
    poses3d: [Pose3D!] @beehiveRelationFilter(target_type_name: "Pose3D", target_field_name: "datapoint")
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
    native_exclude: [
      "keypoints",
      "duration"
    ],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
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
    # Quality of the pose
    quality: Float
    # 2D poses associated with this pose
    poses_2d: [Pose2DPose3DLink!] @beehiveRelationFilter(target_type_name: "Pose2DPose3DLink", target_field_name: "pose_3d")
    # Pose tracks associated with this pose
    pose_tracks: [Pose3DPoseTrack3DLink!] @beehiveRelationFilter(target_type_name: "Pose3DPoseTrack3DLink", target_field_name: "pose_3d")
    # Persons associated with this pose
    persons: [Pose3DPersonLink!] @beehiveRelationFilter(target_type_name: "Pose3DPersonLink", target_field_name: "pose_3d")
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # Pose ID generated when data was being processed locally (if any)
    local_pose_id: String
    # tags used to identify datapoints for classification
    tags: [String!]
    # datapoint (typically a video) that was the source of this pose
    datapoint: Datapoint @beehiveRelation(target_type_name: "Datapoint")
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
    quality: Float
    source: ID
    source_type: DataSourceType
    local_pose_id: String
    tags: [String!]
    datapoint: ID
}

type PoseTrack3D @beehiveTable(
    table_name: "posetracks3d",
    pk_column: "pose_track_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    pose_track_id: ID!
    # Label for this pose track
    track_label: String
    # 3D poses associated with this pose track
    poses_3d: [Pose3DPoseTrack3DLink!] @beehiveRelationFilter(target_type_name: "Pose3DPoseTrack3DLink", target_field_name: "pose_track")
    # Persons associated with this pose track
    persons: [PoseTrack3DPersonLink!] @beehiveRelationFilter(target_type_name: "PoseTrack3DPersonLink", target_field_name: "pose_track")
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # Pose track ID generated when data was being processed locally (if any)
    local_pose_track_id: String
}

type PoseTrack3DList{
    data: [PoseTrack3D!]
    page_info: PageInfo!
}

input PoseTrack3DInput {
    track_label: String
    source: ID
    source_type: DataSourceType
    local_pose_track_id: String
}

type Pose2D @beehiveTable(
    table_name: "poses2d",
    pk_column: "pose_id",
    table_type: native,
    native_exclude: [
      "keypoints",
      "duration"
    ],
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
        {name: "timestamp", type: btree, columns: ["timestamp"]},
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
    # Pose model from which the keypoints are derived
    pose_model: PoseModel! @beehiveRelation(target_type_name: "PoseModel")
    # Keypoints of the pose in the specified coordinate space
    keypoints: [Keypoint!]!
    # Quality of the pose
    quality: Float
    # 3D poses associated with this pose
    poses_3d: [Pose2DPose3DLink!] @beehiveRelationFilter(target_type_name: "Pose2DPose3DLink", target_field_name: "pose_2d")
    # Pose tracks associated with this pose
    pose_tracks: [Pose2DPoseTrack2DLink!] @beehiveRelationFilter(target_type_name: "Pose2DPoseTrack2DLink", target_field_name: "pose_2d")
    # Persons associated with this pose
    persons: [Pose2DPersonLink!] @beehiveRelationFilter(target_type_name: "Pose2DPersonLink", target_field_name: "pose_2d")
    # Track label generated during 2D pose detection
    track_label: String
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # Pose ID generated when data was being processed locally (if any)
    local_pose_id: String
    # tags used to identify datapoints for classification
    tags: [String!]
    # datapoint (typically a video) that was the source of this pose
    datapoint: Datapoint @beehiveRelation(target_type_name: "Datapoint")
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
    quality: Float
    track_label: String
    duration: Int
    source: ID
    source_type: DataSourceType
    local_pose_id: String
    tags: [String!]
    datapoint: ID
}

type PoseTrack2D @beehiveTable(
    table_name: "posetracks2d",
    pk_column: "pose_track_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    pose_track_id: ID!
    # Label for this pose track
    track_label: String
    # 2D poses associated with this pose track
    poses_2d: [Pose2DPoseTrack2DLink!] @beehiveRelationFilter(target_type_name: "Pose2DPoseTrack2DLink", target_field_name: "pose_track")
    # Persons associated with this pose track
    persons: [PoseTrack2DPersonLink!] @beehiveRelationFilter(target_type_name: "PoseTrack2DPersonLink", target_field_name: "pose_track")
    # where did the data originate
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution", "Environment"])
    source_type: DataSourceType
    # Pose track ID generated when data was being processed locally (if any)
    local_pose_track_id: String
}

type PoseTrack2DList{
    data: [PoseTrack2D!]
    page_info: PageInfo!
}

input PoseTrack2DInput {
    track_label: String
    source: ID
    source_type: DataSourceType
    local_pose_track_id: String
}

type Pose2DPose3DLink @beehiveTable(
    table_name: "pose2dpose3dlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 2D pose
    pose_2d: Pose2D! @beehiveRelation(target_type_name: "Pose2D")
    # Linked 3D pose
    pose_3d: Pose3D! @beehiveRelation(target_type_name: "Pose3D")
}

type Pose2DPose3DLinkList{
    data: [Pose2DPose3DLink!]
    page_info: PageInfo!
}

input Pose2DPose3DLinkInput {
    pose_2d: ID!
    pose_3d: ID!
}

type Pose3DPoseTrack3DLink @beehiveTable(
    table_name: "pose3dposetrack3dlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 3D pose
    pose_3d: Pose3D! @beehiveRelation(target_type_name: "Pose3D")
    # Linked 3D pose track
    pose_track: PoseTrack3D! @beehiveRelation(target_type_name: "PoseTrack3D")
}

type Pose3DPoseTrack3DLinkList{
    data: [Pose3DPoseTrack3DLink!]
    page_info: PageInfo!
}

input Pose3DPoseTrack3DLinkInput {
    pose_3d: ID!
    pose_track: ID!
}

type Pose3DPersonLink @beehiveTable(
    table_name: "pose3dpersonlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 3D pose
    pose_3d: Pose3D! @beehiveRelation(target_type_name: "Pose3D")
    # Linked person
    person: Person! @beehiveRelation(target_type_name: "Person")
}

type Pose3DPersonLinkList{
    data: [Pose3DPersonLink!]
    page_info: PageInfo!
}

input Pose3DPersonLinkInput {
    pose_3d: ID!
    person: ID!
}

type PoseTrack3DPersonLink @beehiveTable(
    table_name: "posetrack3dpersonlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 3D pose track
    pose_track: PoseTrack3D! @beehiveRelation(target_type_name: "PoseTrack3D")
    # Linked person
    person: Person! @beehiveRelation(target_type_name: "Person")
}

type PoseTrack3DPersonLinkList{
    data: [PoseTrack3DPersonLink!]
    page_info: PageInfo!
}

input PoseTrack3DPersonLinkInput {
    pose_track: ID!
    person: ID!
}

type Pose2DPoseTrack2DLink @beehiveTable(
    table_name: "pose2dposetrack2dlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 2D pose
    pose_2d: Pose2D! @beehiveRelation(target_type_name: "Pose2D")
    # Linked 2D pose track
    pose_track: PoseTrack2D! @beehiveRelation(target_type_name: "PoseTrack2D")
}

type Pose2DPoseTrack2DLinkList{
    data: [Pose2DPoseTrack2DLink!]
    page_info: PageInfo!
}

input Pose2DPoseTrack2DLinkInput {
    pose_2d: ID!
    pose_track: ID!
}

type Pose2DPersonLink @beehiveTable(
    table_name: "pose2dpersonlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 2D pose
    pose_2d: Pose2D! @beehiveRelation(target_type_name: "Pose2D")
    # Linked person
    person: Person! @beehiveRelation(target_type_name: "Person")
}

type Pose2DPersonLinkList{
    data: [Pose2DPersonLink!]
    page_info: PageInfo!
}

input Pose2DPersonLinkInput {
    pose_2d: ID!
    person: ID!
}

type PoseTrack2DPersonLink @beehiveTable(
    table_name: "posetrack2dpersonlinks",
    pk_column: "link_id",
    table_type: native,
    native_indexes: [
        {name: "created", type: btree, columns: ["created"]},
    ]
) {
    link_id: ID!
    # Linked 2D pose track
    pose_track: PoseTrack2D! @beehiveRelation(target_type_name: "PoseTrack2D")
    # Linked person
    person: Person! @beehiveRelation(target_type_name: "Person")
}

type PoseTrack2DPersonLinkList{
    data: [PoseTrack2DPersonLink!]
    page_info: PageInfo!
}

input PoseTrack2DPersonLinkInput {
    pose_track: ID!
    person: ID!
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

    # Get the list of 3D pose tracks
    poseTracks3D(page: PaginationInput): PoseTrack3DList @beehiveList(target_type_name: "PoseTrack3D")
    # Get a 3D pose track
    getPoseTrack3D(pose_track_id: ID!): PoseTrack3D @beehiveGet(target_type_name: "PoseTrack3D")
    # Find 3D pose tracks using a complex query
    searchPoseTracks3D(query: QueryExpression!, page: PaginationInput): PoseTrack3DList @beehiveQuery(target_type_name: "PoseTrack3D")

    # Get the list of 2D poses
    poses2D(page: PaginationInput): Pose2DList @beehiveList(target_type_name: "Pose2D")
    # Get a 2D pose
    getPose2D(pose_id: ID!): Pose2D @beehiveGet(target_type_name: "Pose2D")
    # Find 2D poses using a complex query
    searchPoses2D(query: QueryExpression!, page: PaginationInput): Pose2DList @beehiveQuery(target_type_name: "Pose2D")

    # Get the list of 2D pose tracks
    poseTracks2D(page: PaginationInput): PoseTrack2DList @beehiveList(target_type_name: "PoseTrack2D")
    # Get a 2D pose track
    getPoseTrack2D(pose_track_id: ID!): PoseTrack2D @beehiveGet(target_type_name: "PoseTrack2D")
    # Find 2D pose tracks using a complex query
    searchPoseTracks2D(query: QueryExpression!, page: PaginationInput): PoseTrack2DList @beehiveQuery(target_type_name: "PoseTrack2D")

    # Get the list of 2D-pose-to-3D-pose links
    pose2DPose3DLinks(page: PaginationInput): Pose2DPose3DLinkList @beehiveList(target_type_name: "Pose2DPose3DLink")
    # Get a 2D-pose-to-3D-pose link
    getPose2DPose3DLink(link_id: ID!): Pose2DPose3DLink @beehiveGet(target_type_name: "Pose2DPose3DLink")
    # Find 2D-pose-to-3D-pose links using a complex query
    searchPose2DPose3DLinks(query: QueryExpression!, page: PaginationInput): Pose2DPose3DLinkList @beehiveQuery(target_type_name: "Pose2DPose3DLink")

    # Get the list of 3D-pose-to-3D-pose-track links
    pose3DPoseTrack3DLinks(page: PaginationInput): Pose3DPoseTrack3DLinkList @beehiveList(target_type_name: "Pose3DPoseTrack3DLink")
    # Get a 3D-pose-to-3D-pose-track link
    getPose3DPoseTrack3DLink(link_id: ID!): Pose3DPoseTrack3DLink @beehiveGet(target_type_name: "Pose3DPoseTrack3DLink")
    # Find 3D-pose-to-3D-pose-track links using a complex query
    searchPose3DPoseTrack3DLinks(query: QueryExpression!, page: PaginationInput): Pose3DPoseTrack3DLinkList @beehiveQuery(target_type_name: "Pose3DPoseTrack3DLink")

    # Get the list of 3D-pose-to-person links
    pose3DPersonLinks(page: PaginationInput): Pose3DPersonLinkList @beehiveList(target_type_name: "Pose3DPersonLink")
    # Get a 3D-pose-to-person link
    getPose3DPersonLink(link_id: ID!): Pose3DPersonLink @beehiveGet(target_type_name: "Pose3DPersonLink")
    # Find 3D-pose-to-person links using a complex query
    searchPose3DPersonLinks(query: QueryExpression!, page: PaginationInput): Pose3DPersonLinkList @beehiveQuery(target_type_name: "Pose3DPersonLink")

    # Get the list of 3D-pose-track-to-person links
    poseTrack3DPersonLinks(page: PaginationInput): PoseTrack3DPersonLinkList @beehiveList(target_type_name: "PoseTrack3DPersonLink")
    # Get a 3D-pose-track-to-person link
    getPoseTrack3DPersonLink(link_id: ID!): PoseTrack3DPersonLink @beehiveGet(target_type_name: "PoseTrack3DPersonLink")
    # Find 3D-pose-track-to-person links using a complex query
    searchPoseTrack3DPersonLinks(query: QueryExpression!, page: PaginationInput): PoseTrack3DPersonLinkList @beehiveQuery(target_type_name: "PoseTrack3DPersonLink")

    # Get the list of 2D-pose-to-2D-pose-track links
    pose2DPoseTrack2DLinks(page: PaginationInput): Pose2DPoseTrack2DLinkList @beehiveList(target_type_name: "Pose2DPoseTrack2DLink")
    # Get a 2D-pose-to-2D-pose-track link
    getPose2DPoseTrack2DLink(link_id: ID!): Pose2DPoseTrack2DLink @beehiveGet(target_type_name: "Pose2DPoseTrack2DLink")
    # Find 2D-pose-to-2D-pose-track links using a complex query
    searchPose2DPoseTrack2DLinks(query: QueryExpression!, page: PaginationInput): Pose2DPoseTrack2DLinkList @beehiveQuery(target_type_name: "Pose2DPoseTrack2DLink")

    # Get the list of 2D-pose-to-person links
    pose2DPersonLinks(page: PaginationInput): Pose2DPersonLinkList @beehiveList(target_type_name: "Pose2DPersonLink")
    # Get a 2D-pose-to-person link
    getPose2DPersonLink(link_id: ID!): Pose2DPersonLink @beehiveGet(target_type_name: "Pose2DPersonLink")
    # Find 2D-pose-to-person links using a complex query
    searchPose2DPersonLinks(query: QueryExpression!, page: PaginationInput): Pose2DPersonLinkList @beehiveQuery(target_type_name: "Pose2DPersonLink")

    # Get the list of 2D-pose-track-to-person links
    poseTrack2DPersonLinks(page: PaginationInput): PoseTrack2DPersonLinkList @beehiveList(target_type_name: "PoseTrack2DPersonLink")
    # Get a 2D-pose-track-to-person link
    getPoseTrack2DPersonLink(link_id: ID!): PoseTrack2DPersonLink @beehiveGet(target_type_name: "PoseTrack2DPersonLink")
    # Find 2D-pose-track-to-person links using a complex query
    searchPoseTrack2DPersonLinks(query: QueryExpression!, page: PaginationInput): PoseTrack2DPersonLinkList @beehiveQuery(target_type_name: "PoseTrack2DPersonLink")

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

    # Create a new 3D pose track
    createPoseTrack3D(poseTrack3D: PoseTrack3DInput): PoseTrack3D @beehiveCreate(target_type_name: "PoseTrack3D")
    # Delete a 3D pose track
    deletePoseTrack3D(pose_track_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PoseTrack3D")

    # Create a new 2D pose
    createPose2D(pose2D: Pose2DInput): Pose2D @beehiveCreate(target_type_name: "Pose2D")
    # Delete a 2D pose
    deletePose2D(pose_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose2D")

    # Create a new 2D pose track
    createPoseTrack2D(poseTrack2D: PoseTrack2DInput): PoseTrack2D @beehiveCreate(target_type_name: "PoseTrack2D")
    # Delete a 2D pose track
    deletePoseTrack2D(pose_track_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PoseTrack2D")

    # Create a new 2D-pose-to-3D-pose link
    createPose2DPose3DLink(pose2DPose3DLink: Pose2DPose3DLinkInput): Pose2DPose3DLink @beehiveCreate(target_type_name: "Pose2DPose3DLink")
    # Delete a 2D-pose-to-3D-pose link
    deletePose2DPose3DLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose2DPose3DLink")

    # Create a new 3D-pose-to-3D-pose-track link
    createPose3DPoseTrack3DLink(pose3DPoseTrack3DLink: Pose3DPoseTrack3DLinkInput): Pose3DPoseTrack3DLink @beehiveCreate(target_type_name: "Pose3DPoseTrack3DLink")
    # Delete a 3D-pose-to-3D-pose-track link
    deletePose3DPoseTrack3DLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose3DPoseTrack3DLink")

    # Create a new 3D-pose-to-person link
    createPose3DPersonLink(pose3DPersonLink: Pose3DPersonLinkInput): Pose3DPersonLink @beehiveCreate(target_type_name: "Pose3DPersonLink")
    # Delete a 3D-pose-to-person link
    deletePose3DPersonLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose3DPersonLink")

    # Create a new 3D-pose-track-to-person link
    createPoseTrack3DPersonLink(poseTrack3DPersonLink: PoseTrack3DPersonLinkInput): PoseTrack3DPersonLink @beehiveCreate(target_type_name: "PoseTrack3DPersonLink")
    # Delete a 3D-pose-track-to-person link
    deletePoseTrack3DPersonLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PoseTrack3DPersonLink")

    # Create a new 2D-pose-to-2D-pose-track link
    createPose2DPoseTrack2DLink(pose2DPoseTrack2DLink: Pose2DPoseTrack2DLinkInput): Pose2DPoseTrack2DLink @beehiveCreate(target_type_name: "Pose2DPoseTrack2DLink")
    # Delete a 2D-pose-to-2D-pose-track link
    deletePose2DPoseTrack2DLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose2DPoseTrack2DLink")

    # Create a new 2D-pose-to-person link
    createPose2DPersonLink(pose2DPersonLink: Pose2DPersonLinkInput): Pose2DPersonLink @beehiveCreate(target_type_name: "Pose2DPersonLink")
    # Delete a 2D-pose-to-person link
    deletePose2DPersonLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Pose2DPersonLink")

    # Create a new 2D-pose-track-to-person link
    createPoseTrack2DPersonLink(poseTrack2DPersonLink: PoseTrack2DPersonLinkInput): PoseTrack2DPersonLink @beehiveCreate(target_type_name: "PoseTrack2DPersonLink")
    # Delete a 2D-pose-track-to-person link
    deletePoseTrack2DPersonLink(link_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "PoseTrack2DPersonLink")

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
