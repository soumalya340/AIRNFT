import React from "react";
import Navbar from "../../components/navbar/Navbar";

interface NFT {
  id: string;
  name: string;
  image: string;
  tokenNumber: number;
}

const BuyPage: React.FC = () => {
  const nfts: NFT[] = [
    { id: "1", image: "ok", name: "ok", tokenNumber: 12 },
    { id: "2", image: "ok", name: "ok", tokenNumber: 14 },
  ];
  const handleGetToken = (tokenId: string) => {
    // Your logic to handle getting token for the specific NFT
    console.log(`Getting token for NFT with ID: ${tokenId}`);
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
              className="bg-white rounded-lg overflow-hidden shadow-lg relative"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                <p className="text-gray-600">Token Number: {nft.tokenNumber}</p>
                <button
                  className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                  onClick={() => handleGetToken(nft.id)}
                >
                  Get Token
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BuyPage;
