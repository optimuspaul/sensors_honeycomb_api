const sensors = require("./sensors")
const geom = require("./geom")
const datapoints = require("./data")
const activity = require("./activity")
const environments = require("./environments")
const { makeAugmentedSchema, neo4jgraphql, cypherMutation } = require('neo4j-graphql-js');
const neo4j = require('neo4j-driver');
const {_} = require('lodash');
const util = require('util')

// horrible hacks because they are not exported but probaboy should be
const { extractQueryResult } = require('/app/node_modules/neo4j-graphql-js/dist/utils');


const rootDefs = `

`



const logger = { log: e => console.log(e) }

const schema = makeAugmentedSchema({
  typeDefs: [
    rootDefs,
    geom.typeDefs,
    sensors.typeDefs,
    environments.typeDefs,
    datapoints.typeDefs,
    activity.typeDefs,
].join(""),
  resolvers: {
    Mutation: {
        AddEnvironmentDevice_assignments: async(obj, args, context, info) => {
            const session = context.driver.session()
            try {
                let mutation = cypherMutation(args, context, info)
                await session.run(
                  'MATCH (:Device{device_id: $from.device_id})-[r:DeviceAssignment]->(e:Environment) WHERE r.end IS NULL AND r.start <> datetime($data.start) AND e.environment_id <> $to.environment_id SET r.end = datetime($data.start);',
                    args
                )
                const result = await session.run(mutation[0], mutation[1])
                return extractQueryResult(result, info.returnType)
            } finally {
                await session.close()
            }
        },
        AddExtrinsicCalibrationCoordinate_space: async(obj, args, context, info) => {
            const session = context.driver.session()
            try {
                let mutation = cypherMutation(args, context, info)
                await session.run(
                  'MATCH (e:ExtrinsicCalibration)-[r:InSpace]->(:CoordinateSpace{space_id: $to.space_id}) WHERE r.end IS NULL AND r.start <> datetime($data.start) AND e.extrinsic_calibration_id <> $from.extrinsic_calibration_id SET r.end = datetime($data.start);',
                    args
                )
                const result = await session.run(mutation[0], mutation[1])
                return extractQueryResult(result, info.returnType)
            } finally {
                await session.close()
            }
        },
        AddPersonEnvironments: async (obj, args, context, info) => {
            const session = context.driver.session()
            try {
                let mutation = cypherMutation(args, context, info)
                await session.run(
                  'MATCH (:Person{person_id: $from.person_id})-[r:PersonAssignment]->(e:Environment) WHERE r.end IS NULL AND r.start <> datetime($data.start) AND e.environment_id <> $to.environment_id SET r.end = datetime($data.start);',
                    args
                )
                const result = await session.run(mutation[0], mutation[1])
                return extractQueryResult(result, info.returnType);

            } finally {
                await session.close()
            }
        }
    }
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  logger: logger,
  config: {
  }
})

exports.schema = schema
