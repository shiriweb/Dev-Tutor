import React from "react";
import Navbar from "../components/Header/Navbar";
import Hero from "../components/Home/Hero";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#CFF6F2] to-[#E0FAFA]">
      <Navbar />
      <Hero />
    </div>
  );
};

export default HomePage;
