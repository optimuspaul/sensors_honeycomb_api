const uuidv4 = require('uuid/v4');
const { Pool } = require('pg')
const pool = new Pool()
const { now } = require('./utils')


exports.Sensor = {
    __resolveType(obj, context, info){
        if(obj.sensor_type == "CAMERA"){
            return 'Camera'
        }
        return 'GenericSensor'
    }
}

exports.Device = {
    async sensors(obj, args, context, info) {
        var sensors = await pool.query('SELECT * FROM honeycomb.sensor_installation WHERE device_id = $1', [obj.device_id])
        return sensors.rows
    },
}

exports.GenericSensor = {
    async default_config(obj, args, context, info) {
        return obj.default_config
    }
}

exports.SensorInstallation = {
    async sensor(obj, args, context, info) {
        var sensor = await pool.query('SELECT * FROM honeycomb.sensors WHERE sensor_id = $1', [obj.sensor_id])
        return sensor.rows[0]
    },
}

exports.listDevices = async function(args) {
    var devices = await pool.query('SELECT * FROM honeycomb.devices')
    return {data: devices.rows}
}

exports.listSensors = async function(args) {
    var sensors = await pool.query('SELECT * FROM honeycomb.sensors')
    return {data: sensors.rows}
}

exports.createSensor = async function(args) {
    const client = await pool.connect()
    const sensor_id = uuidv4()
    const sensor = args.sensor
    try {
        await client.query('BEGIN')
        await client.query('INSERT INTO honeycomb.sensors (sensor_id, name, version, sensor_type) VALUES ($1, $2, $3, $4)', [
            sensor_id,
            sensor.name,
            sensor.version,
            sensor.sensor_type
        ])
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    var sensors = await pool.query('SELECT * FROM honeycomb.sensors WHERE sensor_id = $1', [sensor_id])
    return sensors.rows[0]
}

exports._assignSensor = async function(sensor, client) {
    var sensor_install_id = uuidv4()
    await client.query('INSERT INTO honeycomb.sensor_installation (sensor_install_id, device_id, sensor_id, start, "end") VALUES ($1, $2, $3, $4, $5)', [
        sensor_install_id,
        sensor.device_id,
        sensor.sensor_id,
        sensor.start ? start!=null : now(),
        sensor.end
    ])
    return sensor_install_id
}

exports.assignSensor = async function(args) {
    const client = await pool.connect()
    const sensor = args.sensor
    var sensor_install_id = uuidv4()
    try {
        await client.query('BEGIN')
        var sensor_install_id = await exports._assignSensor(sensor, client)
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    var sensor_install = await pool.query('SELECT * FROM honeycomb.sensor_installation WHERE sensor_install_id = $1', [sensor_install_id])
    return sensor_install.rows[0]
}

exports.createDevice = async function(args) {
    const device_id = uuidv4()

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('INSERT INTO honeycomb.devices (device_id, name, description) VALUES ($1, $2, $3)', [
                           device_id,
                           args.device.name,
                           args.device.description
                           ])

        for (var sensor of args.device.sensors) {
            sensor.device_id = device_id
            exports._assignSensor(sensor, client)
        }

        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    var device = await pool.query('SELECT * FROM honeycomb.devices WHERE device_id = $1', [device_id])
    return device.rows[0]
}
