import "@nomiclabs/hardhat-waffle";
import fs from "fs";

const privateKey = fs.readFileSync(".secret").toString();

export default {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://fllulozfvc2j.usemoralis.com:2053/server",
      accounts: [privateKey],
    },
    mainnet: {},
    accounts: [privateKey],
  },
  solidity: "0.8.4",
};
