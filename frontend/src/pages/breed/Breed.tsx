import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";

const BreedPage: React.FC = () => {
  const [parent1Token, setParent1Token] = useState<number>();
  const [parent2Token, setParent2Token] = useState<number>();

  const handleBreed = () => {
    // if (parent1Token && parent2Token) {
    //   onBreed(parent1Token, parent2Token);
    // } else {
    //   alert("Please enter token numbers for both parents.");
    // }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 flex flex-col items-center gap-12">
        <h1 className="text-3xl font-semibold mb-4 mt-8">Breed NFTs</h1>
        <div className="flex justify-center gap-40">
          <div className="mb-4">
            <label
              htmlFor="parent1"
              className="block text-sm font-medium text-gray-700"
            >
              Parent 1 Token Number
            </label>
            <input
              id="parent1"
              type="number"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter parent 1 token number"
              value={parent1Token}
              onChange={(e) => setParent1Token(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="parent2"
              className="block text-sm font-medium text-gray-700"
            >
              Parent 2 Token Number
            </label>
            <input
              id="parent2"
              type="number"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter parent 2 token number"
              value={parent2Token}
              onChange={(e) => setParent2Token(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-center">
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

export default BreedPage;
