/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require('dotenv').config()
let HDWalletProvider = require("truffle-hdwallet-provider")

// Constants for deploy
const MNEMONIC = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_URL + process.env.INFURA_KEY

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, INFURA_KEY)
            },
            network_id: 3,
            gas: 8000000,
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, INFURA_KEY)
            },
            network_id: 4,
            gas: 8000000,
        },
        mainnet: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, INFURA_KEY)
            },
            network_id: 1,
            gas: 8000000,
        },
    },
    mocha: {
        // timeout: 100000
    },
    compilers: {
        solc: {
            version: "^0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 100,
                },
                evmVersion: "petersburg",
            },
        },
    },
    plugins: [
        'truffle-plugin-verify',
        'truffle-contract-size',
        'truffle-source-verify',
    ],
    api_keys: {
        etherscan: process.env.ETHERSCAN_KEY,
    },
}
