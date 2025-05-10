require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",  // Updated from 0.8.19 to match OpenZeppelin
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    }
  }
};