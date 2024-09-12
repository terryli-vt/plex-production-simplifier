import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="p-3">
      <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Welcome to Plex Simplifier. Please select a workcenter, or go to
        settings.
      </h1>
      <ul className="max-w-md space-y-1 text-blue-500 list-disc list-inside dark:text-gray-400">
        <li>
          <Link to="/waterjet">Waterjet</Link>
        </li>
        <li>
          <Link to="/edgefold">Edgefold</Link>
        </li>
        <li>
          <Link to="/assembly">Assembly</Link>
        </li>
        <li>
          <Link to="/pack">Pack</Link>
        </li>
        <li>
          <Link to="/repair">Repair Center</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      <p className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
        Please contact the software developer Terry Li if you have any
        questions.
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
  );
};

export default Home;
