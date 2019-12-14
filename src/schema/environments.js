exports.typeDefs = `

  type Environment @beehiveTable(table_name: "environments", pk_column: "environment_id") {
    environment_id: ID!
    name: String!
    description: String
    location: String
    assignments: [Assignment!] @beehiveAssignmentFilter(target_type_name: "Assignment", assignee_field: "environment")
    layouts: [Layout!] @beehiveAssignmentFilter(target_type_name: "Layout", assignee_field: "environment")
  }


  type EnvironmentList {
    data: [Environment!]!
    page_info: PageInfo!
}

  type Person @beehiveTable(table_name: "persons", pk_column: "person_id") {
    person_id: ID!
    name: String!
  }

  type PersonList {
    data: [Person!]!
    page_info: PageInfo!
  }

  enum AssignableTypeEnum {
    PERSON
    DEVICE
  }

  type Layout @beehiveAssignmentType(table_name: "layouts", assigned_field: "environment", exclusive: true, pk_column: "layout_id") {
      layout_id: ID!
      environment: Environment! @beehiveRelation(target_type_name: "Environment")
      spaces: [Rect!]
      objects: [Rect!]
      start: Datetime
      end: Datetime
  }

  type Rect {
      name: String
      x: Int!
      y: Int!
      width: Int!
      height: Int!
  }

  input RectInput {
      name: String
      x: Int!
      y: Int!
      width: Int!
      height: Int!
  }

  input LayoutInput {
      environment: ID!
      spaces: [RectInput!]
      objects: [RectInput!]
      start: Datetime
      end: Datetime
  }

  union Assignable @beehiveUnion = Device | Person

  type Assignment @beehiveAssignmentType(table_name: "assignments", assigned_field: "assigned", assignee_field: "environment", exclusive: true, pk_column: "assignment_id") {
    assignment_id: ID!
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    assigned: Assignable! @beehiveUnionResolver(target_types: ["Device", "Person"])
    assigned_type: AssignableTypeEnum!
    start: Datetime!
    end: Datetime
    data: [Datapoint!] @beehiveRelationFilter(target_type_name: "Datapoint", target_field_name: "observer")
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

  input AssignmentUpdateInput {
    end: Datetime
  }

  extend type Query {
    # Gets the list of environments
    environments(page: PaginationInput): EnvironmentList @beehiveList(target_type_name: "Environment")
    # Get a sepecific environment
    getEnvironment(environment_id: ID!): Environment @beehiveGet(target_type_name: "Environment")
    # Search for environments with exact match for name and/or location
    findEnvironment(name: String, location: String): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")

    # Get the list of people
    persons(page: PaginationInput): PersonList @beehiveList(target_type_name: "Person")
    # Get a person
    getPerson(person_id: ID!): Person @beehiveGet(target_type_name: "Person")
    # Find a person based on one or more of their properties
    findPersons(name: String): PersonList @beehiveSimpleQuery(target_type_name: "Person")
    # Find people using a complex query
    searchPersons(query: QueryExpression!, page: PaginationInput): PersonList @beehiveQuery(target_type_name: "Person")
  }

  extend type Mutation {
    # Create a new Environment
    createEnvironment(environment: EnvironmentInput): Environment @beehiveCreate(target_type_name: "Environment")
    # update an Environment
    updateEnvironment(environment_id: ID!, environment: EnvironmentInput): Environment @beehiveUpdate(target_type_name: "Environment")
    # Assign an assignable to an envionemnt
    assignToEnvironment(assignment: AssignmentInput): Assignment @beehiveCreate(target_type_name: "Assignment")
    # Update an assignment to set the end date/time of the assignment
    updateAssignment(assignment_id: ID!, assignment: AssignmentUpdateInput): Assignment @beehiveUpdate(target_type_name: "Assignment")
    # creates a new Layout, which represents the basic shape of an enviroment.
    createLayout(layout: LayoutInput): Layout @beehiveCreate(target_type_name: "Layout")
    # set the end date for a Layout
    updateLayout(layout_id: ID!, layout: AssignmentUpdateInput): Layout @beehiveUpdate(target_type_name: "Layout")

    # Create a new person
    createPerson(person: PersonInput): Person @beehiveCreate(target_type_name: "Person")
    # Update a person
    updatePerson(person_id: ID!, person: PersonInput): Environment @beehiveUpdate(target_type_name: "Person")
    # Delete a person
    deletePerson(person_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Person")
  }

`
