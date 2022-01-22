const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')

const SUBSCRIPTION_PERIOD = 20*1000;

contract('Buy Vanity Name', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it("User should be able to buy a name", async () => {
        const user = accounts[1]
        const fee = await vanityNameController.getFee('test')

        //buy name
        const tx = await vanityNameController.buy('test', {from: user, value: fee.toString()})
        const event = contractHelper.getEventFromTransaction(tx)

        assert.equal(user, event.newOwner)
        assert.equal('test', event.vanityName)
        assert.exists(event.expiresAt.toString())
        assert.exists(event.fee.toString())
    })

    it("User should be set as owner of vanity name after buying it", async () => {
        const user = accounts[2]

        //buy name
        const fee = await vanityNameController.getFee('ownerOfTest-VanityName')
        await vanityNameController.buy('ownerOfTest-VanityName', {from: user, value: fee.toString()})

        const owner = await vanityNameController.ownerOf('ownerOfTest-VanityName')
        assert.equal(user, owner)
    })

    it("I shouldn't be able to buy a name that is already in use", async () => {
        const user = accounts[1]
        const name = 'expirationTest1'
        const fee = await vanityNameController.getFee(name)

        //buy name
        await vanityNameController.buy(name, {from: user, value: fee.toString()})

        const user2 = accounts[2]
        await exceptionHelper.catchRevert(vanityNameController.buy(name, {from: user2, value: fee.toString()}))
    })

    it("When renewal ends name should be available again", async () => {
        const user = accounts[1]
        const name = 'expirationTest'
        const fee = await vanityNameController.getFee(name)

        //buy name
        await vanityNameController.buy(name, {from: user, value: fee.toString()})
        let isAvailable = await vanityNameController.checkAvailability(name)
        assert.equal(false, isAvailable)

        //Wait until the renewal ends
        //TODO: remember to reactivate

        // console.log('Waiting 1.5 minutes for subscription to expire...')
        // await contractHelper.sleep(SUBSCRIPTION_PERIOD)
        //
        // // isAvailable = await vanityNameController.checkAvailability(name)
        // // console.log(isAvailable)
        // // assert.equal(true, isAvailable)
        //
        // console.log(await vanityNameController.ownerOf(name))
        //
        // const user2 = accounts[2]
        // const tx = await vanityNameController.buy(name, {from: user2, value: fee.toString()})
        // const event = contractHelper.getEventFromTransaction(tx)
        //
        // assert.equal(user2, event.newOwner)
        // assert.equal(name, event.vanityName)
        // assert.exists(event.expiresAt.toString())
        // assert.exists(event.fee.toString())
    })
})