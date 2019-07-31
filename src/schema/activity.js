exports.typeDefs = `


# for future use
enum ObservationCodes {
    # independent choice: child chose the actiity independently
    ic
    # suggested choice: guide gives child the choice of two or three activities to choose from
    sc
    # directed choice: guide gives child a directed choice due to inability to choose for themselves
    dc
    # child influence: a child influences another childs choice on an activity
    ci
}

enum EngagementType {
    # Working
    W
    # Getting Lesson
    GL
    # Doing Group Activity
    GA
    # Horsing Around
    HA
    # Waiting
    Wait
    # Wandering
    Wd
    # Snacking
    S
    # Observing
    Obs
    # Other
    Other
}

enum SourceType {
    TRUTH
    INFERRED
}

type Material @beehiveTable(table_name: "material", pk_column: "material_id") {
    material_id: ID!
    name: String!
    description: String
}


enum Level {
    COMPLETELY
    PARTIAL
    NOT
}

enum ConcentrationLevel {
    DEEP_CONCENTRATION
    CONCENTRATION
    DISTRACTED_WORKING
    QUIESENCE
    SLIGHT_DISORDER
    DISORDER
    UNCONTROLLABLE
}


type InteractionValidation @beehiveTable(table_name: "interaciton_validation", pk_column: "interaciton_validation_id") {
    interaciton_validation_id: ID!
    interaciton: Interaction! @beehiveUnionResolver(target_types: ["MaterialInteraction", "SocialInteraction"])
    validator: Person! @beehiveRelation(target_type_name: "Person")
    validatedAt: Datetime!
    qualityOfInteraction: Int!
}

union Interaction @beehiveUnion = MaterialInteraction | SocialInteraction

type MaterialInteraction @beehiveTable(table_name: "material_interaction", pk_column: "material_interaction_id") {
    material_interaction_id: ID!
    # Is this ground truth or was it inferred using ML/CV
    source: SourceType!
    # child or teacher that is the subject of the interaciton
    subject: Person! @beehiveRelation(target_type_name: "Person")
    # what object were being used in this activity
    objects: Material
    start: Datetime!
    duration: Int
    concentration: ConcentrationInformation!
    engagementType: EngagementType
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation")
}

type ConcentrationInformation {
    concentration_id: ID!
    overall: ConcentrationLevel!
    orientedTowards: Level
    lookingAt: Level
    touching: Level
    distacted: Level
    intentionalActions: Level
    carefulActions: Level
}


type SocialInteraction @beehiveTable(table_name: "social_interaction", pk_column: "social_interaction_id") {
    social_interaction_id: ID!
    # Is this ground truth or was it inferred using ML/CV
    source: SourceType!
    # child or teacher that is the subject of the interaciton
    subjects: [Person!] @beehiveRelation(target_type_name: "Person")
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation")
}

input MaterialInput {
    name: String
    description: String
}


input MaterialInteractionInput {
    source: SourceType!
    subject: ID!
    objects: ID!
    start: Datetime!
    duration: Int
    concentration: ConcentrationInformationInput!
    engagementType: EngagementType
}

input ConcentrationInformationInput {
    overall: ConcentrationLevel!
    orientedTowards: Level
    lookingAt: Level
    touching: Level
    distacted: Level
    intentionalActions: Level
    carefulActions: Level
}


type MaterialInteractionList {
    data: [MaterialInteraction!]!
    page_info: PageInfo!
}

type MaterialList {
    data: [Material!]!
    page_info: PageInfo!
}

extend type Query {
    material(material_id: ID!): Material! @beehiveGet(target_type_name: "Material")
    materials(query: QueryExpression!, page: PaginationInput): MaterialList! @beehiveQuery(target_type_name: "Material")
    materialInteraction(material_interaction_id: ID!): MaterialInteraction! @beehiveGet(target_type_name: "MaterialInteraction")
    materialInteractions(query: QueryExpression!, page: PaginationInput): MaterialInteractionList! @beehiveQuery(target_type_name: "MaterialInteraction")
}

extend type Mutation {
    # adds a new datapoint to the graph
    createMaterial(material: MaterialInput): Material @beehiveCreate(target_type_name: "Material")
    createMaterialInteraction(material_interaction: MaterialInteractionInput): MaterialInteraction @beehiveDelete(target_type_name: "MaterialInteraction")
}

`;
