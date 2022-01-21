const VanityNameSystem = artifacts.require('VanityNameSystem')
const catchRevert = require("./helpers/exceptionsHelpers.js").catchRevert
const contractHelper = require('./helpers/contractHelpers.js')

contract('VanityNameSystem Base Functions', (accounts) => {
    const owner = accounts[0]
    let vanityNameSystemContract = null
    before(async () => {
        vanityNameSystemContract = await VanityNameSystem.deployed()
    })

    it('Owner should be able to pause and unpause contract', async () => {
        await vanityNameSystemContract.pause({from : owner})

        let isPaused = await vanityNameSystemContract.paused()
        assert.equal(true, isPaused)

        await vanityNameSystemContract.unpause({from : owner})

        isPaused = await vanityNameSystemContract.paused()
        assert.equal(false, isPaused)
    })

    it('Only Owner should be able to execute VanityNameSystem base functions', async () => {
        await catchRevert(vanityNameSystemContract.pause({from: accounts[1]}))
        await catchRevert(vanityNameSystemContract.unpause({from: accounts[1]}))
    })

    it('Owner should be able to change Owner address', async () => {
        let ownerAddress = await vanityNameSystemContract.owner()
        await vanityNameSystemContract.transferOwnership(accounts[1])

        let newOwnerAddress = await vanityNameSystemContract.owner()

        assert.equal(newOwnerAddress, accounts[1], 'The new owner address should be the one we set.')
        assert.notEqual(newOwnerAddress, ownerAddress)
    })
})