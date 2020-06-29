Feature: ExtrinsicCalibration
  CoordinateSpace is a anchor that maps the idea of a geometric space to a real world space it is defined as
  a named entity with an id
  a list of axes with names and descriptions
  a description of the origin in the real world
  a link to an Environment
  a start and end date
  ExtrinsicCalibration represents the calibration of a camera with regard to it's environment, it is expressed as
  an entity with an id
  a start and end date
  a link to a device
  a link to a CoordinateSpace
  a translation_vector for floats
  a rotation_vector for floats

  Scenario: CoordinateSpace operations
    Given a clean database
    Given a list of CoordinateSpaces
        | space_id | name | axis_names | origin_description | axis_descriptions | start |
        | 20000010 | casual cartesian | x,y,z | to the right of the coffee machine, next to the donuts | runs west to front door,runs south,positive is up | 2020-12-01T00:00:00.000+0000 |
        | 20000011 | formal cartesian | x,y,z | to the left of the coffee machine, next to the sugarbowl | runs west to front door,runs south,positive is up | 2020-12-07T00:00:00.000+0000 |
     Then there are `2` CoordinateSpaces

  Scenario: ExtrinsicCalibration operations
    Given a clean database
    Given a list of ExtrinsicCalibrations
        | extrinsic_calibration_id | translation_vector | rotation_vector | start |
        | 1110001 | 0,0,0 | 0,1,0 | 2020-01-01T00:00:00Z |
        | 1110002 | 0,2.1,0 | 0,-0.28,0 | 2020-01-01T00:00:00Z |
        | 1110003 | 1.02,0,0 | 0,1.04,0 | 2020-01-01T00:00:00Z |
    Given a list of CoordinateSpaces
        | space_id | name | axis_names | origin_description | axis_descriptions | start |
        | 20000011 | formal cartesian | x,y,z | to the left of the coffee machine, next to the sugarbowl | runs west to front door,runs south,positive is up | 2020-12-07T00:00:00.000+0000 |
     When ExtrinsicCalibration `1110001` is linked to `20000011` space
     When ExtrinsicCalibration `1110002` is linked to `20000011` space
     When ExtrinsicCalibration `1110003` is linked to `20000011` space
     Then there are `3` ExtrinsicCalibrations
     Then ExtrinsicCalibration `1110002` has a rotation_vector of `0,-0.28,0` and is linked to `20000011` space
