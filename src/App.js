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
import CreateNewProject from "./Components/projectsUser/CreateNewProject";
import EditProjectPage from "./Components/projectsUser/EditProjectPage";
import PageEditorPage from "./Components/projectsUser/PageEditorPage";
import ProjectPreview from "./Components/projectsUser/ProjectPreview";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister action="" />} />

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
          path="/projects/:projectId/page/:pageId/edit"
          element={<PageEditorPage />}
        />

        <Route path="/editor/:pageId" element={<PageEditorPage />} />

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

        <Route path="/create-project" element={<CreateNewProject />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route
          path="/projects/:projectId/preview"
          element={<ProjectPreview />}
        />
      </Routes>
    </Router>
  );
};

export default App;
