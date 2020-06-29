const express = require("express")
const cors = require('cors')
const { ApolloServer, gql } = require('apollo-server-express')
const { schema } = require("./schema")
const voyager = require('graphql-voyager/middleware')
const bodyParser = require('body-parser')

const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

const neo4j = require('neo4j-driver');


console.log("process.env.NEO_URI")
console.log(process.env.NEO_URI)

const driver = neo4j.driver(
  "bolt://neo4j",
  neo4j.auth.basic(process.env.NEO_USERNAME, process.env.NEO_PASSWORD),
  {encrypted: false}
);

const server = new ApolloServer({
    playground: true,
    introspection: true,
    schema,
    context: { driver },
    formatError: error => {
        console.log("---- error ----")
        console.log(JSON.stringify(error, null, 4));
        console.log("---------------")
        return error;
    },
})


const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}));
app.options('*', cors())


// TODO - make these things configurable
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://wildflowerschools.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://honeycomb.api.wildflowerschools.org',
    issuer: "https://wildflowerschools.auth0.com/",
    algorithms: ['RS256']
})



if(process.env.ENVIRONMENT != 'local') {
    app.use(function(req, res, next) {
        if(req.method == "GET" || (req.method == "POST" && req.body.operationName == "IntrospectionQuery")) {
            next()
        } else {
            jwtCheck(req, res, next)
        }
    })
}

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({status: "error", message: err.message})
})


app.use('/voyager', voyager.express({ endpointUrl: '/graphql' }))

server.applyMiddleware({ app })



exports.start = async () => {
    console.log("checking database")
    try {
        return app.listen({ port: 4000 }, () =>
          console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        )
    } catch (e) {
        console.log("---- error has occurred ----")
        console.log(e)
        console.log("----------------------------")
    }
}
