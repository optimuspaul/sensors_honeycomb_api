const scalars = require("./scalars");
const sensors = require("./sensors");
const geom = require("./geom");
const environments = require("./environments");
const resolvers = require("../resolvers").resolvers;
const {
  makeExecutableSchema,
  mergeSchemas,
} = require('graphql-tools');


const rootDefs = `
  
  input PaginationInput {
    max: Int
    cursor: String
  }

  type Query {
    devices(envId: String, page: PaginationInput): DeviceList!
    sensors(page: PaginationInput): SensorList!
    environments(page: PaginationInput): [Environment]!
  }

  type Mutation {
    # adds a new device to the graph
    createDevice(device: DeviceInput): Device
    # adds a new sensor to the graph
    createSensor(sensor: SensorInput): Sensor
    addSensorToDevice(deviceId: ID!, sensorId: ID!): Device
    createCoordinateSpace(space: CoordinateSpaceInput): CoordinateSpace
  }
`;

const logger = { log: e => console.log(e) }
  
const schema = makeExecutableSchema({
  typeDefs: [
    geom.typeDefs,
    scalars.typeDefs,
    sensors.typeDefs,
    environments.typeDefs,
    rootDefs,
  ],
  resolvers: resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  logger: logger,
});

exports.schema = schema;
