const gqldate = require("graphql-iso-date");

// load up the resolvers
const sensors = require("./sensors");



/********************************************************************************************
 * Resolver implementation map.
 ********************************************************************************************/
const resolvers = {
    Query: {
        async devices(obj, args, context, info) {
            return sensors.listDevices()
        },
    },
    Device: sensors.Device,
    Sensor: sensors.Sensor,
    Datetime: gqldate.GraphQLDateTime,
    Mutation: {
        async createDevice(obj, args, context, info) {
            return sensors.createDevice(args)
        }
    },
}

exports.resolvers = resolvers