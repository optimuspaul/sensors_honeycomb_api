exports.typeDefs = `

  type Matrix {
      matrix_id: ID!
      calibration: IntrinsicCalibration @relation(name:"DefinedBy", direction: "IN")
      width: Int!
      height: Int!
      components: [Float!]!
  }


  type IntrinsicCalibration {
    intrinsic_calibration_id: ID!
    device: [InCalibrated!]
    camera_matrix: Matrix @relation(name:"DefinedBy", direction: "OUT")
    distortion_coefficients: [Float!]!
    image_width: Int!
    image_height: Int!
  }


  type InCalibrated @relation(name: "InCalibrated") {
      from: Device!
      to: IntrinsicCalibration!
      start: DateTime!
      end: DateTime
  }

  type ExCalibrated @relation(name: "ExCalibrated") {
      from: Device!
      to: ExtrinsicCalibration!
      start: DateTime!
      end: DateTime
  }

  type ExtrinsicCalibration {
    extrinsic_calibration_id: ID!
    device: [ExCalibrated]!
    coordinate_space: [InSpace!]
    translation_vector: [Float!]!
    rotation_vector: [Float!]!
  }

  type InSpace @relation(name: "InSpace") {
      from: ExtrinsicCalibration!
      to: CoordinateSpace!
      start: DateTime!
      end: DateTime
  }

  type CoordinateSpace {
    space_id: ID!
    name: String
    axis_names: [String!]!
    origin_description: String
    axis_descriptions: [String!]
    environment: Environment!
    start: DateTime!
    end: DateTime
    extrinsic_calibrations: [ExtrinsicCalibration!]
  }

  type PoseModel {
    pose_model_id: ID!
    model_name: String!
    model_variant_name: String
    keypoint_names: [String!]!
    keypoint_descriptions: [String!]!
    # comma colon indexes of linked keypoints. ex: '1:5'
    keypoint_connectors: [String!]!
  }

  type Keypoint {
    coordinates: [Float!]!
    quality: Float
  }


`;
