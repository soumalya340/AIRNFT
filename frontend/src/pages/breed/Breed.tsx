import { useState } from "react";
import Nav from "../../components/navbar/Navbar";
import ChatBot from "../../components/chat/Chatbot";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const BreedPage = () => {
  const [parent1Token, setParent1Token] = useState<number>();
  const [parent2Token, setParent2Token] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    imageUrl: string;
    name: string;
  } | null>(null);
  const { signAndSubmitTransaction, account } = useWallet();

  const handleBreed = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (parent1Token && parent2Token) {
      setLoading(true);
      try {
        const mintResponse = await signAndSubmitTransaction({
          sender: account!.address,
          data: {
            function: `${
              import.meta.env.VITE_CONTRACT_ADDRESS
            }1::airnft::breed`,
            typeArguments: [],
            functionArguments: [parent1Token, parent2Token, ["sample"]],
          },
        });
        console.log("created collection:", mintResponse);
      } catch (error) {
        console.error("Error uploading image or metadata:", error);
      }
      // Simulating async operation with setTimeout
      setTimeout(() => {
        setLoading(false);
        // Replace this with your logic to get image URL and name
        setResult({
          imageUrl:
            "https://cdn.discordapp.com/attachments/1106054726543495239/1220949576350044230/shachindra_pokemon_mewto_but_fire_type_with_wings_d22d9a5d-d158-40bb-b3b5-e5f44eb06d9b.png?ex=6610cce7&is=65fe57e7&hm=bc153e3d537b327bcd482b3bb70a1529ab0d009913f7af5c07eed614e08a01c7&",
          name: "Breeded NFT",
        });
      }, 3000);
    } else {
      alert("Please enter token numbers for both parents.");
    }
  };

  return (
    <>
      <Nav />
      <ChatBot />
      <div className="container mx-auto px-4 flex flex-col items-center gap-12 bg-slate-950 min-h-screen">
        <h1 className="text-4xl text-cyan-300 font-semibold mb-4 mt-8">
          Breed NFTs
        </h1>
        <div className="flex justify-center gap-40">
          <div className="mb-4">
            <label
              htmlFor="parent1"
              className="block text-md font-medium text-gray-100 mb-4"
            >
              Parent 1 Token Number
            </label>
            <input
              id="parent1"
              type="number"
              className="mt-1 p-2 text-teal-300 border-2 first-letter:border-teal-100 rounded-md w-full bg-transparent"
              placeholder="Enter parent 1 token number"
              value={parent1Token || ""}
              onChange={(e) => setParent1Token(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="parent2"
              className="block text-md font-medium text-gray-100 mb-4"
            >
              Parent 2 Token Number
            </label>
            <input
              id="parent2"
              type="number"
              className="mt-1 p-2 text-teal-300 border-2 first-letter:border-teal-100 rounded-md w-full bg-transparent"
              placeholder="Enter parent 2 token number"
              value={parent2Token || ""}
              onChange={(e) => setParent2Token(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-400 hover:bg-transparent hover:border-2 hover:border-sky-400 text-white font-semibold py-2 px-4 rounded-md"
            onClick={(e) => handleBreed(e)}
            disabled={loading}
          >
            {loading ? "Loading........" : "Breed"}
          </button>
        </div>
        {result && (
          <div className="">
            <img
              src={result.imageUrl}
              alt={result.name}
              className="w-72 h72 object-cover rounded-md p-2 border-cyan-400 border-2 rounded-lg"
            />
            <p className="mt-2 text-lg font-semibold">{result.name}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BreedPage;
