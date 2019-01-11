exports.typeDefs = `

  # A device is a physical device that in placed in an environment. It contains one or more sensors for collecting data from an environment.
  type Device @beehiveTable(table_name: "devices", pk_column: "device_id") {
    # Honeycomb assigned identifier for the device.
    device_id: ID!
    # A part number for tracking models of devices
    part_number: String
    # A name for the device.
    name: String
    # tags
    tag_id: String
    description: String
    sensors: [SensorInstallation!]! @beehiveRelation(target_type_name: "SensorInstallation", target_field_name: "device")
  }

  enum SensorType {
    CAMERA
    RADIO
    ACCELEROMETER
    GYROSCOPE
    MAGNETOMETER
    INERTIAL
  }

  interface Sensor @beehiveTable(table_name: "sensors", pk_column: "sensor_id", resolve_type_field: "sensor_type") {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
  }

  type Camera implements Sensor @beehiveTable(table_name: "sensors", pk_column: "sensor_id") {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
    default_camera_parameters: CameraParameters
  }

  type GenericSensor implements Sensor @beehiveTable(table_name: "sensors", pk_column: "sensor_id") {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType
    version: Int!
    default_config: String
  }

  type SensorInstallation @beehiveTable(table_name: "sensor_installations", pk_column: "sensor_install_id") {
    sensor_install_id: ID!
    device: Device! @beehiveRelation(target_type_name: "Device")
    description: String
    start: Datetime!
    end: Datetime
    sensor: Sensor! @beehiveRelation(target_type_name: "Sensor")
    tag_id: String
  }

  type DeviceList {
    data: [Device!]!
  }

  type SensorInstallationList {
    data: [SensorInstallation!]!
  }

  type SensorList {
    data: [Sensor!]!
  }

  input DeviceInput {
    name: String
    description: String
  }

  input SensorInstallationInput {
    device: ID!
    sensor: ID!
    description: String
    start: Datetime
    end: Datetime
    tag_id: String
  }

  input SensorInput {
    name: String!
    version: Int
    description: String
    sensor_type: SensorType!
  }

  extend type Query {
    # Gets the list of devices
    devices(envId: String, page: PaginationInput): DeviceList! @beehiveList(target_type_name: "Device")
    # Gets the list of sensors
    sensors(page: PaginationInput): SensorList! @beehiveList(target_type_name: "Sensor")
    # list of SensorInstallations
    sensorInstallations(page: PaginationInput): SensorInstallationList! @beehiveList(target_type_name: "SensorInstallation")
  }

  extend type Mutation {
    # adds a new device to the graph
    createDevice(device: DeviceInput): Device @beehiveCreate(target_type_name: "Device")
    # adds a new sensor to the graph
    createSensor(sensor: SensorInput): Sensor @beehiveCreate(target_type_name: "Sensor")
    addSensorToDevice(sensorInstallation: SensorInstallationInput): SensorInstallation @beehiveCreate(target_type_name: "SensorInstallation")
  }

`
