Feature: Person
  A Person represents a teacher, child, or other person within a classroom environment
  A list of persons can be requested
  Person has a person_id, first_name, surnames, nickname, short_name, person_type, and transparent_classroom_id

  Scenario: basic person operations
    Given a clean database
    Given a list of persons
      | person_id | first_name | surnames | nickname | short_name | person_type | transparent_classroom_id |
      | 001       | Paul       | DeCoursey | optimuspaul | pd     | OTHER   | 23 |
      | 002       | Dave       | DeCoursey | optimuspaul | pd     | OTHER   | 43 |
     Then there are `2` persons
     Then the `001` person has a name of `Paul DeCoursey`

  Scenario: people assigned to environments
  Given a clean database
  Given a list of persons
    | person_id | first_name | surnames | nickname | short_name | person_type | transparent_classroom_id |
    | 001       | Paul       | DeCoursey | optimuspaul | pd     | OTHER   | 23 |
    | 002       | Dave       | DeCoursey | optimuspaul | dd     | OTHER   | 43 |
  Given a list of environments
      | environment_id | name | description |
      | 100001 | wildflower | wildflower school |
      | 100002 | acorn | acorn school |
   When person `001` is assigned to `100001` at `2020-05-05T01:00:00.000+0000`
   When person `002` is assigned to `100001` at `2020-05-05T01:00:00.000+0000`
   When person `002` is assigned to `100002` at `2020-06-05T01:00:00.000+0000`
   Then the `100002` has `0` person assignments at  `2020-05-05T10:00:00.000+0000`
   Then the `100001` has `2` person assignments at  `2020-05-05T10:00:00.000+0000`
   Then the `100001` has `1` person assignments at  `2020-06-05T10:00:00.000+0000`
   Then the `100002` has `1` person assignments at  `2020-06-05T10:00:00.000+0000`
