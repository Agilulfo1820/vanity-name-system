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
        let isAvailable = await vanityNameController.checkAvailability(vanityNameForGetter)
        assert.equal(true, isAvailable)

        const user = accounts[1]
        const fee = await vanityNameController.getFee(vanityNameForGetter)
        await vanityNameController.buy(vanityNameForGetter, {from: user, value: fee.toString()})

        isAvailable = await vanityNameController.checkAvailability(vanityNameForGetter)
        assert.equal(false, isAvailable)
    })

    it("User should be able to list all vanity names", async () => {
        let vanityNames = await vanityNameController.index()
        assert.exists(vanityNames)
    })

    it("User should be able to list all vanity names of an address", async () => {
        let vanityNames = await vanityNameController.getVanityNamesOf(accounts[1])

        assert.exists(vanityNames)
        assert.equal(vanityNames[0], vanityNameForGetter)
    })
})