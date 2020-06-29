Feature: Assignments
  A person can be assigned to any location
  They must only be assigned to one place at a time, no overlaps
  We can list of assignments for a location based on any time in the past
  We can find an assignment got a person at any time in the past
  Assigning to a new location ends any open assignments in the past
  A person can be unassigned
  An assignment end time must be greater than it's start time

  Scenario: Asign to a location
    Given a clean database
    Given a location called `The Cellar`
    Given a person named `Latrellis`
     When `Latrellis` is assigned to `The Cellar`
     Then `Latrellis` has an edge to `The Cellar`

  Scenario: Reassign to a location
    Given a clean database
    Given a location called `The Cellar`
    Given a location called `Rooftop`
    Given a person named `Slipping Jimmy`
     When `Slipping Jimmy` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Slipping Jimmy` is assigned to `The Cellar` at `2020-03-11T10:10:00.000+0000`
     Then `Slipping Jimmy` has an edge to `The Cellar`
     Then `Slipping Jimmy` has an edge to `Rooftop` with end

  Scenario: Assignments are idempotent
    Given a clean database
    Given a location called `Rooftop`
     then there is a location named `Rooftop`
    Given a person named `Paul`
     then there is a person named `Paul`
     When `Paul` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     Then `Paul` has an edge to `Rooftop`
     When `Paul` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     Then `Paul` has an edge to `Rooftop`

  Scenario: List assignments for location at a specific time
    Given a clean database
    Given a location called `Rooftop`
    Given a location called `Another Place`
    Given a person named `Paul`
    Given a person named `Lashandra`
    Given a person named `Deiter`
    Given a person named `Ed`
    Given a person named `Abhi`
    Given a person named `Sihong`
    Given a person named `Josie`
     When `Paul` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Lashandra` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Deiter` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Ed` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Abhi` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Sihong` is assigned to `Rooftop` at `2020-03-09T10:10:00.000+0000`
     When `Josie` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
     When `Abhi` is assigned to `Another Place` at `2020-03-12T10:10:00.000+0000`
     Then at `2020-03-09T10:10:00.000+0000` there are `1` persons assigned to `Rooftop`
     Then at `2020-03-11T10:10:00.000+0000` there are `0` persons assigned to `Another Place`
     Then at `2020-03-14T10:10:00.000+0000` there are `1` persons assigned to `Another Place`
     Then at `2020-03-14T10:10:00.000+0000` there are `6` persons assigned to `Rooftop`
     Then at `2020-03-11T10:10:00.000+0000` there are `7` persons assigned to `Rooftop`



  Scenario: Which location at a specific time
      Given a clean database
      Given a location called `Rooftop`
      Given a location called `Another Place`
      Given a location called `Nirvana`
      Given a person named `Deiter`
       When `Deiter` is assigned to `Rooftop` at `2020-03-10T10:10:00.000+0000`
       When `Deiter` is assigned to `Another Place` at `2020-03-12T10:10:00.000+0000`
       When `Deiter` is assigned to `Nirvana` at `2020-03-14T10:10:00.000+0000`
       When `Deiter` is assigned to `Rooftop` at `2020-03-16T10:10:00.000+0000`
       When `Deiter` is assigned to `Nirvana` at `2020-03-18T10:10:00.000+0000`
       When `Deiter` is assigned to `Another Place` at `2020-03-22T10:10:00.000+0000`
       Then `Deiter` is assigned to `Rooftop` at `2020-03-11T10:10:00.000+0000`
