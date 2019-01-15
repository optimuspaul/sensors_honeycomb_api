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

  type Assignment @beehiveTable(table_name: "assignments", pk_column: "assignment_id") {
    assignment_id: ID!
    environment: Environment!
    assigned: Assignable!
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
  }

  extend type Mutation {
    # Create a new Environment
    createEnvironment(environment: EnvironmentInput): Environment @beehiveCreate(target_type_name: "Environment")
    assignToEnvironment(assignment: AssignmentInput): Assignment @beehiveCreate(target_type_name: "Assignment")
  }

`
