exports.typeDefs = `

  # A device is a physical device that in placed in an environment. It contains one or more sensors for collecting data from an environment.
  type Device {
    # Honeycomb assigned identifier for the device.
    device_id: ID!
    # A part number for tracking models of devices
    part_number: String
    # Id of the template the device was derived from, for tracking purposes only.
    device_template_id: ID
    # A name for the device.
    name: String
    # tags
    tag_id: String
    description: String
    sensors: [SensorInstallation!]!
    created: Datetime!
  }

  type DeviceTemplate {
    # Honeycomb assigned identifier for the template.
    device_template_id: ID!
    # A part number for tracking models of devices
    part_number: String
    name: String
    description: String
    sensors: [SensorInstallation!]!
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
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
    created: Datetime!
  }

  type Camera implements Sensor {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
    created: Datetime!
    default_camera_parameters: CameraParameters
  }

  type GenericSensor implements Sensor {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
    created: Datetime!
    default_config: String
  }

  type SensorInstallation {
    sensor_install_id: ID!
    device: Device!
    description: String
    start: Datetime!
    end: Datetime
    sensor: Sensor
    tag_id: String
  }

  type DeviceList {
    data: [Device!]!
  }

  type SensorList {
    data: [Sensor!]!
  }

  input DeviceInput {
    name: String
    description: String
    sensors: [SensorInstallationInput!]
  }

  input SensorInstallationInput {
    device_id: String
    sensor_id: String!
    start: Datetime
    end: Datetime
  }
  
  input SensorInput {
    name: String!
    version: Int
    sensor_type: SensorType!
  }

`;
