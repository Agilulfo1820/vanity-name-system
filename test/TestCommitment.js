const VanityNameController = artifacts.require('VanityNameController')
const exceptionHelper = require("./helpers/exceptionsHelpers.js")
const contractHelper = require('./helpers/contractHelpers.js')
const {ethers} = require("ethers")
require('dotenv').config()
const getRandomValues = require('get-random-values')

const SUBSCRIPTION_PERIOD_DEV = process.env.SUBSCRIPTION_PERIOD_DEV

contract('Commitment', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it('User can correctly commit to buy the vanity name', async () => {
        const user = accounts[1]
        const name = 'cool.eth'

        // Generate a random value to mask our commitment
        const random = new Uint8Array(32)
        getRandomValues(random)
        const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("")
        // Submit our commitment to the smart contract
        const commitment = await vanityNameController.makeCommitment(name, user, salt)
        await vanityNameController.commit(commitment)

        // Submit our registration request to buy
        const fee = await vanityNameController.getFee(name)
        await vanityNameController.buy(name, user, salt, {from:user, value: fee.toString()})
    })

    // it('User cannot buy without commitment', async () => {
    //     const user = accounts[1]
    //     const name = 'cool.eth.test'
    //
    //     // Generate a random value to mask our commitment
    //     const random = new Uint8Array(32)
    //     getRandomValues(random)
    //     const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("")
    //
    //     // Submit our registration request to buy
    //     const fee = await vanityNameController.getFee('anotherName')
    //     await exceptionHelper.catchRevert(vanityNameController.buy('anotherName', user, salt, {from:user, value: fee.toString()}))
    // })
})