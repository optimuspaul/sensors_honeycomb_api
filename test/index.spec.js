const run = require('docker-run')
const { request } = require('graphql-request')
const expect = require('chai').expect
const { Pool } = require('pg')
const pool = new Pool()
const { server } = require("./testsupport")
const { schema } = require("../src/schema")


const uri = "http://localhost:4000/graphql"

process.env.ENVIRONMENT = "local"
process.env.PGPASSWORD = "iamaninsecurepassword"
process.env.PGUSER = "beehive_user"
process.env.PGDATABASE = "beehive-tests-integrated"
process.env.PGHOST = "localhost"
process.env.PGPORT = "5432"

var dbContainer

if (process.env.BEEHIVE_MOCK_STREAM == "yes") {
    var kinesalite = require('kinesalite'),
    kinesaliteServer = kinesalite()
    kinesaliteServer.listen(4567, function(err) {
        if (err) throw err
        console.log('Kinesalite started on port 4567')
    })
    const AWS = require('aws-sdk');
    kinesis_mock = new AWS.Kinesis({endpoint: "http://localhost:4567"});
    kinesis_mock.createStream({StreamName: "beehive_stream", ShardCount: 1}, console.log)
}


before(async function() {
    // helper for waiting for things
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // check for postgreSQL to be running
    function status() {
        return pool.query("SELECT 'hello world'").then(data => {
          return true
        }).catch(err => {
          return false})
    }

    // do the deed, get postgreSQL running
    dbContainer = await (async function() {
        console.log('starting postgres')
        var isUp = await status()
        if (isUp) {
            console.log('postgres is already up')
            return true
        }
        var child = run('postgres:10.4', {
          remove: true,
          env: {
              POSTGRES_PASSWORD: "iamaninsecurepassword",
              POSTGRES_USER: "beehive_user",
              POSTGRES_DB: "beehive-tests-integrated",
          },
          ports: {
            5432: 5432
          }
        })
        // wait for it to come up
        for (let i=0; i < 4; i++) {
            var ok = await status()
            if (ok) {
                await sleep(10000)
                console.log("returning child")
                return child
            }
            await sleep(3000)
        }

        // if it hasn't come up destroy it
        child.destroy()
        throw Error("postgres didn't start")
    })()
    return
})


after(async function(){
    console.log("shutting down postgres and express")
    dbContainer.destroy()
})


describe('Honeycomb general suite', function() {
    var expressApp

    before(async function() {
        // setup an apollo-server-express app and run it
        expressApp = await server(schema)
    })

    after(async function() {
        expressApp.close()
    })

    describe('devices and sensors', function() {
        const sensorTests = require("./sensors")
        sensorTests.all(uri)
    })

    describe('environments', function() {
        const environmentsTests = require("./environments")
        environmentsTests.all(uri)
    })

})
