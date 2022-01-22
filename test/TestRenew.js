const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')
require('dotenv').config()

const SUBSCRIPTION_PERIOD_DEV = process.env.SUBSCRIPTION_PERIOD_DEV

contract('Renew', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it('User cannot renew vanity name of another user', async () => {
        const user = accounts[1]
        const user2 = accounts[2]
        const name = 'cool.eth'

        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, {from: user, value: fee.toString()})

        await exceptionHelper.catchRevert(vanityNameController.renew(name, {from: user2}))
    })

    it('User can renew even if time is not expired', async () => {
        const user = accounts[1]
        const name = 'cool2.eth'

        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, {from: user, value: fee.toString()})

        const tx = await vanityNameController.renew(name, {from: user})
        const event = contractHelper.getEventFromTransaction(tx)

        //assert that event data is correct
        assert.equal(name, event.vanityName)
        assert.equal(user, event.owner)
        assert.exists(event.expiresAt.toString())
    })

    it('User can successfully renew vanity name when it expires', async () => {
        const user = accounts[5]
        const name = 'cool3.eth'

        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, {from: user, value: fee.toString()})

        //let name expire
        console.log('Waiting for vanity name to expire (you can set this period in .env)...')
        await contractHelper.sleep(SUBSCRIPTION_PERIOD_DEV)

        //assert that name expired
        const vanityNameId = (await vanityNameController.getId(name)).toNumber()
        let vanityName = await vanityNameController.get(vanityNameId)
        console.log(vanityName, parseInt(vanityName.expiresAt.toString()), new Date().getTime() / 1000)
        assert.equal(true, parseInt(vanityName.expiresAt.toString()) < new Date().getTime() / 1000)

        const tx = await vanityNameController.renew(name, {from: user})
        const event = contractHelper.getEventFromTransaction(tx)

        //assert that event data is correct
        assert.equal(name, event.vanityName)
        assert.equal(user, event.owner)
        assert.exists(event.expiresAt.toString())

        await contractHelper.sleep(1000)

        //assert that name is not expired anymore
        vanityName = await vanityNameController.get(vanityNameId)
        console.log(vanityName, parseInt(vanityName.expiresAt.toString()), new Date().getTime() / 1000)
        assert.equal(true, parseInt(vanityName.expiresAt.toString()) > new Date().getTime() / 1000)
    })
})