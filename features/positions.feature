Feature: Position

  Scenario: People positioned in places
    Given a clean database
    Given a list of persons
      | person_id | first_name | surnames | nickname | short_name | person_type | transparent_classroom_id |
      | 001       | Paul       | DeCoursey | optimuspaul | pd     | OTHER   | 23 |
    Given a list of CoordinateSpaces
      | id:space_id | s:name | sl:axis_names | s:origin_description | sl:axis_descriptions | s:start |
      | 20000010 | casual cartesian | x,y,z | to the right of the coffee machine, next to the donuts | runs west to front door,runs south,positive is up | 2020-01-01T00:00:00.000+0000 |
#    Given a list of Positions
#      | id:position_id | fl:coordinates | a:category | sl:tags | s:start |
#      | 20000010 | 1.0,1.0,1.0 | GENERATED_TEST | ok,cool | 2020-01-02T00:00:00.000+0000 |
