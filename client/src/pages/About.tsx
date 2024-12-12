import React from "react";

const About: React.FC = () => {
  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p className="text-lg mb-6">
          Welcome to the about page of Plex Simplifier!
        </p>
        <h2 className="text-2xl font-semibold mt-6">Who Am I?</h2>
        <p className="text-lg mt-2">
          My name is Terry, and I am the software developer behind this web
          application. My goal is to create tools that simplify complex
          processes and make them more efficient.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Our Mission</h2>
        <p className="text-lg mt-2">
          This application was developed to assist Daimay US in simplifying the
          recording of production data during the manufacturing process. By
          streamlining these tasks, the application aims to provide better
          visibility into inventory data and enhance operational efficiency.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Copyright Information</h2>
        <p className="text-sm text-gray-600 mt-2">
          © {new Date().getFullYear()} Plex Simplifier. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default About;
