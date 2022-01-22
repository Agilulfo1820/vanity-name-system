const VanityNameController = artifacts.require('VanityNameController')
const catchRevert = require("./helpers/exceptionsHelpers.js").catchRevert
const contractHelper = require('./helpers/contractHelpers.js')
const truffleAssert = require('truffle-assertions')
const {ethers} = require("ethers")

contract('VanityNameController', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it('User should be able to see fee for name', async () => {
        const fee = await vanityNameController.getVanityNameFee('test')
        assert.exists(fee.toString())
    })

    // withdraw balance

    it("User should be able to buy a name", async () => {
        const user = accounts[1]
        const fee = await vanityNameController.getVanityNameFee('test')

        //create new token
        const tx = await vanityNameController.buy('test', {from: user, value: fee.toString()})
        const event = contractHelper.getEventFromTransaction(tx)

        assert.equal(user, event.owner)
        assert.equal('test', event.vanityName)
        assert.exists(event.endTime.toString())
        assert.exists(event.fee.toString())
    })

    it("User should be set as owner of vanity name after buying it", async () => {
        const user = accounts[2]

        //create new token
        const fee = await vanityNameController.getVanityNameFee('ownerOfTest-VanityName')
        await vanityNameController.buy('ownerOfTest-VanityName', {from: user, value: fee.toString()})

        const owner = await vanityNameController.ownerOf('ownerOfTest-VanityName')
        assert.equal(user, owner)
    })

    it("User should be able to check if a name is available", async () => {
        let isAvailable = await vanityNameController.checkAvailability('shouldbeavaiable')
        assert.equal(true, isAvailable)

        // 'test' vanity name was bought in the previous test, so it should not be available
        isAvailable = await vanityNameController.checkAvailability('test')
        assert.equal(false, isAvailable)
    })

    it("User should be able to list all vanity names", async () => {
        let vanityNames = await vanityNameController.getVanityNames()
        assert.exists(vanityNames)
    })

    it("User should be able to list all vanity names of an address", async () => {
        let vanityNames = await vanityNameController.getVanityNamesOf(accounts[1])

        assert.exists(vanityNames)
        assert.equal(vanityNames[0], 'test')
    })
})