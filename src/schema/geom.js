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

  type CoordinateSpace {
    name: String!
    environment: Environment!
    start: Datetime!
    end: Datetime
  }

  input CoordinateSpaceInput {
    name: String!
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



`;
