require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
// ...existing code...
const { vars } = require("hardhat/config");

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};