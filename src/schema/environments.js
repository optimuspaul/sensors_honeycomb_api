exports.typeDefs = `

  type Environment {
    name: String!
    description: String
    location: String
    created: Datetime!
    assignments(when: Datetime): [Assignment!]
  }

  type Person {
    person_id: ID!
    name: String!
  }

  enum AssignableTypeEnum {
    PERSON
    DEVICE
  }
  
  union Assignable = Device | Person

  type Assignment {
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
    assigned_id: ID!
    start: Datetime
  }

`;
