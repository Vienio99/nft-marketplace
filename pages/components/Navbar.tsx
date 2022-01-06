import type { NextPage } from "next";
import Link from "next/link";
// import Image from "next/image";

const Navbar: NextPage = () => {
  return (
    <nav className="fixed top-0 mb-10 text-gray-700 w-full text-lg border-b-2">
      <div className="container px-4 mx-auto text-center max-w-6-xl">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div>
              <a
                href="#"
                className="flex items-center px-3 py-6 hover:text-gray-900"
              >
                {/* <Image
                  src=""
                  width="35px"
                  alt=""
                /> */}
                <span className="font-bold">Meta Marketplace</span>
              </a>
            </div>
            {/* Links on the left */}
            <div className="flex items-center md:flex space-x-1">
              <div className="px-4 py-6 hover:text-gray-900">
                <Link href="/4444">Buy NFT</Link>
              </div>
              <div className="px-4 py-6 hover:text-gray-900">
                <Link href="/">My NFTs</Link>
              </div>
              <button className="relative overflow-hidden group h-9 px-5 m-2 text-white rounded-xl transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative"><Link href="/">Mint NFT</Link></span>
              </button>
            </div>
          </div>
          {/* User info / Login signup */}
          <div className="flex items-center md:flex space-x-2">
            {/* User info */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
