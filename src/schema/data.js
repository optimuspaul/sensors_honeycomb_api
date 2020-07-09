exports.typeDefs = `

type Video {
    video_id: ID!
    # format of the data
    format: String
    # Data stored on S3 #### TODO # REDO this for Neo #####
    # file: S3File @s3file(keyPrefix: "datapoints", bucketName: "wildfower-honeycomb-datapoints-us-east-2", region: "us-east-2")
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: DateTime!
    # Which objects are associated with this data
    associations: [Association!] @relation(name: "associated_with", direction: "IN")
    # duration of the data included in this observation. time should be expressed in milliseconds.
    duration: Int
    # where did the data originate
    device: Device!
    # tags used to identify datapoints for classification
    tags: [String!]
    # 2D poses associated with this video
    poses2d: [Pose2D!] @relation(name: "inferred_from", direction: "IN")
    # 3D poses associated with this video
    poses3d: [Pose3D!] @relation(name: "reconstructed_with", direction: "IN")
}

type RadioPing {
    radio_ping_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: DateTime!
    # Tag device associated with this ping
    tag_device: Device!
    # Anchor device associated with this ping
    anchor_device: Device!
    # Signal strength of the ping
    signal_strength: Float
    # Time of flight of the ping
    time_of_flight: Float
    # Source of the data
    source: SourceObject
    category: DataCategory
    tags: [String!]
}

type Position {
    position_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: DateTime!
    # Coordinate space in which the position is specified
    coordinate_space: CoordinateSpace!
    # Object associated with this position
    object: Positionable!
    # Coordinates of the position in the specified coordinate space
    coordinates: [Float!]!
    # where did the data originate
    source: SourceObject
    category: DataCategory
    tags: [String!]
}

union Positionable = Device | Material | Tray | Person | Environment

type Pose3D {
    pose_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: DateTime!
    # Coordinate space in which the keypoints are specified
    coordinate_space: CoordinateSpace!
    # Pose model from which the keypoints are derived
    pose_model: PoseModel!
    # Label of track assigned by pose tracking inference
    track_label: String
    # Keypoints of the pose in the specified coordinate space
    keypoints: [Keypoint!]!
    # Quality of the pose
    quality: Float
    # Person associated with this pose
    person: Person
    # where did the data originate
    source: SourceObject
    category: DataCategory
    tags: [String!]
}

type Pose2D {
    pose_id: ID!
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: DateTime!
    # Camera associated with this pose
    camera: Device!
    # Label of track assigned by pose tracking inference
    track_label: String
    # Pose model from which the keypoints are derived
    pose_model: PoseModel!
    # Keypoints of the pose in the specified coordinate space
    keypoints: [Keypoint!]!
    # Quality of the pose
    quality: Float
    # Person associated with this pose
    person: Person
    # where did the data originate
    source: SourceObject
    category: DataCategory
    tags: [String!]
    # video that was the source of this pose
    video: Video
}

enum DataCategory {
    GROUND_TRUTH
    GENERATED_TEST
    MEASURED
    INFERRED
}

type InferenceExecution {
    inference_id: ID!
    name: String
    notes: String
    model: String
    version: String
    # data_sources: [Datapoint!]
    # data_results: [Datapoint!]
    execution_start: DateTime!
}

union Association = Device | Environment | Person | Material
union SourceObject = Device | Person | InferenceExecution | Environment

`;
