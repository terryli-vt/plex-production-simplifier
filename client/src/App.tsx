// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Waterjet from "./pages/Waterjet";
import Edgefold from "./pages/Edgefold";
import Assembly from "./pages/Assembly";
import Pack from "./pages/Pack";
import Settings from "./pages/Settings";
import RepairCenter from "./pages/RepairCenter";
import Label from "./pages/Label";
import BOM from "./pages/BOM";
import About from "./pages/About";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="w-full mx-auto p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waterjet" element={<Waterjet />} />
          <Route path="/edgefold" element={<Edgefold />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/pack" element={<Pack />} />
          <Route path="/repair" element={<RepairCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/label" element={<Label />} />
          <Route path="/bom" element={<BOM />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
