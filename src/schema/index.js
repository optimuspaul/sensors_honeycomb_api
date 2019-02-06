const sensors = require("./sensors")
const geom = require("./geom")
const datapoints = require("./data")
const environments = require("./environments")
const {makeExecutableSchema} = require('graphql-tools')
const {BeehiveDirectives, BeehiveTypeDefs, BeehiveResolvers, hivePg} = require("@wildflowerschools/graphql-beehive")


const rootDefs = `

  type Query {
    _ : Boolean
  }

  type Mutation {
    _ : Boolean
  }

  schema @beehive(schema_name: "honeycomb") {
    query: Query
    mutation: Mutation
  }

`

const logger = { log: e => console.log(e) }
  
const schema = makeExecutableSchema({
  typeDefs: [
    rootDefs,
    BeehiveTypeDefs,
    geom.typeDefs,
    sensors.typeDefs,
    environments.typeDefs,
    datapoints.typeDefs,
  ],
  resolvers: [
    BeehiveResolvers,
    {
      Assignment: {
        assigned: async function(obj, args, context, info) {
          const assigned_type = obj.assigned_type
          const fixed_type_name = assigned_type.charAt(0) + assigned_type.slice(1).toLowerCase()
          return hivePg.getItem(schema, schema._beehive.tables[fixed_type_name], obj.assigned)
        }
      }
    }
  ],
  schemaDirectives: Object.assign(BeehiveDirectives),
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  logger: logger,
})

exports.schema = schema
