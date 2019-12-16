const { request } = require('graphql-request')
const expect = require('chai').expect


async function createDevice(uri) {
    it("create a device", async function() {
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
                    name
                    description
                    part_number
                    device_type
                    tag_id
                    serial_number
                    mac_address
                  }
                }
            `
        var response = await request(uri, createQuery)
        expect(response).to.not.equal(null)
        expect(response.createDevice.device_id).to.not.equal(null)
        expect(response.createDevice.name).to.equal("camera-1")
        expect(response.createDevice.tag_id).to.equal("tag-team-94")
        expect(response.createDevice.serial_number).to.equal("123456")
    })
}


exports.all = async function(uri) {
    await createDevice(uri)
}
