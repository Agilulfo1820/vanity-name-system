const VanityNameController = artifacts.require('VanityNameController')
const contractHelper = require('./helpers/contractHelpers.js')

contract('Deploy GenuCardNFT', (accounts) => {
    const deployAccount = accounts[0]
    let vanityNameSystemContract = null
    before(async () => {
        vanityNameSystemContract = await VanityNameController.deployed()
    })

    it('Should deploy smart contract properly', async () => {
        assert(vanityNameSystemContract.address !== '')
    })

    it("OWNER should be set to the deploying address", async () => {
        const owner = await vanityNameSystemContract.owner()
        assert.equal(owner, deployAccount, "The deploying address should be the owner of the contract")
    })
})