const uuidv4 = require('uuid/v4');
const { Pool } = require('pg')
const pool = new Pool()


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
        var sensors = await pool.query('SELECT * FROM honeycomb.sensors WHERE device = $1', [obj.device_id])
        return sensors.rows
    },
}


exports.listDevices = async function() {
    var devices = await pool.query('SELECT * FROM honeycomb.devices')
    return {data: devices.rows}
}


exports.createDevice = async function(args) {
    const device_id = uuidv4()

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('INSERT INTO honeycomb.devices (device_id, name) VALUES ($1, $2)', [device_id, args.device.name])

        for (var sensor of args.device.sensors) {
            var sensor_id = uuidv4()
            await client.query('INSERT INTO honeycomb.sensors (sensor_id, name, version, sensor_type, device) VALUES ($1, $2, $3, $4, $5)', [
                sensor_id,
                sensor.name,
                sensor.version,
                sensor.sensor_type,
                device_id
            ])
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
