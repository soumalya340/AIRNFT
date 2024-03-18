import React from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
const Navbar = () => {
  return (
    <>
      <nav className="bg-gray-800">
        <div className="p-4  mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          </div>

          {/* Navigation */}
          <a
            href="/"
            className="text-white text-lg font-semibold flex flex-1 justify-center"
          >
            AirNFT
          </a>

          {/* Login Button */}
          <div className="flex flex-1 justify-end">
            <WalletSelector />
          </div>
        </div>
        <div className=" pb-4 flex justify-center items-cente">
          <ul className="hidden md:flex items-center space-x-4">
            <li>
              <a href="buy" className="text-white hover:text-gray-300">
                Buy
              </a>
            </li>
            <li>
              <a href="mint" className="text-white hover:text-gray-300">
                Mint
              </a>
            </li>
            <li>
              <a href="owned" className="text-white hover:text-gray-300">
                Owned
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
