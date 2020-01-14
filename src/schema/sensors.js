exports.typeDefs = `

  # A device is a physical device that in placed in an environment
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
    # 2D poses associated with this device
    poses2d: [Pose2D!] @beehiveRelationFilter(target_type_name: "Pose2D", target_field_name: "camera")
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
  }

`
