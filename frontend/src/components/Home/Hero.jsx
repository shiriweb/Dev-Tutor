import React, { useEffect, useState } from "react";
import hero from "../../assets/hero.png";
const Hero = () => {
  const greetingText = "Hello! I am Dev-Tutor. How can I help you?";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    let interval = setInterval(() => {
      setText(greetingText.slice(0, i + 1));
      i++;
      if (i > greetingText.length) {
        i = 0;
        setText("");
      }
    }, 120);
    return (()=>clearInterval(interval))
  }, []);

  return (
    <div className="w-full h-90 flex flex-col-reverse md:flex-row lg:flex-row justify-between  bg-gradient-to-b from-[#CFF6F2] to-[#E0FAFA] p-2 ">
      <div className="flex-1 p-2 lg:mt-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-900 text-center md:text-left md:ml-14 lg:ml-14">
          Transforming <span className="text-red-500"> Knowledge </span>into
          <span className="text-red-500"> Mastery</span> Through AI-Driven
          Innovation
        </h1>

        <p className="text-base text-gray-700 mt-3 text-center sm:text-center md:text-left md:ml-14 lg:ml-14">
          Engage with AI, explore concepts interactively, generate quizzes, and
          track your learning progress all in one smart and intuitive platform
          designed to make learning efficient and meaningful.
        </p>

        <button className="bg-red-500  lg:ml-14 md:ml-14 sm:mx-auto mt-4 p-2 w-32 rounded-xl text-white font-bold hover:bg-red-600 sm:block ">
          Get Started
        </button>
      </div>

      <div className=" relative flex justify-center mr-8 ">
        <p className="absolute text-sm bg-white text-teal-900 border max-w-md border-[#f5f5f5] shadow-xl p-3 rounded-xl lg:-left-5   ">
          {text}
        </p>

        <div className="absolute w-6 h-6 bg-white border border-[#f5f5f5] rounded-full shadow-md z-20  lg:mr-40 lg:mt-14 md:mt-14 md:mr-40 sm:mr-20 sm:mt-14"></div>
        <div className="absolute w-5 h-5 bg-white border border-[#f5f5f5] rounded-full mt-20 ml-20 shadow-md z-20 lg:mr-52 lg:mt-20 md:mt-20 md:mr-52 sm:mr-32 sm:mt-20"></div>
        <div className="absolute w-4 h-4 hidden md:block lg:block bg-white border border-[#f5f5f5] rounded-full mt-24 ml-24 shadow-md z-20 lg:mr-48 lg:mt-24 md:mt-24 md:mr-48"></div>
        <img
          src={hero}
          className="sm:flex-cols  max-h-96 sm:w-full sm:max-w-xs md:max-w-md lg:max-w-lg mt-lg:mt-6 sm:mt-10  "
        />
      </div>
    </div>
  );
};

export default Hero;
