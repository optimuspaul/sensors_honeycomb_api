exports.typeDefs = `
  
enum PropertyType {
    BOOL
    STR
    INT
    FLOAT
    NULL
}

type Property {
    name: String!
    value: String
    type: PropertyType!
}


input PropertyInput {
    name: String!
    value: String
    type: PropertyType!
}


`;
