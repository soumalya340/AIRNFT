import React from "react";
import Navbar from "../../components/navbar/Navbar";
import HomePage from "../../components/home/Home";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <HomePage />
    </div>
  );
};

export default Homepage;
