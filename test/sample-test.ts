// import { Signer } from "ethers";
// import * as chai from "chai";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("NFTMarket", function () {
  let market: Contract;
  let nft: Contract;
  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    market = await Market.deploy();
    await market.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(market.address);
    await nft.deployed();
  });
  describe("Minting", function () {
    it("the nft after minting goes to empty address", async function () {
      let listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();

      // Matic
      const auctionPrice = ethers.utils.parseEther("100");

      await nft.createToken("https://www.mytokenlocation.com");
      await nft.createToken("https://www.mytokenlocation2.com");

      await market.createMarketItem(nft.address, 0, auctionPrice, {
        value: listingPrice,
      });

      const data = await market.getMarketItems();

      expect(data[0].owner).to.be.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });
  });
  describe("Sales", function () {
    it("should create and execute market sales", async function () {
      const nftContractAddress = nft.address;

      let listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();

      // Matic
      const auctionPrice = ethers.utils.parseEther("100");

      await nft.createToken("https://www.mytokenlocation.com");
      await nft.createToken("https://www.mytokenlocation2.com");

      await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
        value: listingPrice,
      });

      // Ignore first address which is default and it's used by contract above to create NFT
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, buyerAddress] = await ethers.getSigners();

      await market
        .connect(buyerAddress)
        .createMarketSale(nftContractAddress, 0, {
          value: auctionPrice,
        });

      const data = await market.getMarketItems();
      const items = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map(async (i: any) => {
          return i.tokenId.toNumber();
        })
      );
      // const price = "2";
      // const nftPrice = ethers.utils.parseEther(price);
      // const price2 = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(ethers.utils.parseUnits(items[0].toString(), "ether"));
    });
  });
});
