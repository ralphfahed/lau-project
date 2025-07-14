import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectsPage.css";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

function ProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

  const clearProjectDesignData = (projectId) => {
    const prefix = `EditPageDesign-project-${projectId}-`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
        i--;
      }
    }
  };

  // const handleBackClick = () => {
  //   navigate("/home");
  // };

  const deleteProject = (id) => {
    const projectToDelete = projects.find((project) => project.id === id);
    if (projectToDelete) {
      clearProjectDesignData(projectToDelete.id);
    }

    const updatedProjects = projects.filter((project) => project.id !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    toast.success("Project deleted successfully!", {
      position: "top-center",
      autoClose: 1000,
    });
    setConfirmDeleteId(null);
  };

  const filteredAndSortedProjects = [...projects]
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <div className="page-wrapper">
      <div className="projects-container">
        <Navbar />
        <div className="button-row">
          {/* <button onClick={handleBackClick} className="back-button">
            ← Home
          </button> */}
          <button
            onClick={() => navigate("/create-project")}
            className="add-project-button"
          >
            + Add New Project
          </button>
        </div>

        <h2 className="projects-title">My Projects</h2>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="projects-table">
          <thead>
            <tr>
              {/* Removed <th>ID</th> */}
              <th>Project Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProjects.length > 0 ? (
              filteredAndSortedProjects.map(({ id, name, description }) => (
                <tr key={id}>
                  {/* Removed <td>{id}</td> */}
                  <td>{name}</td>
                  <td>{description || "No description"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button"
                        onClick={() => navigate(`/projects/${id}/preview`)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-button"
                        onClick={() => navigate(`/projects/${id}/edit`)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => setConfirmDeleteId(id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDeleteId !== null && (
        <div className="delete-popup">
          <p className="delete-text">
            Are you sure you want to delete this project?
          </p>
          <div className="delete-buttons">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteProject(confirmDeleteId)}
              className="confirm-button"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <Footerbar />
      <ToastContainer />
    </div>
  );
}

export default ProjectsPage;
