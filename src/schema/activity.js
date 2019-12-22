exports.typeDefs = `

type Material @beehiveTable(table_name: "material", pk_column: "material_id") {
    material_id: ID!
    name: String
    transparent_classroom_id: Int
    description: String
}

type MaterialList {
    data: [Material!]!
    page_info: PageInfo!
}

input MaterialInput {
    name: String
    transparent_classroom_id: Int
    description: String
}

input MaterialUpdateInput {
    name: String
    transparent_classroom_id: Int
    description: String
}

union Interaction @beehiveUnion = MaterialInteraction | SocialInteraction

type MaterialInteraction @beehiveTable(table_name: "material_interactions", pk_column: "material_interaction_id") {
    material_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # Person that is the subject of the interaction
    subject: Person! @beehiveRelation(target_type_name: "Person")
    # Material the person is interacting with
    object: Material! @beehiveRelation(target_type_name: "Material")
    # Start time of the interaction
    start: Datetime!
    # End time of the interaction
    end: Datetime
    # Duration of the interaction (DEPRECATED; use end instead)
    duration: Int
    # Observation codes associated with the interaction
    codes: [ObservationCode!]
    # Concentration information about the interaction
    concentration: ConcentrationInformation!
    # Type of engagement
    engagement_type: EngagementType
    # Validations
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation")
}

type MaterialInteractionList {
    data: [MaterialInteraction!]!
    page_info: PageInfo!
}

input MaterialInteractionInput {
    source_type: SourceType!
    subject: ID!
    object: ID!
    codes: [ObservationCode!]
    start: Datetime!
    end: Datetime
    duration: Int
    concentration: ConcentrationInformationInput
    engagement_type: EngagementType
    validations: [ID!]
}

input MaterialInteractionUpdateInput {
    source_type: SourceType
    subject: ID
    object: ID
    codes: [ObservationCode!]
    start: Datetime
    end: Datetime
    duration: Int
    concentration: ConcentrationInformationInput
    engagementType: EngagementType
    validations: [ID!]
}

enum SourceType {
    TRUTH
    INFERRED
}

enum ObservationCode {
    # Independent choice: child chose the activity independently
    ic
    # Suggested choice: guide gives child the choice of two or three activities to choose from
    sc
    # Directed choice: guide gives child a directed choice due to inability to choose for themselves
    dc
    # Child influence: a child influences another child's choice of activity
    ci
}

type ConcentrationInformation {
    overall: ConcentrationLevel!
    oriented_towards: Level
    looking_at: Level
    touching: Level
    distracted: Level
    intentional_actions: Level
    careful_actions: Level
}

input ConcentrationInformationInput {
    overall: ConcentrationLevel!
    oriented_towards: Level
    looking_at: Level
    touching: Level
    distracted: Level
    intentional_actions: Level
    careful_actions: Level
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

enum Level {
    COMPLETELY
    PARTIAL
    NOT
}

enum EngagementType {
    # Working
    W
    # Getting lesson
    GL
    # Doing group activity
    GA
    # Horsing around
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

type SocialInteraction @beehiveTable(table_name: "social_interactions", pk_column: "social_interaction_id") {
    social_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # People engaged in the interaction
    subjects: [Person!]! @beehiveRelation(target_type_name: "Person")
    # Start time of the interaction
    start: Datetime!
    # End time of the interaction
    end: Datetime
    # Validations
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation")
}

type SocialInteractionList {
    data: [SocialInteraction!]!
    page_info: PageInfo!
}

input SocialInteractionInput {
    source_type: SourceType!
    subjects: [ID!]!
    start: Datetime!
    end: Datetime
    validations: [ID!]
}

input SocialInteractionUpdateInput {
    source_type: SourceType
    subjects: [ID!]
    start: Datetime
    end: Datetime
    validations: [ID!]
}

type InteractionValidation @beehiveTable(table_name: "interaction_validations", pk_column: "interaction_validation_id") {
    interaction_validation_id: ID!
    interaction: Interaction! @beehiveUnionResolver(target_types: ["MaterialInteraction", "SocialInteraction"])
    validator: Person! @beehiveRelation(target_type_name: "Person")
    validated_at: Datetime
    quality_of_interaction: Int
}

type InteractionValidationList {
    data: [InteractionValidation!]!
    page_info: PageInfo!
}

input InteractionValidationInput {
    interaction: ID!
    validator: ID!
    validated_at: Datetime
    quality_of_interaction: Int
}

input InteractionValidationUpdateInput {
    interaction: ID
    validator: ID
    validated_at: Datetime
    quality_of_interaction: Int
}

extend type Query {
    # Get the list of materials
    materials(page: PaginationInput): MaterialList @beehiveList(target_type_name: "Material")
    # Get a material
    getMaterial(material_id: ID!): Material @beehiveGet(target_type_name: "Material")
    # Get a material (DEPRECATED; use getMaterial instead)
    material(material_id: ID!): Material! @beehiveGet(target_type_name: "Material")
    # Find materials based on one or more of their properties
    findMaterials(name: String, transparent_classroom_id: Int, description: String, page: PaginationInput): MaterialList @beehiveSimpleQuery(target_type_name: "Material")
    # Find materials using a complex query
    searchMaterials(query: QueryExpression!, page: PaginationInput): MaterialList @beehiveQuery(target_type_name: "Material")

    # Get the list of material interactions
    materialInteractions(page: PaginationInput): MaterialInteractionList @beehiveList(target_type_name: "MaterialInteraction")
    # Get a material interaction
    getMaterialInteraction(material_interaction_id: ID!): MaterialInteraction @beehiveGet(target_type_name: "MaterialInteraction")
    # Get a material interaction (DEPRECATED; use getMaterialInteraction)
    materialInteraction(material_interaction_id: ID!): MaterialInteraction! @beehiveGet(target_type_name: "MaterialInteraction")
    # Find material interactions based on one or more of their properties
    findMaterialInteractions(subject: ID, object: ID, codes: ObservationCode, concentration: ConcentrationInformationInput, engagementType: EngagementType, page: PaginationInput): MaterialInteractionList @beehiveSimpleQuery(target_type_name: "MaterialInteraction")
    # Find material interactions using a complex query
    searchMaterialInteractions(query: QueryExpression!, page: PaginationInput): MaterialInteractionList @beehiveQuery(target_type_name: "MaterialInteraction")

    # Get the list of social interactions
    socialInteractions(page: PaginationInput): SocialInteractionList @beehiveList(target_type_name: "SocialInteraction")
    # Get a social interaction
    getSocialInteraction(social_interaction_id: ID!): SocialInteraction @beehiveGet(target_type_name: "SocialInteraction")
    # Find social interactions based on one or more of their properties
    findSocialInteractions(source_type: SourceType, subjects: [ID!], validations: [ID!], page: PaginationInput): SocialInteractionList @beehiveSimpleQuery(target_type_name: "SocialInteraction")
    # Find social interactions using a complex query
    searchSocialInteractions(query: QueryExpression!, page: PaginationInput): SocialInteractionList @beehiveQuery(target_type_name: "SocialInteraction")

    # Get the list of interaction validations
    interactionValidations(page: PaginationInput): InteractionValidationList @beehiveList(target_type_name: "InteractionValidation")
    # Get an interaction validation
    getInteractionValidation(interaction_validation_id: ID!): InteractionValidation @beehiveGet(target_type_name: "InteractionValidation")
    # Find interaction validations based on one or more of their properties
    findInteractionValidations(interaction: ID, validator: ID, page: PaginationInput): InteractionValidationList @beehiveSimpleQuery(target_type_name: "InteractionValidation")
    # Find interaction validations using a complex query
    searchInteractionValidations(query: QueryExpression!, page: PaginationInput): InteractionValidationList @beehiveQuery(target_type_name: "InteractionValidation")
}

extend type Mutation {
    # Create a new material
    createMaterial(material: MaterialInput): Material @beehiveCreate(target_type_name: "Material")
    # Update a material
    updateMaterial(material_id: ID!, material: MaterialUpdateInput): Material @beehiveUpdate(target_type_name: "Material")
    # Delete a material
    deleteMaterial(material_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Material")

    # Create a new material interaction
    createMaterialInteraction(materialInteraction: MaterialInteractionInput): MaterialInteraction @beehiveCreate(target_type_name: "MaterialInteraction")
    # Update a material interaction
    updateMaterialInteraction(material_interaction_id: ID!, materialInteraction: MaterialInteractionUpdateInput): MaterialInteraction @beehiveUpdate(target_type_name: "MaterialInteraction")
    # Delete a material interaction
    deleteMaterialInteraction(material_interaction_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "MaterialInteraction")

    # Create a new social interaction
    createSocialInteraction(socialInteraction: SocialInteractionInput): SocialInteraction @beehiveCreate(target_type_name: "SocialInteraction")
    # Update a social interaction
    updateSocialInteraction(social_interaction_id: ID!, socialInteraction: SocialInteractionUpdateInput): SocialInteraction @beehiveUpdate(target_type_name: "SocialInteraction")
    # Delete a social interaction
    deleteSocialInteraction(social_interaction_id: ID!): DeleteStatusResponse @beehiveDelete(target_type_name: "SocialInteraction")

    # Create a new interaction validation
    createInteractionValidation(interactionValidation: InteractionValidationInput): InteractionValidation @beehiveCreate(target_type_name: "InteractionValidation")
    # Update an interaction validation
    updateInteractionValidation(interaction_validation_id: ID!, interactionValidation: InteractionValidationUpdateInput): InteractionValidation @beehiveUpdate(target_type_name: "InteractionValidation")
    # Delete an interaction validation
    deleteInteractionValidation(interaction_validation_id: ID!): DeleteStatusResponse @beehiveDelete(target_type_name: "InteractionValidation")

}

`;
