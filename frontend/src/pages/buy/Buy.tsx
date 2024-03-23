import React from "react";
import Nav from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

interface NFT {
  id: string;
  name: string;
  image: string;
  tokenNumber: number;
}

const BuyPage: React.FC = () => {
  const navigate = useNavigate();
  const nfts: NFT[] = [
    { id: "1", image: "/a.png", name: "ok", tokenNumber: 12 },
    { id: "2", image: "/a.png", name: "ok", tokenNumber: 14 },
    { id: "3", image: "/a.png", name: "ok", tokenNumber: 16 },
    { id: "4", image: "/a.png", name: "ok", tokenNumber: 18 },
  ];
  const handleGetToken = (tokenId: string) => {
    navigate("/owned");
    // Your logic to handle getting token for the specific NFT
    console.log(`Getting token for NFT with ID: ${tokenId}`);
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-4 text-center"> Get NFTs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg relative"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover "
              />
              <div className="p-4 ">
                <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                <p className="text-gray-600">Token Number: {nft.tokenNumber}</p>
                <button
                  className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md "
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
