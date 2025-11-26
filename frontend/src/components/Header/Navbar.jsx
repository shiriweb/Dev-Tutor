import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="py-3 px-4 sm:px-10 sticky top-0 z-50 backdrop-blur-md bg-white/30">
      <div className="flex items-center justify-between bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 px-3 py-2 rounded-full">
        <div className="text-2xl font-bold ml-5">
          <span className="text-white">Dev</span>
          <span className="text-red-500">Tutor</span>
        </div>

        <div className="hidden lg:flex space-x-8 text-white font-medium">
          <Link to="/" className="hover:text-red-500">
            Home
          </Link>
          <a href="#features" className="hover:text-red-500">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-red-500">
            How It Works
          </a>
          <Link to="/dashboard" className="hover:text-red-500">
            Dashboard
          </Link>
        </div>

        <div className="hidden lg:flex space-x-3 font-semibold">
          {/* <Link to="/signin">
            <button className="text-white hover:text-red-500 mt-1 ">
              Sign In
            </button>
          </Link> */}
          <Link to="/signin">
            <button className="bg-red-500 text-white border border-red-500 px-3 py-1  mr-5 rounded-full hover:bg-red-600">
              Sign Up
            </button>
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl"
          >
            {isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden flex flex-col mt-2 space-y-2 bg-teal-800/80 rounded-xl p-4 text-white font-medium">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-500 py-2 px-3 rounded hover:bg-teal-700 transition"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-500 py-2 px-3 rounded hover:bg-teal-700 transition"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="hover:text-red-500 py-2 px-3 rounded hover:bg-teal-700 transition"
          >
            How It Works
          </a>
          <Link to="/dashboard" className="hover:text-red-500">
            Dashboard
          </Link>

          <Link to="/signin">
            <button className="text-white hover:text-red-500 py-2 px-3 rounded hover:bg-teal-700 transition text-left">
              Sign In
            </button>
          </Link>

          <Link to="/signin">
            <button className="text-white hover:text-red-500 py-2 px-3 rounded hover:bg-teal-700 transition text-left">
              Sign Up{" "}
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
