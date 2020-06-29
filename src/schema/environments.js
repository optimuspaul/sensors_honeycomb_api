exports.typeDefs = `

  type Environment {
    environment_id: ID!
    name: String!,
    transparent_classroom_id: Int
    description: String
    location: String
    # Person assignments
    persons: [PersonAssignment!]
  }

  type Person {
    person_id: ID!
    name: String @cypher(
        statement: "MATCH (this) RETURN apoc.text.join(this.first_name + this.surnames, ' ') as String"
      )
    first_name: String
    surnames: [String!]
    nickname: String
    short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
    # Environment assignments
    environments: [PersonAssignment!]
    # Position assignments associated with this device
    positions: [Position!]
    # Entity assignments associated with this person
    entity_assignments: [EntityAssignment!]
    # Material interactions associated with this person
    material_interactions: [MaterialInteraction!]
    # Tray interactions associated with this person
    tray_interactions: [TrayInteraction!]
    # 3D poses associated with this person
    poses3d: [Pose3D!]
    # 2D poses associated with this person
    poses2d: [Pose2D!]
  }

  enum PersonType {
    STUDENT
    TEACHER
    ASSISTANT
    PARENT
    OTHER
  }

  union Assignable = Device | Person | Material | Tray

  type DeviceAssignment @relation(name: "DeviceAssignment") {
    to: Environment!
    from: Device!
    start: DateTime!
    end: DateTime
  }


    type PersonAssignment @relation(name: "PersonAssignment") {
      to: Environment!
      from: Person!
      start: DateTime!
      end: DateTime
    }

  type EntityAssignment {
    entity_assignment_id: ID!
    entity_type: EntityType!
    entity: Entity!
    device: Device!
    start: DateTime!
    end: DateTime
  }

  union Entity = Person | Material | Tray

  enum EntityType {
    PERSON
    MATERIAL
    TRAY
  }

  type MaterialAssignment {
    material_assignment_id: ID!
    material: Material!
    tray: Tray!
    start: DateTime!
    end: DateTime
  }


`
