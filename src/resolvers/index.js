const gqldate = require("graphql-iso-date");

// load up the resolvers
const sensors = require("./sensors");



/********************************************************************************************
 * Resolver implementation map.
 ********************************************************************************************/
const resolvers = {
    Query: {
        async devices(obj, args, context, info) {
            return sensors.listDevices(args)
        },
        async sensors(obj, args, context, info) {
            return sensors.listSensors(args)
        },
    },
    Device: sensors.Device,
    Sensor: sensors.Sensor,
    SensorInstallation: sensors.SensorInstallation,
    Datetime: gqldate.GraphQLDateTime,
    Mutation: {
        async createDevice(obj, args, context, info) {
            return sensors.createDevice(args)
        },
        async createSensor(obj, args, context, info) {
            return sensors.createSensor(args)
        }
    },
}

exports.resolvers = resolvers