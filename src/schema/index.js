const common = require("./common")
const sensors = require("./sensors")
const geom = require("./geom")
const datapoints = require("./data")
const activity = require("./activity")
const environments = require("./environments")
const { makeAugmentedSchema, extractQueryResult } = require('neo4j-graphql-js');
const { Keypoint2D, Keypoint3D } = require('../scalars');
const neo4j = require('neo4j-driver');
const temporal_util = require('/app/node_modules/neo4j-driver/lib/internal/temporal-util');
const {_} = require('lodash');
const util = require('util')


const rootDefs = `

type Mutation {
    assignPersonToEnvironment(person_id: ID!, environment_id: ID!, start_date: _Neo4jDateInput): PersonAssignment
}

`
function fixInt(field) {
    return field.inSafeRange() ? field.toNumber() : field.toString();
}


function cleanObj(obj) {
    return _.cloneDeepWith(obj, field => {
        if (neo4j.isInt(field)) {
            // See: https://neo4j.com/docs/api/javascript-driver/current/class/src/v1/integer.js~Integer.html
            return fixInt(field);
        } else if(neo4j.isDateTime(field)) {
            console.log(`found a datetime ${field.toString()}`)
            return {
                year: fixInt(field.year),
                month: fixInt(field.month),
                day: fixInt(field.day),
                hour: fixInt(field.hour),
                minute: fixInt(field.minute),
                second: fixInt(field.second),
                microsecond: 0, // TODO - make this right
                millisecond: 0, // TODO - make this right
                nanosecond: fixInt(field.nanosecond),
                timezone: temporal_util.timeZoneOffsetToIsoString(field.timeZoneOffsetSeconds),
                formatted: field.toString(),
            }
        }
    });
}


const logger = { log: e => console.log(e) }

const schema = makeAugmentedSchema({
  typeDefs: [
    rootDefs,
    common.typeDefs,
    geom.typeDefs,
    sensors.typeDefs,
    environments.typeDefs,
    datapoints.typeDefs,
    activity.typeDefs,
].join(""),
  resolvers: {
      Keypoint2D: Keypoint2D,
      Keypoint3D: Keypoint3D,
    Person: {
        name: async (obj, args, context, info) => {
            if(obj.name) {
                return obj.name
            }
            if(obj.first_name && obj.surnames) {
                return obj.first_name + " " + obj.surnames.join(" ")
            }
            if(obj.first_name) {
                return obj.first_name
            }
            return ""
        }
    },
    Mutation: {
        assignPersonToEnvironment: async (obj, args, context, info) => {
            const session = context.driver.session()
            try {
                console.log("======================================================")
                console.log(args)
                console.log("======================================================")
                if(args.start_date.formatted) {
                    args.start_date = args.start_date.formatted
                }
                await session.run(
                  'MATCH (:Person{person_id: $person_id})-[r:PersonAssignment]->(:Environment) WHERE r.end IS NULL SET r.end = datetime($start_date);',
                    args
                )
                console.log("======================================================")
                const result = await session.run(`MATCH (person:Person{person_id: $person_id}),(env:Environment{environment_id: $environment_id})
                    MERGE (person)-[r:PersonAssignment{ start: datetime($start_date) }]->(env)
                    ON MATCH SET r.end = NULL
                    RETURN person, r, env;`,
                    args
                )
                let obj = result.records[0].get('r').properties
                obj['to'] = result.records[0].get('env').properties
                obj['from'] = result.records[0].get('person').properties
                obj['end'] = null
                obj = cleanObj(obj);
                console.log(util.inspect(result.records[0].get('r'), {showHidden: false, depth: null}))
                return obj
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
