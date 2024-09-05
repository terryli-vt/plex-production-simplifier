// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Waterjet from "./pages/Waterjet";
import Edgefold from "./pages/Edgefold";
import Assembly from "./pages/Assembly";
import Settings from "./pages/Settings";
import RepairCenter from "./pages/RepairCenter";

const Home: React.FC = () => {
  return (
    <div>
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
          <Link to="/repair">Repair Center</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waterjet" element={<Waterjet />} />
          <Route path="/edgefold" element={<Edgefold />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/repair" element={<RepairCenter />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
