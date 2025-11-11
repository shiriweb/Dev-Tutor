import React from "react";
import Navbar from "../components/Header/Navbar";
import Hero from "../components/Home/Hero";
import FeaturesSection from "../components/Home/FeaturesSection";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#CFF6F2] to-[#E0FAFA]">
      <Navbar />
      <Hero />
      <FeaturesSection/>
    </div>
  );
};

export default HomePage;
