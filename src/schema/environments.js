exports.typeDefs = `

  type Environment @beehiveTable(table_name: "environments", pk_column: "environment_id") {
    environment_id: ID!
    name: String!,
    transparent_classroom_id: Int
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
    name: String
    first_name: String
    last_name: String
    short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
  }

  type PersonList {
    data: [Person!]!
    page_info: PageInfo!
  }

  enum PersonType {
    STUDENT
    TEACHER
    ASSISTANT
    PARENT
    OTHER
  }

  enum AssignableTypeEnum {
    PERSON
    DEVICE
    MATERIAL
    TRAY
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

  union Assignable @beehiveUnion = Device | Person | Material | Tray

  type Assignment @beehiveAssignmentType(table_name: "assignments", assigned_field: "assigned", assignee_field: "environment", exclusive: true, pk_column: "assignment_id") {
    assignment_id: ID!
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    assigned: Assignable! @beehiveUnionResolver(target_types: ["Device", "Person", "Material", "Tray"])
    assigned_type: AssignableTypeEnum!
    start: Datetime!
    end: Datetime
    data: [Datapoint!] @beehiveRelationFilter(target_type_name: "Datapoint", target_field_name: "observer")
  }

  input EnvironmentInput {
    name: String!
    transparent_classroom_id: Int
    description: String
    location: String
  }

  input EnvironmentUpdateInput {
    name: String
    transparent_classroom_id: Int
    description: String
    location: String
  }

  input PersonInput {
    name: String
    first_name: String
    last_name: String
    short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
  }

  input PersonUpdateInput {
    name: String
    first_name: String
    last_name: String
    short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
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

  type EntityAssignment @beehiveAssignmentType(table_name: "entityassignments", assigned_field: "device", assignee_field: "entity", exclusive: true, pk_column: "entity_assignment_id") {
    entity_assignment_id: ID!
    entity_type: EntityType!
    entity: Entity! @beehiveUnionResolver(target_types: ["Person", "Material"])
    device: Device! @beehiveRelation(target_type_name: "Device")
    start: Datetime!
    end: Datetime
  }

  type EntityAssignmentList {
    data: [EntityAssignment!]!
    page_info: PageInfo!
  }

  input EntityAssignmentInput {
    entity_type: EntityType!
    entity: ID!
    device: ID!
    start: Datetime!
    end: Datetime
  }

  input EntityAssignmentUpdateInput {
    entity_type: EntityType
    entity: ID
    device: ID
    start: Datetime
    end: Datetime
  }

  union Entity @beehiveUnion = Person | Material

  enum EntityType {
    PERSON
    MATERIAL
  }

  extend type Query {
    # Get the list of environments
    environments(page: PaginationInput): EnvironmentList @beehiveList(target_type_name: "Environment")
    # Get an environment
    getEnvironment(environment_id: ID!): Environment @beehiveGet(target_type_name: "Environment")
    # Find environments based on one or more of their properties
    findEnvironments(name: String, transparent_classroom_id: Int, location: String, page: PaginationInput): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")
    # Find environments based on one or more of their properties (DEPRECATED, use findEnvironments instead)
    findEnvironment(name: String, location: String): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")
    # Find environments using a complex query
    searchEnvironments(query: QueryExpression!, page: PaginationInput): EnvironmentList @beehiveQuery(target_type_name: "Environment")

    # Get the list of people
    persons(page: PaginationInput): PersonList @beehiveList(target_type_name: "Person")
    # Get a person
    getPerson(person_id: ID!): Person @beehiveGet(target_type_name: "Person")
    # Find people based on one or more of their properties
    findPersons(name: String, first_name: String, last_name: String, short_name: String, person_type: PersonType, transparent_classroom_id: Int, page: PaginationInput): PersonList @beehiveSimpleQuery(target_type_name: "Person")
    # Find people using a complex query
    searchPersons(query: QueryExpression!, page: PaginationInput): PersonList @beehiveQuery(target_type_name: "Person")

    # Get the list of entity assignments
    entityAssignments(page: PaginationInput): EntityAssignmentList @beehiveList(target_type_name: "EntityAssignment")
    # Get an entity assignment
    getEntityAssignment(entity_assignment_id: ID!): EntityAssignment @beehiveGet(target_type_name: "EntityAssignment")
    # Find entity assignments based on one or more of their properties
    findEntityAssignments(entity_type: EntityType, entity: ID, device: ID, page: PaginationInput): EntityAssignmentList @beehiveSimpleQuery(target_type_name: "EntityAssignment")
    # Find entity assignments using a complex query
    searchEntityAssignments(query: QueryExpression!, page: PaginationInput): EntityAssignmentList @beehiveQuery(target_type_name: "EntityAssignment")

  }

  extend type Mutation {
    # Create a new environment
    createEnvironment(environment: EnvironmentInput): Environment @beehiveCreate(target_type_name: "Environment")
    # Update a person
    updateEnvironment(environment_id: ID!, environment: EnvironmentUpdateInput): Environment @beehiveUpdate(target_type_name: "Environment")
    # Delete an environment
    deleteEnvironment(environment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Environment")

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
    updatePerson(person_id: ID!, person: PersonUpdateInput): Person @beehiveUpdate(target_type_name: "Person")
    # Delete a person
    deletePerson(person_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Person")

    # Assign device to entity
    assignToEntity(entityAssignment: EntityAssignmentInput): EntityAssignment @beehiveCreate(target_type_name: "EntityAssignment")
    # Update an entity assignment
    updateEntityAssignment(entity_assignment_id: ID!, entityAssignment: EntityAssignmentUpdateInput): EntityAssignment @beehiveUpdate(target_type_name: "EntityAssignment")
    # Delete an entity assignment
    deleteEntityAssignment(entity_assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "EntityAssignment")

  }

`
