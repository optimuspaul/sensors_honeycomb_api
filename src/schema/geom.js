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
    start: DateTime!
    end: DateTime
    device: Device!
    camera_matrix: Matrix @relation(name:"DefinedBy", direction: "OUT")
    distortion_coefficients: [Float!]!
    image_width: Int!
    image_height: Int!
  }

  type ExtrinsicCalibration {
    extrinsic_calibration_id: ID!
    start: DateTime!
    end: DateTime
    device: Device!
    coordinate_space: CoordinateSpace! @relation(name:"InSpace", direction: "OUT")
    translation_vector: [Float!]!
    rotation_vector: [Float!]!
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
    extrinsic_calibrations: [ExtrinsicCalibration!] @relation(name:"InSpace", direction: "IN")
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

  type Position @relation(name: "Position") {
    from: Assignable!
    to: CoordinateSpace!
    coordinates: [Float!]!
    description: String
    start: DateTime!
    end: DateTime
  }

  scalar Keypoint2D
  scalar Keypoint3D

  type Blob {
      id: ID
      keypoints2D: [Keypoint2D!]
      keypoints3D: [Keypoint3D!]
  }

`;
