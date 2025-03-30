import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NameInput from "./components/Name";
import SpinWheel from "./components/SpinWheel";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NameInput />} />
        <Route path="/spin-wheel" element={<SpinWheel />} />
      </Routes>
    </Router>
  );
};

export default App;