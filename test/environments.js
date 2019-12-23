const { request } = require('graphql-request')
const expect = require('chai').expect


async function createEnvironment(uri) {
    it("create an environment", async function() {
        const createQuery = `
                mutation {
                  createEnvironment(environment: {
                    name: "Intangibleius Montessori",
                    transparent_classroom_id: 222222222,
                    description: "test classroom",
                    location: "Minneapolis, MN"
                  }) {
                    environment_id
                    name
                    transparent_classroom_id
                    description
                    location
                    system {
                        created
                    }
                  }
                }
            `
        var response = await request(uri, createQuery)
        expect(response).to.not.equal(null)
        expect(response.createEnvironment.environment_id).to.not.equal(null)
        expect(response.createEnvironment.name).to.equal("Intangibleius Montessori")
        expect(response.createEnvironment.transparent_classroom_id).to.equal(222222222)
        expect(response.createEnvironment.description).to.equal("test classroom")
        expect(response.createEnvironment.location).to.equal("Minneapolis, MN")
    })
}


async function createDevice(uri) {
    const createQuery = `
            mutation {
              createDevice(device: {
                name: "camera-1",
                description: "Raspberry Pi 3b with POE and V2 camera",
                part_number: "wf-pi03-b1",
                device_type: PI3,
                tag_id: "tag-team-94",
                serial_number: "123456",
                mac_address: ["a1:b2:c1:d1:22:44"]
              }) {
                device_id
              }
            }
        `
    var response = await request(uri, createQuery)
    return response.createDevice.device_id
}


async function createCoordinateSpace(uri) {
    it("create a CoordinateSpace", async function() {
        const createEnvironment = `
                mutation {
                  createEnvironment(environment: {
                    name: "Firmament Montessori",
                    transparent_classroom_id: 222222222,
                    description: "test classroom",
                    location: "Ruby, AK"
                  }) {
                    environment_id
                  }
                }
            `
        var env_response = await request(uri, createEnvironment)
        const environment_id = env_response.createEnvironment.environment_id
        const createQuery = `
                mutation {
                  createCoordinateSpace(coordinateSpace: {
                    name: "normal",
                    environment: "${environment_id}",
                    start: "2019-10-10T14:00:00.000Z"
                  }) {
                    space_id
                    name
                    environment {
                        environment_id
                        name
                    }
                    start
                    end
                  }
                }
            `
        var response = await request(uri, createQuery)
        expect(response).to.not.equal(null)
        expect(response.createCoordinateSpace.space_id).to.not.equal(null)
        expect(response.createCoordinateSpace.name).to.equal("normal")
        expect(response.createCoordinateSpace.start).to.equal("2019-10-10T14:00:00.000Z")
        expect(response.createCoordinateSpace.end).to.equal(null)
        expect(response.createCoordinateSpace.environment.name).to.equal("Firmament Montessori")
        expect(response.createCoordinateSpace.environment.environment_id).to.equal(environment_id)

        const space_id = response.createCoordinateSpace.space_id
        const device_id = await createDevice(uri)
        const positionQuery = `
            mutation {
                assignToEnvironment(assignment: {
                    environment: "${environment_id}",
                    assigned_type: DEVICE,
                    assigned: "${device_id}",
                    start: "2019-10-10T14:00:00.000Z"
                }) {
                    assignment_id
                }

                createPositionAssignment(positionAssignment: {
                        device: "${device_id}",
                        coordinate_space: "${space_id}",
                        location: {x: 0, y: 0, z: 1.37},
                        description: "Top of the Pops",
                        start: "2019-10-10T14:00:00.000Z"
                }) {
                    position_assignment_id
                    device {
                        device_id
                        name
                    }
                    coordinate_space {
                        space_id
                        name
                        environment {
                            environment_id
                            name
                        }
                    }
                    location {
                        x
                        y
                        z
                    }
                    description
                    start
                    end
                }
            }
        `
        var positionQueryResponse = await request(uri, positionQuery)
        expect(positionQueryResponse).to.not.equal(null)
        expect(positionQueryResponse.assignToEnvironment.assignment_id).to.not.equal(null)
        expect(positionQueryResponse.createPositionAssignment.position_assignment_id).to.not.equal(null)
        expect(positionQueryResponse.createPositionAssignment.description).to.equal("Top of the Pops")
        expect(positionQueryResponse.createPositionAssignment.start).to.equal("2019-10-10T14:00:00.000Z")
        expect(positionQueryResponse.createPositionAssignment.coordinate_space.name).to.equal("normal")
        expect(positionQueryResponse.createPositionAssignment.coordinate_space.environment.name).to.equal("Firmament Montessori")
        expect(positionQueryResponse.createPositionAssignment.device.name).to.equal("camera-1")
        const position_assignment_id = positionQueryResponse.createPositionAssignment.position_assignment_id

        const devicePosQuery = `
            query {
                getDevice(device_id: "${device_id}") {
                    device_id
                    name
                    positions(current: true) {
                        position_assignment_id
                        coordinate_space {
                            space_id
                            name
                            environment {
                                environment_id
                                name
                            }
                        }
                        location {
                            x
                            y
                            z
                        }
                        description
                        start
                        end
                    }
                }
            }
        `
        var devicePosQueryResponse = await request(uri, devicePosQuery)
        expect(devicePosQueryResponse).to.not.equal(null)
        expect(devicePosQueryResponse.getDevice.device_id).to.equal(device_id)
        expect(devicePosQueryResponse.getDevice.positions.length).to.equal(1)
        expect(devicePosQueryResponse.getDevice.positions[0].position_assignment_id).to.equal(position_assignment_id)

        
    })
}


exports.all = async function(uri) {
    // createEnvironment(uri)
    // createCoordinateSpace(uri)
}
