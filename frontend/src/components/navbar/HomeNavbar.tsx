import "./Navbar.css";
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
          <div className="flex flex-1 justify-end  connect-wallet-button-container">
            <WalletSelector />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
