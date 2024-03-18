import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

interface NFT {
  id: string;
  name: string;
  image: string;
  tokenNumber: number;
}

const Owner = () => {
  const navigate = useNavigate();
  const nfts: NFT[] = [
    { id: "1", image: "ok", name: "ok", tokenNumber: 12 },
    { id: "2", image: "ok", name: "ok", tokenNumber: 14 },
  ];

  const handleBreed = () => {
    // Implement breed logic here
    console.log("Breed button clicked!");
    navigate("/breed");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-4">Your NFTs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                <p className="text-gray-600">Token Number: {nft.tokenNumber}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center mt-10">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleBreed}
          >
            Breed Two Tokens
          </button>
        </div>
      </div>
    </>
  );
};

export default Owner;
