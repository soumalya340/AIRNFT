import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../../components/navbar/Navbar";
import ChatBot from "../../components/chat/Chatbot";
import { BackgroundGradient } from "../../components/ui/background-gradient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface NFT {
  id: string;
  name: string;
  imageIpfsHash: string;
  walletAddress: string;
}

const Owner = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { account } = useWallet(); // Replace with actual wallet address

  useEffect(() => {
    // Fetch NFTs from the API
    axios
      .get("http://localhost:8060/token/all")
      .then((response) => {
        // Filter NFTs where walletAddress matches account.address
        console.log(response.data.tokens);
        const filteredNfts = response.data.tokens.filter(
          (nft: any) => nft.walletAddress === account?.address
        );
        setNfts(filteredNfts);
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
      });
  }, [account?.address]);

  const handleBreed = () => {
    // Implement breed logic here
    console.log("Breed button clicked!");
    navigate("/breed");
  };

  return (
    <>
      <Nav />
      <ChatBot />

      <div className="container mx-0 bg-black min-h-screen px-32">
        <h1 className="text-3xl font-semibold mb-4 pb-5 text-white text-center pt-5">
          Your NFTs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 m-5">
          {nfts.map((nft) => (
            <div key={nft.id} className="">
              <BackgroundGradient className="rounded-[22px] max-w-auto p-4 bg-white dark:bg-zinc-900">
                <a href="/nft">
                  <div className="flex justify-center">
                    <img
                      src={`https://nftstorage.link/ipfs/${nft.imageIpfsHash}`}
                      alt={nft.name}
                      className="w-72 h-72 object-cover rounded-lg"
                    />
                  </div>
                </a>
                <div className="pt-4 px-5">
                  <h2 className="text-2xl font-semibold mb-2 text-teal-400">
                    {nft.name}
                  </h2>
                  <p className="text-sky-300">Token Number: {nft.id}</p>
                </div>
              </BackgroundGradient>
            </div>
          ))}
        </div>

        <div className=" flex justify-center mt-10">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleBreed}
          >
            Breed
          </button>
        </div>
      </div>
    </>
  );
};

export default Owner;
