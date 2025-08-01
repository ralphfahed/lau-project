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

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userStorageKey = `projects-${loggedInUser}`;

  useEffect(() => {
    const storedProjects =
      JSON.parse(localStorage.getItem(userStorageKey)) || [];
    setProjects(storedProjects);
  }, [userStorageKey]);

  const deleteProjectAndDesignData = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    localStorage.setItem(userStorageKey, JSON.stringify(updatedProjects));
    setProjects(updatedProjects);

    // Remove all design data related to this project
    const prefix = `EditPageDesign-project-${id}-`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

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
          <div className="projects-title">My Projects</div>
          <button
            onClick={() => navigate("/create-project")}
            className="add-project-button"
          >
            + Add New Project
          </button>
        </div>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProjects.length > 0 ? (
              filteredAndSortedProjects.map(({ id, name, description }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{description || "No description"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button"
                        onClick={() =>
                          window.open(
                            `${window.location.origin}/projects/${id}/preview`,
                            "_blank"
                          )
                        }
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
              onClick={() => deleteProjectAndDesignData(confirmDeleteId)}
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
