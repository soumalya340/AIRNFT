import React from "react";
import Navbar from "../../components/navbar/Navbar";

const Mint = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
          Mint
        </button>
      </div>
    </>
  );
};

export default Mint;
