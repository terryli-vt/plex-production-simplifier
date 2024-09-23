import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="p-6 min-h-80 bg-white flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to <span className="text-indigo-600">Plex Simplifier</span>
        </h1>
        <p className="mb-4 text-md font-medium text-gray-600 dark:text-gray-400">
          Please select a workcenter or go to settings.
        </p>
        <ul className="space-y-3 text-lg">
          <li>
            <Link
              to="/waterjet"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
            >
              Waterjet
            </Link>
          </li>
          <li>
            <Link
              to="/edgefold"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
            >
              Edgefold
            </Link>
          </li>
          <li>
            <Link
              to="/assembly"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
            >
              Assembly
            </Link>
          </li>
          <li>
            <Link
              to="/pack"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
            >
              Pack
            </Link>
          </li>
          <li>
            <Link
              to="/repair"
              className="block py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300"
            >
              Repair Center
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-300"
            >
              Settings
            </Link>
          </li>
        </ul>

        <p className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-200">
          Questions? Please contact the software developer Terry Li.
        </p>
        <p>
          Email:{" "}
          <a
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href="mailto:Tianyu.Li@daimayus.com"
          >
            Tianyu.Li@daimayus.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
