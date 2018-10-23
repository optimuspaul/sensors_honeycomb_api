const expect = require('chai').expect

const utils = require('./utils');


describe("Utils module tests", async () => {
    it("util hash idempotency", async () => {
        let myObj = {
            firstName: "kevin",
            lastName: "costner"
        }
        let res1 = utils.hashAnything(myObj)
        let res2 = utils.hashAnything(myObj)
        expect(res1).to.equal(res2)
    })

    it("util can use keys instead of full object", async () => {
        let myObj = {
            first: "kevin",
            last: "costner",
            city: "boston"
        }
        let res = utils.hashAnything(myObj, ["first", "last"])
        let res2 = utils.hashAnything(myObj, ["first", "city"])
        expect(res).to.not.equal(res2)
    })

})
