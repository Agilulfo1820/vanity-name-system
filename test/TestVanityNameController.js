const VanityNameController = artifacts.require('VanityNameController')
const catchRevert = require("./helpers/exceptionsHelpers.js").catchRevert
const contractHelper = require('./helpers/contractHelpers.js')
const truffleAssert = require('truffle-assertions');
const { ethers } = require("ethers");

const FEE_AMOUNT_IN_WEI = 10000000000000000;

contract('VanityNameController', (accounts) => {
    let vanityNameController = null
    before(async () => {
        vanityNameController = await VanityNameController.deployed()
    })

    it('User should be able to see fee for name', async () => {
        const fee = await vanityNameController.getVanityNameFee('test')
        assert.exists(fee.toNumber())
    })

    // withdraw balance

    //ownerOf


    it("User should be able to buy a name", async () => {
        const user = accounts[1]
        const fee = await vanityNameController.getVanityNameFee('test')
        //create new token

        const tx = await vanityNameController.buy('test', { value: fee.toNumber() });
        const event = contractHelper.getEventFromTransaction(tx)
    })

})