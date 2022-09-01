require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"})

const MUMBAI_API = process.env.MUMBAI_API_KEY
// const RINKEBY_API = process.env.RINKEBY_API_KEY
const KEY = process.env.PRIVATE_KEY
const RINKEBY_ALCHEMY = process.env.RINKEBY_ALCHEMY_KEY
const MUMBAI_ALCHEMY = process.env.MUMBAI_ALCHEMY_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: RINKEBY_ALCHEMY,
      accounts: [KEY]
    },
    mumbai: {
      url: MUMBAI_ALCHEMY,
      accounts: [KEY]
    }
  },
  // etherscan: {
  //   apiKey: RINKEBY_API
  // },
  etherscan: {
    apiKey: {
      polygonMumbai: MUMBAI_API
    }
  }
};
