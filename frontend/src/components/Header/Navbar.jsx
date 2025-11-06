import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="py-3 px-10">
      <div className="flex items-center rounded-full bg-teal-900 px-3 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="ml-4 text-2xl font-bold">
            <span className="text-white">Dev</span>
            <span className="text-[#C68642]">Tutor</span>
          </span>
        </div>

        {/* Nav Links (desktop) */}
        <div className="hidden lg:flex ml-48 space-x-8 text-white font-medium">
          <Link to="/" className="hover:text-[#C68642]">
            Home
          </Link>
          <Link to="/features" className="hover:text-[#C68642]">
            Features
          </Link>
          <Link to="/about" className="hover:text-[#C68642]">
            About
          </Link>
          <Link to="/dashboard" className="hover:text-[#C68642]">
            Dashboard
          </Link>
        </div>

        <div className="flex space-x-4 ml-auto mr-2 font-semibold lg:flex sm:ml-auto sm:gap-x-2)">
          <button className="text-white hover:bg-white hover:text-teal-700">
            Log In
          </button>
          <button className="bg-[#C68642] border border-black px-3 py-1 rounded-full hover:text-[#D2A679] hover:bg-white">
            Sign Up
          </button>
        </div>

        {/* Other device layout */}
        <div className="lg:hidden ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl"
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-2 space-y-2 flex flex-col text-white font-medium">
          <Link to="/" className="hover:text-[#00C3D0]">
            Home
          </Link>
          <Link to="/features" className="hover:text-[#00C3D0]">
            Features
          </Link>
          <Link to="/about" className="hover:text-[#00C3D0]">
            About
          </Link>
          <Link to="/dashboard" className="hover:text-[#00C3D0]">
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
