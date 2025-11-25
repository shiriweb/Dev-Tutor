import React from "react";
import Navbar from "../components/Header/Navbar";
import Hero from "../components/Home/Hero";
import FeaturesSection from "../components/Home/FeaturesSection";
import HowItWorks from "../components/Home/HowItWorks";
import Footer from "../components/Header/Footer";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#CFF6F2] to-[#E0FAFA]">
      <Navbar />
        <Hero />

      <div id="features">
        <FeaturesSection />
      </div>

      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Footer/>
    </div>
  );
};

export default HomePage;
