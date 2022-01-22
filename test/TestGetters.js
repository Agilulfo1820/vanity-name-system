const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')

contract('Getters', (accounts) => {
    const vanityNameForGetter = 'checkAvailabilityName'
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it('User should be able to see fee for name', async () => {
        const fee = await vanityNameController.getFee('test')
        assert.exists(fee.toString())
    })

    it("User should be able to check if a name is available", async () => {
        const user = accounts[1]

        let isAvailable = await vanityNameController.checkAvailability(vanityNameForGetter)
        assert.equal(true, isAvailable)

        const salt = await contractHelper.makeCommitment(vanityNameController, vanityNameForGetter, user)
        const fee = await vanityNameController.getFee(vanityNameForGetter)
        await vanityNameController.buy(vanityNameForGetter, user, salt, {from: user, value: fee.toString()})

        isAvailable = await vanityNameController.checkAvailability(vanityNameForGetter)
        assert.equal(false, isAvailable)
    })

    it("User should be able to list all vanity names", async () => {
        let vanityNames = await vanityNameController.index()
        assert.exists(vanityNames)
    })
})