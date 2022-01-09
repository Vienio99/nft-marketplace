import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { ethers } from "ethers";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import axios from "axios";
import Web3Modal from "web3modal";

interface MarketItem {
  // Need to change it but not sure what type should be here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenId: ethers.BigNumber;
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
    <div className="flex mt-10">
      {loading && !nfts.length && <Spinner />}
      {!loading && !nfts.length && (
        <h1 className="text-center text-xl font-bold text-gray-700 flex-grow">
          No items in the marketplace.
        </h1>
      )}
      {!loading && nfts.length && (
        <div className="grid grid-cols-4 items-center mx-auto gap-6 text-gray-700">
          {nfts.map((nft, i) => (
            <div key={i} className="rounded-md shadow-lg border-2 w-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nft.image}
                alt="NFT image"
                className="object-scale-down h-64 p-5 mx-auto"
              />
              <div className="flex flex-col m-5">
                <h1 className="text-xl font-bold">{nft.name}</h1>
                <p>{nft.description}</p>
                <h1 className="text-xl text-right">{nft.price} Matic</h1>
                <button
                  onClick={() => buyNFT(nft)}
                  className="relative overflow-hidden group h-9 px-5 w-1/2 self-end text-white rounded-xl transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative">
                    <p>Buy</p>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
