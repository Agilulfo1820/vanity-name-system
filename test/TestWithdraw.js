const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')
require('dotenv').config()

const SUBSCRIPTION_PERIOD_DEV = process.env.SUBSCRIPTION_PERIOD_DEV

contract('Withdraw', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it("User should not be able to withdraw if name is not expired", async () => {
        const user = accounts[1]
        const name = 'withdrawTest1'

        //buy name
        const salt = await contractHelper.makeCommitment(vanityNameController, name, user)
        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, user, salt, {from: user, value: fee.toString()})

        await exceptionHelper.catchRevert(vanityNameController.withdrawFee(name))
    })

    it("User should not be able to withdraw if name not belongs to him", async () => {
        const user = accounts[2]
        const name = 'withdrawTest1'

        await exceptionHelper.catchRevert(vanityNameController.withdrawFee(name, {from: user}))
    })

    it("User should not be able to withdraw if name is non existing", async () => {
        const user = accounts[1]
        const name = 'withdrawTestNonexistentName'

        await exceptionHelper.catchRevert(vanityNameController.withdrawFee(name, {from: user}))
    })

    it("User can successfully withdraw fee when name expires", async () => {
        const user = accounts[1]
        const name = 'correctWithdraw'

        //buy name
        const salt = await contractHelper.makeCommitment(vanityNameController, name, user)
        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, user, salt,  {from: user, value: fee.toString()})

        const startingStakedBalance = await vanityNameController.getTotalStakedAmount(user)

        //let name expire
        console.log('Waiting for vanity name to expire (you can set this period in .env and at top of smart contract)...')
        await contractHelper.sleep(SUBSCRIPTION_PERIOD_DEV)
        const tx = await vanityNameController.withdrawFee(name, {from: user})
        const event = contractHelper.getEventFromTransaction(tx)

        //assert that event data is correct
        assert.equal(user, event.user)
        assert.equal(name, event.vanityName)
        assert.equal(fee.toString(), event.amount.toString())

        //assert that balance was correctly updated
        const endingStakingBalance = await vanityNameController.getTotalStakedAmount(user)
        assert.equal((startingStakedBalance.sub(fee)).toString(), endingStakingBalance.toString())

        //assert that I am not the owner of the token anymore
        const newOwner = await vanityNameController.ownerOf(name)
        assert.notEqual(user, newOwner)
        assert.equal('0x0000000000000000000000000000000000000000', newOwner)
    })
})