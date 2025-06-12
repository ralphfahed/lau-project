import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import SportPage from "./Components/SportPage/SportPage";
import ProjectsPage from "./Components/projectsUser/ProjectsPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // ⬅️ Add this

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
      </Routes>
    </Router>
  );
};

export default App;
