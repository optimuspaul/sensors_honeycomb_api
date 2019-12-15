exports.typeDefs = `

  # A device is a physical device that in placed in an environment. It contains one or more sensors for collecting data from an environment.
  type Device @beehiveTable(table_name: "devices", pk_column: "device_id") {
    # Honeycomb assigned identifier for the device.
    device_id: ID!
    # A part number for tracking models of devices
    part_number: String
    # The type of device
    device_type: DeviceType
    # A name for the device.
    name: String
    # tag_id is the information printed on an identifier label on the device itself
    tag_id: String
    # A serial number specific to the device, could be a manufacturer id or a wildflower assigner number that is unique to the device.
    serial_number: String
    # mac address(s) associated with the network interface(s) of the device
    mac_address: [String!]
    # a long description for the device.
    description: String
    sensors: [SensorInstallation!]! @beehiveRelation(target_type_name: "SensorInstallation", target_field_name: "device")
    configurations: [DeviceConfiguration!] @beehiveAssignmentFilter(target_type_name: "DeviceConfiguration", assignee_field: "device")
    assignments: [Assignment!] @beehiveAssignmentFilter(target_type_name: "Assignment", assignee_field: "assigned")
}

  enum DeviceType {
    PI3
    PIZERO
    UWBANCHOR
    UWBTAG
    BLEANCHOR
    BLETAG
    OTHER
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
    page_info: PageInfo!
  }

  type SensorInstallationList {
    data: [SensorInstallation!]!
    page_info: PageInfo!
  }

  type SensorList {
    data: [Sensor!]!
    page_info: PageInfo!
  }

  input DeviceInput {
    name: String
    description: String
    part_number: String
    device_type: DeviceType
    tag_id: String
    # A serial number specific to the device, could be a manufacturer id or a wildflower assigner number that is unique to the device.
    serial_number: String
    # mac address(s) associated with the network interface(s) of the device
    mac_address: [String!]
  }

  input DeviceUpdateInput {
    name: String
    description: String
    part_number: String
    device_type: DeviceType
    tag_id: String
    serial_number: String
    mac_address: [String!]
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
    # Get the list of devices (use of envID argument is DEPRECATED)
    devices(envId: String, page: PaginationInput): DeviceList @beehiveList(target_type_name: "Device")
    # Get a device
    getDevice(device_id: ID!): Device @beehiveGet(target_type_name: "Device")
    # Get a device (DEPRECATED; use getDevice instead)
    device(device_id: ID): Device @beehiveGet(target_type_name: "Device")
    # Find devices based on one or more of their properties
    findDevices(part_number: String, device_type: DeviceType, name: String, tag_id: String, serial_number: String, page: PaginationInput): DeviceList @beehiveSimpleQuery(target_type_name: "Device")
    # Find devices based on one or more of their properties (DEPRECATED; use findDevices instead)
    findDevice(name: String, part_number: String): DeviceList! @beehiveSimpleQuery(target_type_name: "Device")
    # Find devices using a complex query
    searchDevices(query: QueryExpression!, page: PaginationInput): DeviceList @beehiveQuery(target_type_name: "Device")

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
    # Create a new device
    createDevice(device: DeviceInput): Device @beehiveCreate(target_type_name: "Device")
    # Update a device
    updateDevice(device_id: ID!, device: DeviceUpdateInput): Device @beehiveUpdate(target_type_name: "Device")
    # Delete a device
    deleteDevice(device_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Device")

    # sets the device configuration
    setDeviceConfiguration(deviceConfiguration: DeviceConfigurationInput): DeviceConfiguration @beehiveCreate(target_type_name: "DeviceConfiguration")
    # adds a new sensor to the graph
    createSensor(sensor: SensorInput): Sensor @beehiveCreate(target_type_name: "Sensor")
    # Creates a sensor installation, adding to the sensors list on a Device
    addSensorToDevice(sensorInstallation: SensorInstallationInput): SensorInstallation @beehiveCreate(target_type_name: "SensorInstallation")
    # Update the config for a sensorInstallation
    updateSensorInstall(sensor_install_id: ID, sensorInstallation: SensorInstallationUpdateInput): SensorInstallation @beehiveUpdate(target_type_name: "SensorInstallation")
  }

`
