const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')
const {ethers} = require("ethers")
require('dotenv').config()

const SUBSCRIPTION_PERIOD_DEV = process.env.SUBSCRIPTION_PERIOD_DEV

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
        console.log('Waiting for vanity name to expire (you can set this period in .env)...')
        await contractHelper.sleep(SUBSCRIPTION_PERIOD_DEV)

        const user2 = accounts[2]
        const tx = await vanityNameController.buy(name, {from: user2, value: fee.toString()})
        const event = contractHelper.getEventFromTransaction(tx)

        assert.equal(user2, event.newOwner)
        assert.equal(name, event.vanityName)
        assert.exists(event.expiresAt.toString())
        assert.exists(event.fee.toString())
    })

    it("Fee should be successfully staked", async () => {
        const user = accounts[3]
        const name = 'stakeFeeTest'

        const startingStakedBalance = await vanityNameController.getTotalStakedAmount(user)

        //buy name
        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, {from: user, value: fee.toString()})

        const endingStakingBalance = await vanityNameController.getTotalStakedAmount(user)

        assert.equal((startingStakedBalance.add(fee)).toString(), endingStakingBalance.toString())
    })
})