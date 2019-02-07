exports.typeDefs = `

  type Environment @beehiveTable(table_name: "environments", pk_column: "environment_id") {
    environment_id: ID!
    name: String!
    description: String
    location: String
    assignments(when: Datetime): [Assignment!] @beehiveRelation(target_type_name: "Assignment", target_field_name: "environment")
  }

  type EnvironmentList {
    data: [Environment!]!
  }

  type Person {
    person_id: ID!
    name: String!
  }

  enum AssignableTypeEnum {
    PERSON
    DEVICE
  }

  union Assignable @beehiveUnion = Device | Person

  type Assignment @beehiveAssignmentType(table_name: "assignments", assigned_field: "assigned", assignee_field: "environment", exclusive: true, pk_column: "assignment_id") {
    assignment_id: ID!
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    assigned: Assignable! @beehiveUnionResolver(target_types: ["Device", "Person"])
    assigned_type: AssignableTypeEnum!
    start: Datetime!
    end: Datetime
  }

  input EnvironmentInput {
    name: String!
    description: String
    location: String
  }

  input PersonInput {
    name: String!
  }

  input AssignmentInput {
    environment: ID!
    assigned_type: AssignableTypeEnum!
    assigned: ID!
    start: Datetime
    end: Datetime
  }

  extend type Query {
    # Gets the list of environments
    environments(page: PaginationInput): EnvironmentList @beehiveList(target_type_name: "Environment")
    # Get a sepecific environment
    getEnvironment(environment_id: ID!): Environment @beehiveGet(target_type_name: "Environment")
    # Search for environments with exact match for name and/or location
    findEnvironment(name: String, location: String): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")
  }

  extend type Mutation {
    # Create a new Environment
    createEnvironment(environment: EnvironmentInput): Environment @beehiveCreate(target_type_name: "Environment")
    # Assign an assignable to an envionemnt
    assignToEnvironment(assignment: AssignmentInput): Assignment @beehiveCreate(target_type_name: "Assignment")
  }

`
