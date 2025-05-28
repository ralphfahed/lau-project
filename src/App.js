import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import SportPage from "./Components/SportPage/SportPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginRegister action="login" />} />
        <Route path="/home/sport" element={<SportPage />} />
      </Routes>
    </Router>
  );
};

export default App;
