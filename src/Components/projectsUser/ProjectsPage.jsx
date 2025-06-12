import React from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "./ProjectsPage.css";
import Navbar from "../layout/Navbar"; // adjust path if needed
import Footerbar from "../layout/Footerbar";

function ProjectsPage({ userName }) {
  const navigate = useNavigate(); // initialize navigate

  const projects = [
    { id: 1, name: "Project Alpha", status: "In Progress" },
    { id: 2, name: "Project Beta", status: "Completed" },
    { id: 3, name: "Project Gamma", status: "Pending" },
  ];

  const handleBackClick = () => {
    navigate("/home"); // navigate to home page, change if your home route is different
  };

  return (
    <div className="page-wrapper">
      <div className="projects-container">
        <Navbar />

        <button onClick={handleBackClick} className="back-button">
          ← Home
        </button>
        <h2 className="projects-title">My Projects</h2>
        <table className="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(({ id, name, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footerbar />
    </div>
  );
}

export default ProjectsPage;
