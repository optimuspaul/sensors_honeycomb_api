exports.typeDefs = `

  # A device is a physical device that in placed in an environment. It contains one or more sensors for collecting data from an environment.
  type Device @beehiveTable(table_name: "devices", pk_column: "device_id") {
    # Honeycomb assigned identifier for the device.
    device_id: ID!
    # A part number for tracking models of devices
    part_number: String
    # A name for the device.
    name: String!
    # tags
    tag_id: String
    description: String
    sensors: [SensorInstallation!]! @beehiveRelation(target_type_name: "SensorInstallation", target_field_name: "device")
    confgurations: [DeviceConfiguration!] @beehiveAssignmentFilter(target_type_name: "DeviceConfiguration", assignee_field: "device")
  }

  type DeviceConfiguration @beehiveAssignmentType(table_name: "device_configurations", assigned_field: "device", exclusive: true, pk_column: "device_configuration_id") {
    device_configuration_id: ID!
    device: Device! @beehiveRelation(target_type_name: "Device")
    start: Datetime!
    end: Datetime
    properties: [Property!]
  }

  input DeviceConfigurationInput {
    device: ID!
    start: Datetime!
    end: Datetime
    properties: [PropertyInput!]
  }


  enum SensorType {
    CAMERA
    RADIO
    ACCELEROMETER
    GYROSCOPE
    MAGNETOMETER
    INERTIAL
  }

  type Sensor @beehiveTable(table_name: "sensors", pk_column: "sensor_id", resolve_type_field: "sensor_type") {
    sensor_id: ID!
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType!
    version: Int!
    default_config: [Property!]
  }

  type SensorInstallation @beehiveTable(table_name: "sensor_installations", pk_column: "sensor_install_id") {
    sensor_install_id: ID!
    device: Device! @beehiveRelation(target_type_name: "Device")
    description: String
    start: Datetime!
    end: Datetime
    sensor: Sensor! @beehiveRelation(target_type_name: "Sensor")
    tag_id: String
    config: [Property!]
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
    part_number: String
    tag_id: String
  }

  input SensorInstallationInput {
    device: ID!
    sensor: ID!
    description: String
    start: Datetime
    end: Datetime
    tag_id: String
    config: [PropertyInput!]
  }

  input SensorInstallationUpdateInput {
    description: String
    start: Datetime
    end: Datetime
    tag_id: String
    config: [PropertyInput!]
  }

  input SensorInput {
    part_number: String
    name: String!
    description: String
    sensor_type: SensorType!
    version: Int!
    default_config: [PropertyInput!]
  }

  extend type Query {
    # Gets the list of devices
    devices(envId: String, page: PaginationInput): DeviceList! @beehiveList(target_type_name: "Device")
    # Get a device
    device(device_id: ID): Device @beehiveGet(target_type_name: "Device")
    # Find a device based on one or more of it's properties
    findDevice(name: String, part_number: String): DeviceList! @beehiveSimpleQuery(target_type_name: "Device")

    # Gets the list of sensors
    sensors(page: PaginationInput): SensorList! @beehiveList(target_type_name: "Sensor")
    # Get a sensor
    sensor(sensor_id: ID): Sensor @beehiveGet(target_type_name: "Sensor")
    # Find a sensor based on one or more of it's properties
    findSensor(name: String, version: Int): SensorList! @beehiveSimpleQuery(target_type_name: "Sensor")

    # list of SensorInstallations, for debugging mostly
    sensorInstallations(page: PaginationInput): SensorInstallationList! @beehiveList(target_type_name: "SensorInstallation")
  }

  extend type Mutation {
    # adds a new device to the graph
    createDevice(device: DeviceInput): Device @beehiveCreate(target_type_name: "Device")
    # sets the device confguration
    setDeviceConfiguration(deviceConfiguration: DeviceConfigurationInput): DeviceConfiguration @beehiveCreate(target_type_name: "DeviceConfiguration")
    # adds a new sensor to the graph
    createSensor(sensor: SensorInput): Sensor @beehiveCreate(target_type_name: "Sensor")
    # Creates a sensor installation, adding to the sensors list on a Device
    addSensorToDevice(sensorInstallation: SensorInstallationInput): SensorInstallation @beehiveCreate(target_type_name: "SensorInstallation")
    # Update the config for a sensorInstallation
    updateSensorInstall(sensor_install_id: ID, sensorInstallation: SensorInstallationUpdateInput): SensorInstallation @beehiveUpdate(target_type_name: "SensorInstallation")
  }

`
