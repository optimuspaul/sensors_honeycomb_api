Feature: Devices
  A Device represents a data collection device in a classroom.
  A list of devices can be requested
  Device has a name, description, system id called device_id
  A Device has a device_type represented by the enum DeviceType
  A Device can optionally have a part_number, serial_number, mac_address, tag_id
  Some devices like Camera will have intrinsic and extrinsic calibrations linked to them


  Scenario: basic device operations
    Given a clean database
    Given a list of devices
        | id:device_id | s:name | s:description | s:device_type | s:tag_id | s:serial_number | sl:mac_address | s:part_number |
        | 300120001 | cam1 | a camera    | PI3WITHCAMERA | CAM01 | 12300001 | 12220987654 | 10000001 |
        | 300120002 | cam2 | a camera    | PI3WITHCAMERA | CAM02 | 12300002 | 12220987651 | 10000001 |
     Then there are `2` devices

  Scenario: device assignments
    Given a clean database
    Given a list of devices
        | id:device_id | s:name | s:description | s:device_type | s:tag_id | s:serial_number | sl:mac_address | s:part_number |
        | 300120001 | cam1 | a camera    | PI3WITHCAMERA | CAM01 | 12300001 | 12220987654 | 10000001 |
        | 300120002 | cam2 | a camera    | PI3WITHCAMERA | CAM02 | 12300002 | 12220987651 | 10000001 |
    Given a list of environments
      | environment_id | name | description |
      | 100001 | wildflower | wildflower school |
      | 100002 | acorn | acorn school |
      | 100003 | stink blossom | stink blossom school |
     When device `300120001` is assigned to `100001` on `2020-01-01T00:00:00Z`
     then environment `100001` has `1` assignments
     then environment `100001` has `1` assignments on `2020-01-01T00:00:00Z`
     then environment `100001` has `1` assignments on `2020-01-02T00:00:00Z`
     then environment `100001` has `0` assignments on `2019-01-02T00:00:00Z`
     When device `300120002` is assigned to `100001` on `2020-01-02T00:00:00Z`
     then environment `100001` has `2` assignments
     then environment `100001` has `1` assignments on `2020-01-01T00:00:00Z`
     then environment `100001` has `2` assignments on `2020-01-02T00:00:00Z`
     then environment `100001` has `0` assignments on `2019-01-02T00:00:00Z`
     When device `300120002` is assigned to `100002` on `2020-01-03T00:00:00Z`
     then environment `100001` has `2` assignments
     then environment `100001` has `1` assignments on `2020-01-01T00:00:00Z`
     then environment `100001` has `2` assignments on `2020-01-02T00:00:00Z`
     then environment `100001` has `1` assignments on `2020-01-03T00:00:00Z`
     When device `300120002` is assigned to `100001` on `2020-01-05T00:00:00Z`
     then environment `100001` has `3` assignments
     then environment `100001` has `2` assignments on `2020-01-06T00:00:00Z`
     then environment `100002` has `1` assignments
     When device `300120001` is assigned to `100003` on `2020-01-05T00:00:00Z`
     then environment `100001` has `1` assignments on `2020-01-06T00:00:00Z`
     then environment `100002` has `0` assignments on `2020-01-06T00:00:00Z`
     then environment `100003` has `1` assignments on `2020-01-06T00:00:00Z`
