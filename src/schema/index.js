const scalars = require("./scalars");
const sensors = require("./sensors");
const geom = require("./geom");
const resolvers = require("../resolvers").resolvers;
const {
  makeExecutableSchema,
  mergeSchemas,
} = require('graphql-tools');


const rootDefs = `
  type Query {
    devices(envId: String): DeviceList!
    getTuple: Tuple!
  }

  type Mutation {
    createDevice(device: DeviceInput): Device
    createSensor(sensor: SensorInput): Sensor
    addSensorToDevice(deviceId: ID!, sensorId: ID!): Device
    updateCameraCalibration(calibration: ExtrinsicCameraCalibrationInput!): Camera!
  }
`;

const logger = { log: e => console.log(e) }
  
const schema = makeExecutableSchema({
  typeDefs: [
    geom.typeDefs,
    scalars.typeDefs,
    sensors.typeDefs,
    rootDefs,
  ],
  resolvers: resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  logger: logger,
});

exports.schema = schema;
