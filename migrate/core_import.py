from helpers import *


process_nodes("environments", "MergeEnvironment", [
    ("environment_id", "ID!"),
    ("name", "String"),
    ("transparent_classroom_id", "Int"),
    ("description", "String"),
    ("location", "String"),
])


process_nodes("devices", "MergeDevice", [
    ("device_id", "ID!"),
    ("name", "String"),
    ("part_number", "String"),
    ("device_type", "DeviceType"),
    ("tag_id", "String"),
    ("serial_number", "String"),
    ("description", "String"),
])


process_nodes("persons", "MergePerson", [
    ("person_id", "ID!"),
    ("first_name", "String"),
    ("surnames", "[String]"),
    ("nickname", "String"),
    ("short_name", "String"),
    ("person_type", "PersonType"),
    ("transparent_classroom_id", "Int"),
])


process_nodes("material", "MergeMaterial", [
    ("material_id", "ID!"),
    ("name", "String"),
    ("transparent_classroom_id", "Int"),
    ("transparent_classroom_type", "TransparentClassroomLessonType"),
    ("description", "String"),
])


process_nodes("posemodels", "MergePoseModel", [
    ("pose_model_id", "ID!"),
    ("model_name", "String"),
    ("model_variant_name", "String"),
    ("keypoint_names", "[String]"),
    ("keypoint_descriptions", "[String]"),
    ("keypoint_connectors", "[String]", lambda pairs: list(map(lambda pair: f"{str(pair[0])}:{str(pair[1])}", pairs)))
])

process_nodes("trays", "MergeTray", [
    ("tray_id", "ID!"),
    ("name", "String"),
    ("part_number", "String"),
    ("serial_number", "String"),
    ("description", "String"),
])


import_matricies()

process_nodes("intrinsiccalibrations", "MergeIntrinsicCalibration", [
    ("intrinsic_calibration_id", "ID!"),
    ("distortion_coefficients", "[Float]"),
    ("image_width", "Int"),
    ("image_height", "Int"),
])

link_matrix_to_intrinsic()

link_device_assignments()

link_person_assignments()

link_tray_assignments()

link_material_tray_assignments()


# extrinsiccalibrations
# position_assignments
# posetracks3d
# inferences
# datapoints
# poses3d
# entityassignments
# poses2d
# radiopings


# social_interaction - empty
# material_interaction - empty
# interaciton_validation - empty
# posetracks2d - empty
# positions - empty
# poses - empty
# material_interactions - empty
# interaction_validations - empty
# social_interactions - empty
# tray_interactions - empty
