import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const client = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",

});

const MintNFT: NextPage = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  async function handleUpload(e) {
    try {
      const file = e.target.files[0];
      const added = await client.add(file, {progress: (prog) => console.log(`received: ${prog}`)});
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
  }

  async function createNFT(e) {
    e.preventDefault();
    if (!name || !price || !description || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log("Error uploading the file: " + error);
    }
  }

  async function createSale(url: string) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const transaction = await contract.createToken(url);
    const tx = await transaction.wait();

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const nftPrice = ethers.utils.parseEther(price);

    const contract2 = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    let listingPrice = await contract2.getListingPrice();
    listingPrice = listingPrice.toString();

    const transaction2 = await contract2.createMarketItem(
      nftAddress,
      tokenId,
      nftPrice,
      { value: listingPrice }
    );

    await transaction2.wait();
    router.push("/");
  }

  return (
    <div className="flex-grow mx-auto my-10">
      <form
        className="flex flex-col max-w-4xl px-8 pt-6 pb-8 mb-4 bg-gray-200 rounded shadow-md"
        onSubmit={(e) => createNFT(e)}
      >
        <div className="flex flex-col mb-5">
          <h1 className="text-2xl font-bold text-center text-gray-700">
            Mint NFT
          </h1>
          <p className="text-gray-700">
            Create NFT and put it up for sale on the marketplace
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="name"
          >
            Name *
          </label>
          <input
            className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none"
            id="name"
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            // {...register("username")}
          />
          {/* {errors.username && (
            <p className="px-3 mt-2 text-xs italic text-red-500">
              {errors.username.message}
            </p>
          )} */}
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none border-red"
            id="description"
            rows={3}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            // {...register("password1")}
          />
          {/* {errors.password1 && (
            <p className="px-3 mt-2 text-xs italic text-red-500">
              {errors.password1.message}
            </p>
          )} */}
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="price"
          >
            Price in Matic *
          </label>
          <input
            className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none"
            id="price"
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            // {...register("username")}
          />
          {/* {errors.username && (
            <p className="px-3 mt-2 text-xs italic text-red-500">
              {errors.username.message}
            </p>
          )} */}
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="img"
          >
            Image *
          </label>
          <input
            className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none border-red"
            id="img"
            type="file"
            onChange={(e) => handleUpload(e)}
            // {...register("img")}
          />
          {fileUrl && <img src={fileUrl} alt="Uploaded file" className="mt-4 rounded" width="200"/>}
        </div>
        <div className="flex items-center justify-between">
          <button className="relative overflow-hidden group h-9 px-5 m-2 text-white rounded-xl transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">
              <button type="submit">Mint</button>
            </span>
          </button>
        </div>
      </form>
    </div>
    // <div className="flex flex-grow items-center">
    //   <button className="relative overflow-hidden group h-9 px-5 m-2 text-white rounded-xl transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100">
    //     <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
    //     <span className="relative">
    //       <button>Mint</button>
    //     </span>
    //   </button>
    // </div>
  );
};

export default MintNFT;
