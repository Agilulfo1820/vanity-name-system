# Introduction

The goal of this project is to create a vanity name registering system resistant against frontrunning.
To prevent frontrunning I choosed the [ENS way](https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller).
To obtain this I devided the buy process in 2 parts: first you need to commit to buy that name, this will generate a secret hash for you,
then you pass this hash to the `buy` function which will see if the commitment is valid.

Other features are the dynamic fee, renew, search for a name, withdraw fees.

Before deploying the smart contract please update the `uint256 internal constant SUBSCRIPTION_PERIOD = 5 seconds` to higher timeframe and do this change
also inside the `.env` file. I wanted to put this inside a constructor and manage them all from the `.env` file but didn't made it in time.

# Requirements to run the project
1. NodeJS
2. NPM

# Instructions

### Install dependencies:
```
npm install -g truffle
npm install truffle-hdwallet-provider
npm install truffle-plugin-verify
npm install -g ganache-cli
```

### Configure your project by setting up your .env file and `truffle-config.js`:
1. Copy the file `.env.example` and rename it to `.env`
2. Inside the `MNEMONIC` variable you have to write the seed of your wallet (12 words).
You can also choose to use your `PRIVATE_KEY`, in that case please leave the `MNEMONIC` variable empty.
3. Inside the `INFURA_KEY` variable you have to put the Infura's access pointva to access the network; you can get it by registering [here](https://infura.io/register).
4. Inside the `ETHERSCAN_KEY` variable you have to put the API KEY to verify your smart contract code on Etherscan; you can get this by creating an account [here](https://etherscan.io/register).
5. In the `truffle-config.js` file define the `host` and `port`, which are needed for the development server. To find those you need to run Ganache on your local machine with the command `ganache-cli` and look what is the port and host Ganache is using.

Once you setup those variables you should be ready to develop the smart contract and deploy on your desired EVM network.

### Develop steps
The following are the development steps:
1. Compile contract with `truffle compile`
2. Run Ganache cli on your local machine with `ganache-cli`
3. Test the contract with `truffle test` (**ganache-cli must be running in the background**)
4. Deploy the smart contract with `truffle migrate --reset --network rinkeby` (if you want to use a different network declare it in truffle-config and pass that as argument instead of `rinkeby`)
5. Verify the smart contract code on Etherscan with`truffle run verify VanityNameController --network rinkeby`.  

To interact with the newly deployed smart contract you will need the ABI that you can find in `/build/contracts/` (search the json file with same name as your contract).

# Deployed Addresses
Addresses where the smart contract was deployed
- [STAGING](https://rinkeby.etherscan.io/address/0x78d5F4097BA8761e85F8E7E2981B2Ce5a1c4C89c)