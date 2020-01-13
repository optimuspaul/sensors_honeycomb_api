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
    # The tag_id is the information printed on an identifier label on the device itself
    tag_id: String
    # A serial number specific to the device, could be a manufacturer ID or a Wildflower assigner number that is unique to the device
    serial_number: String
    # The mac address(s) associated with the network interface(s) of the device
    mac_address: [String!]
    # A long description for the device
    description: String
    # Sensors installed on this device
    sensors: [SensorInstallation!]! @beehiveRelation(target_type_name: "SensorInstallation", target_field_name: "device")
    # Configurations associated with this device
    configurations: [DeviceConfiguration!] @beehiveAssignmentFilter(target_type_name: "DeviceConfiguration", assignee_field: "device")
    # Environment assignments associated with this device
    assignments: [Assignment!] @beehiveAssignmentFilter(target_type_name: "Assignment", assignee_field: "assigned")
    # Position assignments associated with this device
    position_assignments: [PositionAssignment!] @beehiveAssignmentFilter(target_type_name: "PositionAssignment", assignee_field: "assigned")
    # Intrinsic calibration data associated with this device
    intrinsic_calibrations: [IntrinsicCalibration!] @beehiveAssignmentFilter(target_type_name: "IntrinsicCalibration", assignee_field: "device")
    # Extrinsic calibration data associated with this device
    extrinsic_calibrations: [ExtrinsicCalibration!] @beehiveAssignmentFilter(target_type_name: "ExtrinsicCalibration", assignee_field: "device")
    # Entity assignments associated with this device
    entity_assignments: [EntityAssignment!] @beehiveAssignmentFilter(target_type_name: "EntityAssignment", assignee_field: "device")
    # Radio pings associated with this device acting as an anchor
    radio_pings_as_anchor: [RadioPing!] @beehiveRelationFilter(target_type_name: "RadioPing", target_field_name: "anchor_device")
    # Radio pings associated with this device acting as a tag
    radio_pings_as_tag: [RadioPing!] @beehiveRelationFilter(target_type_name: "RadioPing", target_field_name: "tag_device")
  }

  type DeviceList {
    data: [Device!]
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

  enum DeviceType {
    PI3
    PI3WITHCAMERA
    PIZERO
    PIZEROWITHCAMERA
    UWBANCHOR
    UWBTAG
    BLEANCHOR
    BLETAG
    WEMO
    CONTROL
    GATEWAY
    DECAWAVE
    TEST
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

  type Sensor @beehiveTable(table_name: "sensors", pk_column: "sensor_id", resolve_type_field: "sensor_type") {
    sensor_id: ID!
    part_number: String
    name: String
    description: String
    sensor_type: SensorType
    version: Int
    default_config: [Property!]
  }

  type SensorList {
    data: [Sensor!]!
    page_info: PageInfo!
  }

  input SensorInput {
    part_number: String
    name: String
    description: String
    sensor_type: SensorType
    version: Int
    default_config: [PropertyInput!]
  }

  input SensorUpdateInput {
    part_number: String
    name: String
    description: String
    sensor_type: SensorType
    version: Int
    default_config: [PropertyInput!]
  }

  enum SensorType {
    CAMERA
    RADIO
    ACCELEROMETER
    GYROSCOPE
    MAGNETOMETER
    INERTIAL
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

  type SensorInstallationList {
    data: [SensorInstallation!]!
    page_info: PageInfo!
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
    device: ID
    sensor: ID
    description: String
    start: Datetime
    end: Datetime
    tag_id: String
    config: [PropertyInput!]
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


    # Get the list of sensors
    sensors(page: PaginationInput): SensorList @beehiveList(target_type_name: "Sensor")
    # Get a sensor
    getSensor(sensor_id: ID!): Sensor @beehiveGet(target_type_name: "Sensor")
    # Get a sensor (DEPRECATED; use getSensor instead)
    sensor(sensor_id: ID): Sensor @beehiveGet(target_type_name: "Sensor")
    # Find sensors based on one or more of their properties
    findSensors(part_number: String, name: String, sensor_type: SensorType, version: Int, page: PaginationInput): SensorList @beehiveSimpleQuery(target_type_name: "Sensor")
    # Find a sensor based on one or more of it's properties (DEPRECATED; use findSensors instead)
    findSensor(name: String, version: Int): SensorList! @beehiveSimpleQuery(target_type_name: "Sensor")
    # Find sensors using a complex query
    searchSensors(query: QueryExpression!, page: PaginationInput): SensorList @beehiveQuery(target_type_name: "Sensor")

    # Get the list of sensor installations
    sensorInstallations(page: PaginationInput): SensorInstallationList @beehiveList(target_type_name: "SensorInstallation")
    # Get a sensor installation
    getSensorInstallation(sensor_install_id: ID!): SensorInstallation @beehiveGet(target_type_name: "SensorInstallation")
    # Find sensor installations based on one or more of their properties
    findSensorInstallations(device: ID, sensor: ID, description: String, tag_id: String, page: PaginationInput): SensorInstallationList @beehiveSimpleQuery(target_type_name: "SensorInstallation")
    # Find sensor installations using a complex query
    searchSensorInstallations(query: QueryExpression!, page: PaginationInput): SensorInstallationList @beehiveQuery(target_type_name: "SensorInstallation")

  }

  extend type Mutation {
    # Create a new device
    createDevice(device: DeviceInput): Device @beehiveCreate(target_type_name: "Device")
    # Update a device
    updateDevice(device_id: ID!, device: DeviceUpdateInput): Device @beehiveUpdate(target_type_name: "Device")
    # Delete a device
    deleteDevice(device_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Device")

    # Create a new sensor
    createSensor(sensor: SensorInput): Sensor @beehiveCreate(target_type_name: "Sensor")
    # Update a sensor
    updateSensor(sensor_id: ID!, sensor: SensorUpdateInput): Sensor @beehiveUpdate(target_type_name: "Sensor")
    # Delete a sensor
    deleteSensor(sensor_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Sensor")

    # Create a sensor installation, adding to the sensors list on a Device
    addSensorToDevice(sensorInstallation: SensorInstallationInput): SensorInstallation @beehiveCreate(target_type_name: "SensorInstallation")
    # Update a sensor installation
    updateSensorInstallation(sensor_install_id: ID!, sensorInstallation: SensorInstallationUpdateInput): SensorInstallation @beehiveUpdate(target_type_name: "SensorInstallation")
    # Update the config for a sensorInstallation (DEPRECATED; use updateSensorInstallation instead)
    updateSensorInstall(sensor_install_id: ID, sensorInstallation: SensorInstallationUpdateInput): SensorInstallation @beehiveUpdate(target_type_name: "SensorInstallation")
    # Delete a sensor installation
    deleteSensorInstallation(sensor_install_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "SensorInstallation")

    # sets the device configuration
    setDeviceConfiguration(deviceConfiguration: DeviceConfigurationInput): DeviceConfiguration @beehiveCreate(target_type_name: "DeviceConfiguration")
  }

`
