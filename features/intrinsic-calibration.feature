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
        | id:intrinsic_calibration_id | s:device | fl:distortion_coefficients | i:image_width | i:image_height |
        | 40011 | 100808 | 0.01,0.22,-0.00032,0.009 | 600 | 400 |
     Then intrinsic_calibration `40011` has a width of `600`

  Scenario: Matrix operations
    Given a clean database
    Given a list of Matrix
        | id:matrix_id | i:height | i:width | fl:components |
        | 40011 | 3 | 3 | 1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.5,1.0 |
     Then matrix `40011` has a width of `3` a height of `3` and `9` components: `1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.5,1.0`



  Scenario: IntrinsicCalibration Matrix assignment
    Given a clean database
    Given a list of Matrix
       | id:matrix_id | i:height | i:width | fl:components |
       | 40011 | 3 | 3 | 1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.5,1.0 |
    Given a list of IntrinsicCalibrations
        | id:intrinsic_calibration_id | s:device | fl:distortion_coefficients | i:image_width | i:image_height |
        | 40011 | 100808 | 0.01,0.22,-0.00032,0.009 | 600 | 400 |
     When assigning Matrix `40011` to IntrinsicCalibration `40011`
     Then IntrinsicCalibration `40011` has a camera_matrix `40011` with components: `1.0,0.0,0.0,0.0,1.0,0.0,12.0,23.5,1.0`
