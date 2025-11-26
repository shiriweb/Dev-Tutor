import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white py-6 px-4 mt-5">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-2">
        <div className="font-bold text-xl">
          Dev<span className="text-red-500">Tutor</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 font-bold">
          <a href="/" className="hover:text-red-500">
            Home
          </a>
          <a href="#features" className="hover:text-red-500">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-red-500">
            How It Works
          </a>
          <Link to="/dashboard" className="text-white hover:text-red-500">
            Dashboard
          </Link>
        </div>

        {/* Social Icons (optional) */}
        <div className="flex gap-4 text-xl">
          {/* <FaFacebook className="hover:text-red-500" />
          <FaTwitter className="hover:text-red-500" />
          <FaLinkedin className="hover:text-red-500" /> */}
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-300 text-center">
          © 2025 DevTutor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
