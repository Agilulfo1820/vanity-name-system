const VanityNameController = artifacts.require('VanityNameController')
const contractHelper = require('./helpers/contractHelpers.js')

contract('Deploy', (accounts) => {
    const deployAccount = accounts[0]
    let vanityNameSystemContract = null
    before(async () => {
        vanityNameSystemContract = await VanityNameController.deployed()
    })

    it('Should deploy smart contract properly', async () => {
        assert(vanityNameSystemContract.address !== '')
    })
})