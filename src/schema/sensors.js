exports.typeDefs = `

  type Device {
    device_id: ID!
    name: String
    sensors: [Sensor!]!
    created: Datetime!
  }

  enum SensorType {
    CAMERA
    RADIO
    ACCELEROMETER
    GYROSCOPE
    MAGNETOMETER
    INERTIAL
  }

  interface Sensor {
    sensor_id: ID!
    name: String!
    sensor_type: SensorType
    version: Int!
    device: Device!
    created: Datetime!
  }

  type Camera implements Sensor {
    sensor_id: ID!
    name: String!
    sensor_type: SensorType
    version: Int!
    device: Device!
    created: Datetime!
    currentCalibration: ExtrinsicCameraCalibration
  }

  type GenericSensor implements Sensor {
    sensor_id: ID!
    name: String!
    sensor_type: SensorType
    version: Int!
    device: Device!
    created: Datetime!
  }

  type ExtrinsicCameraCalibration {
    camera: Camera!
    start: Datetime!
    end: Datetime
    rotation: Tuple!
    tranlation: Tuple!
  }

  type DeviceList {
    data: [Device!]!
  }

  input DeviceInput {
    name: String
    sensors: [SensorInput!]
  }
  
  input SensorInput {
    name: String!
    version: Int
    sensor_type: SensorType!
  }

  input ExtrinsicCameraCalibrationInput {
    cameraId: ID!
    rotation: TupleInput!
    tranlation: TupleInput!
  }

`;
