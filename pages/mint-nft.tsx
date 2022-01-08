import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient({ url: "https://ipfs.moralis.io:2053/ipfs/" });

const MintNFT: NextPage = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  async function handleUpload(img) {
    try {
      const added = await client.add(img, {
        progress: (prog: number) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.moralis.io:2053/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div className="flex flex-grow items-center">
      <button className="relative overflow-hidden group h-9 px-5 m-2 text-white rounded-xl transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100">
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="relative">
          <button>Mint</button>
        </span>
      </button>
    </div>
  );
};

export default MintNFT;
