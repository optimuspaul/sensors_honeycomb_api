exports.typeDefs = `

type Material @beehiveTable(table_name: "material", pk_column: "material_id") {
    material_id: ID!
    name: String
    transparent_classroom_id: Int
    transparent_classroom_type: TransparentClassroomLessonType
    description: String
    # Position assignments associated with this device
    position_assignments: [PositionAssignment!] @beehiveAssignmentFilter(target_type_name: "PositionAssignment", assignee_field: "assigned")
    # Entity assignments associated with this material
    entity_assignments: [EntityAssignment!] @beehiveAssignmentFilter(target_type_name: "EntityAssignment", assignee_field: "entity")
    # Material assignments associated with this material
    material_assignments: [MaterialAssignment!] @beehiveAssignmentFilter(target_type_name: "MaterialAssignment", assignee_field: "material")
    # Material interactions associated with this material
    material_interactions: [MaterialInteraction!] @beehiveRelationFilter(target_type_name: "MaterialInteraction", target_field_name: "material")
}

type MaterialList {
    data: [Material!]!
    page_info: PageInfo!
}

input MaterialInput {
    name: String
    transparent_classroom_id: Int
    transparent_classroom_type: TransparentClassroomLessonType
    description: String
}

input MaterialUpdateInput {
    name: String
    transparent_classroom_id: Int
    transparent_classroom_type: TransparentClassroomLessonType
    description: String
}

enum TransparentClassroomLessonType {
    material
    lesson
    group
}

type Tray @beehiveTable(table_name: "trays", pk_column: "tray_id") {
    tray_id: ID!
    name: String
    part_number: String
    serial_number: String
    description: String
    # Position assignments associated with this device
    position_assignments: [PositionAssignment!] @beehiveAssignmentFilter(target_type_name: "PositionAssignment", assignee_field: "assigned")
    # Entity assignments associated with this tray
    entity_assignments: [EntityAssignment!] @beehiveAssignmentFilter(target_type_name: "EntityAssignment", assignee_field: "entity")
    # Material assignments associated with this tray
    material_assignments: [MaterialAssignment!] @beehiveAssignmentFilter(target_type_name: "MaterialAssignment", assignee_field: "tray")
    # Tray interactions associated with this tray
    tray_interactions: [TrayInteraction!] @beehiveRelationFilter(target_type_name: "TrayInteraction", target_field_name: "tray")
}

type TrayList {
    data: [Tray!]!
    page_info: PageInfo!
}

input TrayInput {
  name: String
  part_number: String
  serial_number: String
  description: String
}

input TrayUpdateInput {
  name: String
  part_number: String
  serial_number: String
  description: String
}

union Interaction @beehiveUnion = MaterialInteraction | TrayInteraction

type MaterialInteraction @beehiveTable(table_name: "material_interactions", pk_column: "material_interaction_id") {
    material_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # Person that is the subject of the interaction
    person: Person @beehiveRelation(target_type_name: "Person")
    # Material the person is interacting with
    material: Material! @beehiveRelation(target_type_name: "Material")
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
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation", target_field_name: "interaction")
}

type MaterialInteractionList {
    data: [MaterialInteraction!]!
    page_info: PageInfo!
}

input MaterialInteractionInput {
    source_type: SourceType!
    person: ID
    material: ID!
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
    person: ID
    material: ID
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

type TrayInteraction @beehiveTable(table_name: "tray_interactions", pk_column: "tray_interaction_id") {
    tray_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # Person that is the subject of the interaction
    person: Person @beehiveRelation(target_type_name: "Person")
    # Tray the person is interacting with
    tray: Tray! @beehiveRelation(target_type_name: "Tray")
    # Start time of the interaction
    start: Datetime!
    # End time of the interaction
    end: Datetime
    # Type of tray interaction
    interaction_type: TrayInteractionType
    # Validations
    validations: [InteractionValidation!] @beehiveRelation(target_type_name: "InteractionValidation", target_field_name: "interaction")
}

type TrayInteractionList {
    data: [TrayInteraction!]!
    page_info: PageInfo!
}

input TrayInteractionInput {
    source_type: SourceType!
    person: ID
    tray: ID!
    start: Datetime!
    end: Datetime
    interaction_type: TrayInteractionType
    validations: [ID!]
}

input TrayInteractionUpdateInput {
    source_type: SourceType
    person: ID
    tray: ID
    start: Datetime
    end: Datetime
    interaction_type: TrayInteractionType
    validations: [ID!]
}

enum TrayInteractionType {
    CARRYING_FROM_SHELF
    CARRYING_TO_SHELF
    CARRYING_UNKNOWN
    NEXT_TO
    OTHER
}

type InteractionValidation @beehiveTable(table_name: "interaction_validations", pk_column: "interaction_validation_id") {
    interaction_validation_id: ID!
    interaction: Interaction! @beehiveUnionResolver(target_types: ["MaterialInteraction", "TrayInteraction"])
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
    findMaterials(name: String, transparent_classroom_id: Int, transparent_classroom_type: TransparentClassroomLessonType, description: String, page: PaginationInput): MaterialList @beehiveSimpleQuery(target_type_name: "Material")
    # Find materials using a complex query
    searchMaterials(query: QueryExpression!, page: PaginationInput): MaterialList @beehiveQuery(target_type_name: "Material")

    # Get the list of trays
    trays(page: PaginationInput): TrayList @beehiveList(target_type_name: "Tray")
    # Get a tray
    getTray(tray_id: ID!): Tray @beehiveGet(target_type_name: "Tray")
    # Find trays based on one or more of their properties
    findTrays(name: String, part_number: String, serial_number: String, description: String, page: PaginationInput): TrayList @beehiveSimpleQuery(target_type_name: "Tray")
    # Find trays using a complex query
    searchTrays(query: QueryExpression!, page: PaginationInput): TrayList @beehiveQuery(target_type_name: "Tray")

    # Get the list of material interactions
    materialInteractions(page: PaginationInput): MaterialInteractionList @beehiveList(target_type_name: "MaterialInteraction")
    # Get a material interaction
    getMaterialInteraction(material_interaction_id: ID!): MaterialInteraction @beehiveGet(target_type_name: "MaterialInteraction")
    # Get a material interaction (DEPRECATED; use getMaterialInteraction)
    materialInteraction(material_interaction_id: ID!): MaterialInteraction! @beehiveGet(target_type_name: "MaterialInteraction")
    # Find material interactions based on one or more of their properties
    findMaterialInteractions(person: ID, material: ID, codes: ObservationCode, concentration: ConcentrationInformationInput, engagementType: EngagementType, page: PaginationInput): MaterialInteractionList @beehiveSimpleQuery(target_type_name: "MaterialInteraction")
    # Find material interactions using a complex query
    searchMaterialInteractions(query: QueryExpression!, page: PaginationInput): MaterialInteractionList @beehiveQuery(target_type_name: "MaterialInteraction")

    # Get the list of tray interactions
    trayInteractions(page: PaginationInput): TrayInteractionList @beehiveList(target_type_name: "TrayInteraction")
    # Get a tray interaction
    getTrayInteraction(tray_interaction_id: ID!): TrayInteraction @beehiveGet(target_type_name: "TrayInteraction")
    # Find tray interactions based on one or more of their properties
    findTrayInteractions(person: ID, tray: ID, interaction_type: TrayInteractionType, page: PaginationInput): TrayInteractionList @beehiveSimpleQuery(target_type_name: "TrayInteraction")
    # Find tray interactions using a complex query
    searchTrayInteractions(query: QueryExpression!, page: PaginationInput): TrayInteractionList @beehiveQuery(target_type_name: "TrayInteraction")

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

    # Create a new tray
    createTray(tray: TrayInput): Tray @beehiveCreate(target_type_name: "Tray")
    # Update a tray
    updateTray(tray_id: ID!, tray: TrayUpdateInput): Tray @beehiveUpdate(target_type_name: "Tray")
    # Delete a tray
    deleteTray(tray_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Tray")

    # Create a new material interaction
    createMaterialInteraction(materialInteraction: MaterialInteractionInput): MaterialInteraction @beehiveCreate(target_type_name: "MaterialInteraction")
    # Update a material interaction
    updateMaterialInteraction(material_interaction_id: ID!, materialInteraction: MaterialInteractionUpdateInput): MaterialInteraction @beehiveUpdate(target_type_name: "MaterialInteraction")
    # Delete a material interaction
    deleteMaterialInteraction(material_interaction_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "MaterialInteraction")

    # Create a new tray interaction
    createTrayInteraction(trayInteraction: TrayInteractionInput): TrayInteraction @beehiveCreate(target_type_name: "TrayInteraction")
    # Update a tray interaction
    updateTrayInteraction(tray_interaction_id: ID!, trayInteraction: TrayInteractionUpdateInput): TrayInteraction @beehiveUpdate(target_type_name: "TrayInteraction")
    # Delete a tray interaction
    deleteTrayInteraction(tray_interaction_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "TrayInteraction")

    # Create a new interaction validation
    createInteractionValidation(interactionValidation: InteractionValidationInput): InteractionValidation @beehiveCreate(target_type_name: "InteractionValidation")
    # Update an interaction validation
    updateInteractionValidation(interaction_validation_id: ID!, interactionValidation: InteractionValidationUpdateInput): InteractionValidation @beehiveUpdate(target_type_name: "InteractionValidation")
    # Delete an interaction validation
    deleteInteractionValidation(interaction_validation_id: ID!): DeleteStatusResponse @beehiveDelete(target_type_name: "InteractionValidation")

}

`;
