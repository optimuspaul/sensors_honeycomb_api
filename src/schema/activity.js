exports.typeDefs = `

type Material {
    material_id: ID!
    name: String
    transparent_classroom_id: Int
    transparent_classroom_type: TransparentClassroomLessonType
    description: String
    # Position assignments associated with this device
    # positions: [Position!]
    # Entity assignments associated with this material
    entity_assignments: [EntityAssignment!] @relation(name: "entity_assigned", direction: "OUT")
    # Material assignments associated with this material
    material_assignments: [MaterialAssignment!]
    # Material interactions associated with this material
    material_interactions: [MaterialInteraction!] @relation(name: "material_interactions", direction: "OUT")
}

enum TransparentClassroomLessonType {
    material
    lesson
    group
}

type Tray {
    tray_id: ID!
    name: String
    part_number: String
    serial_number: String
    description: String
    # Position assignments associated with this device
    # positions: [Position!]
    # Entity assignments associated with this tray
    entity_assignments: [EntityAssignment!] @relation(name: "entity_assigned", direction: "OUT")
    # Material assignments associated with this tray
    material_assignments: [MaterialAssignment!]
    # Tray interactions associated with this tray
    tray_interactions: [TrayInteraction!] @relation(name: "tray_interactions", direction: "OUT")
}


type MaterialAssignment @relation(name: "MaterialAssignment") {
    from: Material!
    to: Tray!
    start: DateTime!
    end: DateTime
}

union Interaction = MaterialInteraction | TrayInteraction

type MaterialInteraction {
    material_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # Person that is the subject of the interaction
    person: Person @relation(name: "person", direction: "OUT")
    # Material the person is interacting with
    material: Material! @relation(name: "material_interactions", direction: "IN")
    # Start time of the interaction
    start: DateTime!
    # End time of the interaction
    end: DateTime
    # Duration of the interaction (DEPRECATED; use end instead)
    duration: Int
    # Observation codes associated with the interaction
    codes: [ObservationCode!]
    # Concentration information about the interaction
    concentration: ConcentrationInformation!
    # Type of engagement
    engagement_type: EngagementType
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

type TrayInteraction {
    tray_interaction_id: ID!
    # Source of the interaction information (ground truth or inference)
    source_type: SourceType!
    # Person that is the subject of the interaction
    person: Person @relation(name: "person", direction: "OUT")
    # Tray the person is interacting with
    tray: Tray! @relation(name: "tray_interactions", direction: "IN")
    # Start time of the interaction
    start: DateTime!
    # End time of the interaction
    end: DateTime
    # Type of tray interaction
    interaction_type: TrayInteractionType
}

enum TrayInteractionType {
    CARRYING_FROM_SHELF
    CARRYING_TO_SHELF
    CARRYING_UNKNOWN
    NEXT_TO
    OTHER
}


`;
