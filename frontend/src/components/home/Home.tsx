import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')", // Replace 'background-image.jpg' with your image path
      }}
    >
      <div className="text-center mt-64">
        <h1 className="text-6xl text-black font-bold mb-8">
          Launch your Collection
        </h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              navigate("/launch");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Launch
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
