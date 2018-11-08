const resolvers = require('./resolvers/index')
const sensors = require('./resolvers/sensors')

const fixtures = async () => {
    try {
        const sensor1 = await sensors.createSensor({sensor: {name: "simple camera v1", sensor_type: "CAMERA", version: 1}})
        const sensor2 = await sensors.createSensor({sensor: {name: "simple camera v2", sensor_type: "CAMERA", version: 2}})
        const sensor3 = await sensors.createSensor({sensor: {name: "ble_v1", sensor_type: "RADIO", version: 1}})
        console.log(sensor1)
        await sensors.createDevice({device:
                {
                    name: "test-device-01",
                    description: "A device with an older camera and a bluetooth sensor",
                    sensors: [
                        {sensor_id: sensor1.sensor_id},
                        {sensor_id: sensor3.sensor_id}
                    ]
                }})
        await sensors.createDevice({device:
                {
                    name: "test-device-02",
                    description: "A device with an newer camera and a bluetooth sensor",
                    sensors: [
                        {sensor_id: sensor2.sensor_id},
                        {sensor_id: sensor3.sensor_id}
                    ]
                }})
        await sensors.createDevice({device:
                {
                    name: "test-device-03",
                    description: "A device with only a bluetooth sensor",
                    sensors: [
                        {sensor_id: sensor3.sensor_id}
                    ]
                }})
    } catch(err) {
        console.log(err);
    }
}

fixtures()
