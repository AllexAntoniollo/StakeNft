import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: false, // Ativar no deploy mainnet
        runs: 200,
      },
    },
  },
  networks: {
    bscscan: {
      url: process.env.RPC_URL,
      chainId: parseInt(`${process.env.CHAIN_ID}`),
      accounts: {
        mnemonic: process.env.SECRET,
      },
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};

export default config;
