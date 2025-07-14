import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateNewProject.css";

const CreateProjectPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to find the smallest available project ID
  const getNextAvailableProjectId = (projects) => {
    const usedIds = projects.map((p) => p.id).sort((a, b) => a - b);
    let nextId = 1;
    for (const id of usedIds) {
      if (id === nextId) {
        nextId++;
      } else {
        break;
      }
    }
    return nextId;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    const existingProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Check for duplicate project title (case-insensitive)
    const isDuplicate = existingProjects.some(
      (p) => p.name.toLowerCase() === title.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("Project title must be unique. This title already exists.");
      return;
    }

    const newId = getNextAvailableProjectId(existingProjects);

    const newProject = {
      id: newId,
      name: title.trim(),
      description: description.trim(),
      pages: [],
    };

    const updatedProjects = [...existingProjects, newProject];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    toast.success("Project created successfully!", {
      position: "top-center",
      autoClose: 1000,
      onClose: () => navigate("/projects"),
    });

    setError(""); // Clear any error after successful creation
  };

  const handleBackClick = () => {
    navigate("/projects");
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <button onClick={handleBackClick} className="back-button">
        ← back
      </button>
      <div className="create-project-container">
        {/* <div className="text-center mb-8">
          <img
            src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Project Creation"
            className=""
          />
        </div> */}

        <h1 className="">Create New Project</h1>

        <form onSubmit={handleSubmit} className="create-project-form">
          <div className="form-group">
            <label htmlFor="title">
              Project Title <span>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
            {error && <p className="error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional project description"
            />
          </div>

          <button type="submit">Create Project</button>
        </form>
      </div>
      <Footerbar />
      <ToastContainer />
    </div>
  );
};

export default CreateProjectPage;
