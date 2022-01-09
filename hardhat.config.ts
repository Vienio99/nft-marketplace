import "@nomiclabs/hardhat-waffle";
import { HardhatUserConfig } from "hardhat/types";
// import fs from "fs";

// const privateKey = fs.readFileSync(".secret").toString();

// eslint-disable-next-line import/no-anonymous-default-export
const config: HardhatUserConfig =  {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mumbai: {
    //   url: "https://fllulozfvc2j.usemoralis.com:2053/server",
    //   accounts: [privateKey],
    // },
    // mainnet: {},
    // accounts: [privateKey],
  },
  defaultNetwork: "hardhat",
  solidity: "0.8.4",
};

export default config;