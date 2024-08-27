// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Assembly from "./components/Assembly";
import Settings from "./components/Settings";

const Home: React.FC = () => <div>Home Page</div>;
const Waterjet: React.FC = () => <div>Waterjet Page</div>;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waterjet" element={<Waterjet />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
