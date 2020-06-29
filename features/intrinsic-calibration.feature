Feature: IntrinsicCalibration
  IntrinsicCalibration represents the calibration of a camera, it is expressed as
  An IntrinsicCalibration has a camera_matrix that is  a Matrix type
  An IntrinsicCalibration has distortion_coefficients represented as a list of floats
  An IntrinsicCalibration has image_width represented as an integer
  An IntrinsicCalibration has image_height represented as an integer
  An IntrinsicCalibration has a start and an end date to handle changes in a calibration
  A Matrix type represents a matrix as an array with a height and width

  Scenario: IntrinsicCalibration operations
    Given a clean database
    Given a list of IntrinsicCalibrations
        | intrinsic_calibration_id | start | end | device | distortion_coefficients | image_width | image_height |
        | 40011 | 2020-01-01T00:00:00.000000+0000 | 2020-12-01T00:00:00.000+0000 | 100808 | 0.01,0.22,-0.00032,0.009 | 600 | 400 |
     Then intrinsic_calibration `40011` has a start of `2020-01-01T00:00:00Z`

  Scenario: Matrix operations
    Given a clean database
    Given a list of Matrix
        | matrix_id | height | width | components |
        | 40011 | 3 | 3 | 1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.0,1.0 |
     Then matrix `40011` has a width of `3` a height of `3` and `9` components: `1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.0,1.0`



  Scenario: IntrinsicCalibration Matrix assignment
    Given a clean database
    Given a list of Matrix
       | matrix_id | height | width | components |
       | 40011 | 3 | 3 | 1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.0,1.0 |
    Given a list of IntrinsicCalibrations
        | intrinsic_calibration_id | start | end | device | distortion_coefficients | image_width | image_height |
        | 40011 | 2020-01-01T00:00:00.000000+0000 | 2020-12-01T00:00:00.000+0000 | 100808 | 0.01,0.22,-0.00032,0.009 | 600 | 400 |
     When assigning Matrix `40011` to IntrinsicCalibration `40011`
     Then IntrinsicCalibration `40011` has a camera_matrix `40011` with components: `1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.0,1.0`
