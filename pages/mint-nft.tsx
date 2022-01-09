import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQwQjA5MWI0RmFiMGExMzczOTJlZWZhQTQ4YWIzMzM3RTdGODcxNzYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MTczMDcyOTQ5MywibmFtZSI6Im5mdC1tYXJrZXRwbGFjZS1wb2x5Z29uIn0.wBP4uyyDsynkyE6JciIamzcFbhp7gZO5e5gKoJ6ZBIk";

const client = ipfsHttpClient({
  url: "https://api.nft.storage/upload",
  headers: {
    Authorization: "Bearer " + TOKEN,
  },
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
      const added = await client.add(file, {
        progress: (prog: number) => console.log(`received: ${prog}`),
      });
      const url = `https://api.nft.storage/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
  }

  async function createNFT() {
    if (!name || !price || !description || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl });
  }

  return (
    <div className="flex-grow mx-auto my-10">
      <form
        className="flex flex-col max-w-4xl px-8 pt-6 pb-8 mb-4 bg-gray-200 rounded shadow-md"
        // onSubmit={}
      >
        <h1 className="mb-5 text-2xl font-bold text-center text-gray-700">
          Mint NFT
        </h1>
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
            // {...register("password1")}
          />
          {/* {errors.password1 && (
            <p className="px-3 mt-2 text-xs italic text-red-500">
              {errors.password1.message}
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
            // {...register("img")}
          />
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
