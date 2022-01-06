import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import { ethers } from "ethers";
// import axios from "axios";
// import Web3modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import axios from "axios";

interface MarketItem {
  itemId: bigint;
  nftContract: string;
  tokenId: object;
  seller: string;
  owner: string;
  price: string;
  sold: boolean
}

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(i.price.toString(), "ether");
          const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
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

    loadNFTs();
  }, []);

  return(
    <div className="">
      {loading && <Spinner />}
    </div>
  )

};

export default Home;
