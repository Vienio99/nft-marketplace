// import { Signer } from "ethers";
// import * as chai from "chai";
import { ethers } from "hardhat";

describe("NFTMarket", function () {
  it("should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(market.address);
    await nft.deployed();

    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    console.log(listingPrice)

    // Matic
    const auctionPrice = ethers.utils.parseEther("100");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(
      nftContractAddress,
      0,
      auctionPrice,
      { value: listingPrice }
    );
    await market.createMarketItem(
      nftContractAddress,
      1,
      auctionPrice,
      { value: listingPrice }
    );

    // Ignore first address which is default and it's used by contract above to create NFT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 0, {
        value: auctionPrice,
      });

    const items = await market.getMarketItems();
    console.log(items);
  });
});
