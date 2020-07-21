exports.typeDefs = `

# A device is a physical device that in placed in an environment
type Device {
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
    # Environment assignments associated with this device
    assignments: [DeviceAssignment!]
    # Position assignments associated with this device
    positions: [DevicePosition!]
    # Intrinsic calibration data associated with this device
    intrinsic_calibrations: [InCalibrated!]
    # Extrinsic calibration data associated with this device
    extrinsic_calibrations: [ExCalibrated!]
    # Entity assignments associated with this device
    entity_assignments: [EntityAssignment!]
    # Radio pings associated with this device acting as an anchor
    radio_pings_as_anchor: [RadioPing!]
    # Radio pings associated with this device acting as a tag
    radio_pings_as_tag: [RadioPing!]
    # 2D poses associated with this device
    poses2d: [Pose2D!]
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

`
