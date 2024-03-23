import React from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeams } from "../ui/background-beams";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    
    
    <div
      className="min-h-screen   bg-center flex justify-center overflow-hidden  "
      
      // style={{
      //   backgroundImage: "url('/bg.jpg')",
      // }}
    >
      <BackgroundBeams />
     
      
      <div className="text-center mt-64 ">
        <h1 className="text-6xl text-white font-bold mb-8">
          Launch your Collection
        </h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              navigate("/launch");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md "
          >
            Launch
          </button>
          <button
            onClick={() => {
              navigate("/collections");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Collection
          </button>
        </div>
      </div>
      
      
      
    </div>
    </> 
  );
};

export default HomePage;
