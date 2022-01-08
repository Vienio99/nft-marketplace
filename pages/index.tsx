import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import { ethers } from "ethers";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import axios from "axios";
import Web3Modal from "web3modal";

interface MarketItem {
  // Need to change it but not sure what type should be here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenId: any;
  seller: string;
  owner: string;
  price: string;
  image: string;
  name: string;
  description: string;
}

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.getMarketItems();
    const items = await Promise.all(
      data.map(async (i: MarketItem) => {
        console.log(i);
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const item = {
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          price,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoading(false);
  }

  async function buyNFT(nft: MarketItem) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      { value: price }
    );

    await transaction.wait();
    loadNFTs();
  }

  return (
    <div className="">
      {loading && <Spinner />}
      {!loading && !nfts.length ? <h1>No items in the marketplace.</h1> : nfts}
      <div>
        {nfts.map((nft, i) => {
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={nft.image} alt="NFT image" />
            <p>{nft.name}</p>
            <p>{nft.description}</p>
            <h1>{nft.price}</h1>
            <button onClick={() => buyNFT(nft)}>Buy</button>
          </div>;
        })}
      </div>
    </div>
  );
};

export default Home;
