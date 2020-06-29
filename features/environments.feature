Feature: Environments
  Environments can be created and retrieved
  A list of environments can be requested
  Environment has a name, description, transparent_classroom_id, system id called environment_id, and location

  Scenario: basic environment operations
    Given a clean database
    Given a list of environments
      | environment_id | name | description |
      | 100001 | wildflower | wildflower school |
      | 100002 | acorn | acorn school |
     Then there are `2` environments
     Then the `wildflower` environment can be verified
