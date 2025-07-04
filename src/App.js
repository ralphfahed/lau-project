import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import SportPage from "./Components/SportPage/SportPage";
import ProjectsPage from "./Components/projectsUser/ProjectsPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // ⬅️ Add this
import Privacy from "./Components/FooterNav/Privacy";
import Terms from "./Components/FooterNav/Terms";
import Contact from "./Components/FooterNav/Contact";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister action="login" />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/sport"
          element={
            <ProtectedRoute>
              <SportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
