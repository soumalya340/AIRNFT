import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../../components/navbar/Navbar";
import ChatBot from "../../components/chat/Chatbot";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { BackgroundGradient } from "../../components/ui/background-gradient";

interface Token {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  imageIpfsHash: string;
  metadataIpfsHash: string;
  walletAddress: string;
  price: string;
}

const Nft = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<Token[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8060/token/all/${id}`
        );
        console.log(response.data);
        setNfts(response.data.tokens);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    if (id) {
      fetchNfts();
    }
  }, [id]);

  const handleGetToken = async (tokenId: string) => {
    try {
      const mintResponse = await signAndSubmitTransaction({
        sender: account!.address,
        data: {
          function: `${
            import.meta.env.VITE_CONTRACT_ADDRESS
          }::airnft::get_tokens`,
          typeArguments: [],
          functionArguments: [parseInt(tokenId)],
        },
      });
      console.log("created collection:", mintResponse);

      // Make a POST request to buy the token
      const response = await axios.post(`http://localhost:8060/token/buy`, {
        walletAddress: account!.address, // Assuming account is available from the context
        tokenId: tokenId,
      });
      console.log("Token bought successfully:", response.data);

      // Update the state to mark the token as owned
      const updatedNfts = nfts.map((nft) =>
        nft.id === tokenId ? { ...nft, owned: true } : nft
      );
      setNfts(updatedNfts);
    } catch (error) {
      console.error("Error buying token:", error);
    }
  };

  return (
    <>
      <Nav />
      <ChatBot />

      <div className="container mx-auto px-4 flex flex-col items-center bg-black min-h-screen px-32 ">
        <h1 className="text-4xl font-semibold mb-4 text-center text-white pt-6">
          Tokens
        </h1>
        <button
          className="flex justify-center mt-4 bg-blue-400 px-3 py-2 rounded-lg mb-6"
          onClick={() => {
            navigate({
              pathname: `/mint`,
              search: `?id=${id}`,
            });
          }}
        >
          <Link to={`/mint/${id}`} className="btn btn-primary">
            Mint Token
          </Link>
        </button>

        <div className="flex justify-center items-center h-full flex-wrap">
          {nfts.map((nft) => (
            <div key={nft.id} className="rounded-lg m-5">
              <BackgroundGradient className="rounded-[22px] max-w-auto bg-white dark:bg-zinc-900 p-6">
                <img
                  src={`https://nftstorage.link/ipfs/${nft.imageIpfsHash}`}
                  alt={nft.name}
                  className="w-72 h-72 object-cover rounded-lg"
                />
                <div className="pt-4">
                  <h2 className="text-2xl font-semibold mb-2 text-cyan-500">
                    {nft.name}
                  </h2>
                  <p className="text-teal-300">ID: {nft.id}</p>
                  <p className="text-teal-400">
                    Description: {nft.description}
                  </p>
                </div>
                <button
                  className="bg-sky-500 text-black px-3 py-1 rounded-md mt-2 hover:bg-transparent hover:border-2 hover:border-cyan-300 hover:text-teal-400 "
                  onClick={() => handleGetToken(nft.id)}
                  disabled={nft.owned} // Disable button if token is already owned
                >
                  {nft.owned ? "Owned" : "Get Token"}
                </button>
              </BackgroundGradient>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Nft;
