const expect = require('chai').expect

const resolvers = require('./index')
const sensors = require('./sensors')
const { Pool } = require('pg')
const pool = new Pool()

const testsupport = require('../testsupport')


describe("Sensors Tests", () => {
  it("creates a new device", async () => {
    await testsupport.doUnitTest(async () => {
        var devices = await sensors.listDevices()
        expect(devices.data.length).to.equal(0)
        await sensors.createDevice({device: {name: "test-device-02", sensors: [{name: "ffc", sensor_type: "CAMERA", version: 1}]}})
        devices = await sensors.listDevices()
        expect(devices.data.length).to.equal(1)
        expect(devices.data[0].name).to.equal("test-device-02")
        var sensorList = await sensors.Device.sensors(devices.data[0])
        expect(sensorList.length).to.equal(1)
        expect(sensorList[0].sensor_type).to.equal("CAMERA")
        expect(sensorList[0].name).to.equal("ffc")
        expect(sensorList[0].version).to.equal(1)
    })
  })
})
