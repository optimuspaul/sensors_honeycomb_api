Feature: Poses
  PoseModel

  Scenario: PoseModel operations
    Given a clean database
    Given a list of PoseModels
      | id:pose_model_id | s:model_name | s:model_variant_name | sl:keypoint_names | sl:keypoint_descriptions | sl:keypoint_connectors |
      | 10000001         | COCO         | coco-18              | foot,head,face    | foot,head,face           | 1:2,2:3,1:3            |
     Then there are `1` PoseModels
