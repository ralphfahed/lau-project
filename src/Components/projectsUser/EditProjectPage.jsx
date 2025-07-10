import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditProjectPage.css";
import { FaTrash, FaWrench } from "react-icons/fa";
import { Palette, Type, Image } from "lucide-react";
import imageCompression from "browser-image-compression";

function EditProjectPage() {
  const { id, pageId } = useParams();
  const numericId = Number(id);
  const resolvedPageId = pageId || "defaultPage";
  const storageKey = `EditPageDesign-project-${numericId}-page-${resolvedPageId}`;
  const globalDesignKey = `EditPageDesign-project-${numericId}-global`;
  const pageDesignKey = `EditPageDesign-project-${numericId}-page-${resolvedPageId}`;
  const [applyGlobalHeader, setApplyGlobalHeader] = useState(true);
  const [applyGlobalFooter, setApplyGlobalFooter] = useState(true);

  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [confirmDeletePageId, setConfirmDeletePageId] = useState(null);

  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showHeaderSettings, setShowHeaderSettings] = useState(false);
  const [headerElements, setHeaderElements] = useState([]);
  const [showFooterSettings, setShowFooterSettings] = useState(false);

  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "1rem 2rem",
  });

  const [footerStyle, setFooterStyle] = useState({
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "1rem 2rem",
  });

  const [footerElements, setFooterElements] = useState([]);

  const [userIcon, setUserIcon] = useState(
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400"
  );

  const saveTimeout = useRef(null);

  // Save design data to localStorage
  const saveDesignData = useCallback(() => {
    try {
      const globalData = {
        showHeader,
        headerStyle,
        headerElements,
        userIcon,
        showFooter,
        footerStyle,
        footerElements,
        applyGlobalHeader,
        applyGlobalFooter, // ← save the global enforcement flags
      };

      localStorage.setItem(globalDesignKey, JSON.stringify(globalData));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        console.warn("LocalStorage quota exceeded!");
      } else {
        throw e;
      }
    }
  }, [
    showHeader,
    headerStyle,
    headerElements,
    userIcon,
    showFooter,
    footerStyle,
    footerElements,
    globalDesignKey,
  ]);

  // Load project and pages
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => p.id === numericId); // use numericId here
    if (selectedProject) {
      // Normalize project id to number
      selectedProject.id = Number(selectedProject.id);

      const normalizedPages = (selectedProject.pages || []).map((page) =>
        typeof page === "string"
          ? { id: Date.now() + Math.random(), name: page }
          : page
      );

      setProject(selectedProject);
      setTitle(selectedProject.name);
      setDescription(selectedProject.description);
      setPages(normalizedPages);
    }
  }, [numericId]);

  // Load design data per project/page
  useEffect(() => {
    if (!project) return;

    let designData = null;
    const savedDesign = localStorage.getItem(globalDesignKey);
    if (savedDesign) {
      try {
        designData = JSON.parse(savedDesign);
      } catch (err) {
        console.warn("Failed to parse design data:", err);
      }
    }

    const projectPages = project.pages || [];

    let syncedHeaderElements = [];
    if (
      designData &&
      Array.isArray(designData.headerElements) &&
      designData.headerElements.length === projectPages.length
    ) {
      syncedHeaderElements = designData.headerElements;
    } else {
      syncedHeaderElements = projectPages.map((page) => ({
        id: page.id.toString(),
        pageId: page.id,
        content: page.name || "New Item",
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Inter",
      }));
    }

    let syncedFooterElements = [];
    if (designData && Array.isArray(designData.footerElements)) {
      syncedFooterElements = designData.footerElements;
    }

    setFooterStyle(designData?.footerStyle ?? footerStyle);
    setFooterElements(syncedFooterElements);

    setPages(projectPages);
    setShowHeader(designData?.showHeader ?? true);
    setHeaderStyle(designData?.headerStyle ?? headerStyle);
    setHeaderElements(syncedHeaderElements);
    setUserIcon(designData?.userIcon ?? userIcon);
    setShowFooter(designData?.showFooter ?? true);

    // ✅ ADD THIS HERE
    setApplyGlobalHeader(designData?.applyGlobalHeader ?? true);
    setApplyGlobalFooter(designData?.applyGlobalFooter ?? true);
  }, [project, storageKey]);

  // Clear junk default header elements if detected
  useEffect(() => {
    const saved = localStorage.getItem(globalDesignKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (
        Array.isArray(data.headerElements) &&
        data.headerElements.length === 3 &&
        data.headerElements.every((el) => el.content === "New Item")
      ) {
        localStorage.removeItem(storageKey);
        setHeaderElements([]);
        setFooterElements([]);
        setShowHeader(true);
        setShowFooter(true);
      }
    }
  }, [storageKey]);

  // Navigate back handler
  const handleBackClick = () => {
    navigate("/projects");
  };

  // Save project handler
  const handleSave = () => {
    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    const isDuplicate = storedProjects.some(
      (p) =>
        p.name.toLowerCase() === title.trim().toLowerCase() &&
        p.id !== project.id
    );

    if (isDuplicate) {
      setError("Project title must be unique.");
      return;
    }

    for (const page of pages) {
      if (!page.name.trim()) {
        setError("Page names cannot be empty.");
        return;
      }
    }

    setError("");

    const syncedHeaderElements = pages.map((page) => {
      const existingHeader = headerElements.find((el) => el.pageId === page.id);
      return existingHeader
        ? { ...existingHeader, content: page.name }
        : {
            id: page.id.toString(),
            pageId: page.id,
            content: page.name,
            color: "#ffffff",
            fontSize: 16,
            fontFamily: "Inter",
          };
    });
    setHeaderElements(syncedHeaderElements);

    const updatedProject = {
      ...project,
      name: title.trim(),
      description,
      pages: pages.map((p) => ({ ...p, name: p.name.trim() })),
    };

    const updatedProjects = storedProjects.map((p) =>
      p.id === project.id ? updatedProject : p
    );

    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    // Save design data here after project update
    saveDesignData();

    toast.success("Project updated successfully!", {
      position: "top-center",
      autoClose: 1000,
      onClose: () => navigate("/projects"),
    });
  };

  // Add new page
  const handleAddPage = () => {
    const newPageId = Date.now();

    const newPage = {
      id: newPageId,
      name: "New Page",
      path: `/page-${newPageId}`,
      headerSettings: {},
      footerSettings: {},
      bodySettings: {},
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);

    const newHeaderElement = {
      id: newPageId.toString(),
      pageId: newPageId,
      content: "New Item",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    };
    setHeaderElements((prev) => [...prev, newHeaderElement]);
  };

  // Request delete confirmation
  const handleRequestDeletePage = (index) => {
    setConfirmDeletePageId(pages[index].id);
  };

  // Confirm deletion
  const confirmDeletion = () => {
    if (confirmDeletePageId === null) return;

    const newPages = pages.filter((page) => page.id !== confirmDeletePageId);
    setPages(newPages);
    setConfirmDeletePageId(null);

    setHeaderElements((prev) =>
      prev.filter((el) => el.pageId !== confirmDeletePageId)
    );

    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = storedProjects.map(
      (p) => (p.id === numericId ? { ...p, pages: newPages } : p) // use numericId here
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    toast.success("Page deleted successfully!", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  // Cancel deletion
  const cancelDeletion = () => {
    setConfirmDeletePageId(null);
  };

  const handleUserIconChange = async (file) => {
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.02, // 20KB
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserIcon(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error("Error compressing image");
    }
  };

  // Header element update
  const updateHeaderElement = (headerElementId, field, value) => {
    setHeaderElements((prev) => {
      const updatedHeaderEls = prev.map((el) => {
        if (el.id === headerElementId) {
          const updatedElement = { ...el, [field]: value };

          if (field === "content" && el.pageId) {
            const pageIndex = pages.findIndex((page) => page.id === el.pageId);
            if (pageIndex !== -1) {
              const updatedPages = [...pages];
              updatedPages[pageIndex] = {
                ...updatedPages[pageIndex],
                name: value,
              };
              setPages(updatedPages);
            }
          }

          return updatedElement;
        }
        return el;
      });
      return updatedHeaderEls;
    });
  };

  // Add header element
  const addHeaderElement = () => {
    const newId = Date.now();

    const newPage = {
      id: newId,
      name: "New Item",
      path: `/page-${newId}`,
      headerSettings: {},
      footerSettings: {},
      bodySettings: {},
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);

    const newElement = {
      id: newId.toString(),
      pageId: newId,
      content: "New Item",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    };

    setHeaderElements((prev) => [...prev, newElement]);
  };

  // Remove header element
  const removeHeaderElement = (idToRemove) => {
    const elementToRemove = headerElements.find((el) => el.id === idToRemove);

    setHeaderElements((prev) => prev.filter((el) => el.id !== idToRemove));

    if (elementToRemove && elementToRemove.pageId) {
      const newPages = pages.filter(
        (page) => page.id !== elementToRemove.pageId
      );
      setPages(newPages);
    }
  };

  // Footer element updates
  const updateFooterElement = (id, field, value) => {
    setFooterElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [field]: value } : el))
    );
  };

  const addFooterElement = () => {
    const newFooterItem = {
      id: Date.now().toString(),
      content: "New Footer Item",
      color: "#ffffff",
      fontSize: 14,
      fontFamily: "Inter",
    };

    setFooterElements((prev) => [...prev, newFooterItem]);
  };

  const removeFooterElement = (id) => {
    setFooterElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Page name change handler
  const handlePageNameChange = (index, newName) => {
    const updatedPages = [...pages];
    updatedPages[index] = { ...updatedPages[index], name: newName };
    setPages(updatedPages);

    const page = updatedPages[index];
    setHeaderElements((prev) =>
      prev.map((el) =>
        el.pageId === page.id ? { ...el, content: newName } : el
      )
    );
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <button onClick={handleBackClick} className="back-button">
        ← back
      </button>

      <div className="edit-project-container">
        <h2>Edit {project.name} project</h2>

        {error && <p className="error">{error}</p>}

        <h4>Title :</h4>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
        />

        <h4>Description :</h4>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
        />

        {/* Section Toggles */}
        <div className="section-toggles">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showHeader}
              onChange={() => setShowHeader(!showHeader)}
              className="toggle-checkbox"
            />
            Show Header
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showFooter}
              onChange={() => setShowFooter(!showFooter)}
              className="toggle-checkbox"
            />
            Show Footer
          </label>
        </div>

        {/* Header Section */}
        {showHeader && (
          <section className="section">
            <h3 className="section-title">
              <button
                className="toggle-btn"
                onClick={() => setShowHeaderSettings(!showHeaderSettings)}
                aria-label="Toggle Header Settings"
              >
                {showHeaderSettings ? "−" : "+"}
              </button>
              <Palette className="section-icon" /> Header Style
            </h3>
            {showHeaderSettings && (
              <>
                <div className="header-bg">
                  <label className="color-label">
                    Background Color{" "}
                    <input
                      type="color"
                      value={headerStyle.backgroundColor}
                      onChange={(e) =>
                        setHeaderStyle({
                          ...headerStyle,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="color-input"
                    />
                  </label>
                  <input
                    type="text"
                    value={headerStyle.backgroundColor}
                    onChange={(e) =>
                      setHeaderStyle({
                        ...headerStyle,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="text-input color-text"
                  />
                  <label className="padding-label">
                    Padding{" "}
                    <input
                      type="text"
                      value={headerStyle.padding}
                      onChange={(e) =>
                        setHeaderStyle({
                          ...headerStyle,
                          padding: e.target.value,
                        })
                      }
                      className="text-input padding-input"
                    />
                  </label>
                </div>

                {/* User Icon */}
                <div className="icon-section">
                  <h4 className="icon-title">
                    <Image className="icon" /> Upload Icon Image
                  </h4>
                  <label>
                    User Icon:{" "}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUserIconChange(e.target.files[0])}
                    />
                  </label>
                  {userIcon && (
                    <img
                      src={userIcon}
                      alt="User Icon"
                      style={{
                        margin: "3rem",
                        display: "flex",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                {/* Navigation Items */}
                <div className="nav-section">
                  <h4 className="nav-title">
                    <Type className="icon" /> Navigation Items
                  </h4>
                </div>
                <button onClick={addHeaderElement} className="add-btn">
                  Add Item
                </button>
                {headerElements.map((el) => (
                  <div key={el.id} className="nav-edit-item">
                    <button
                      className="remove-btn"
                      onClick={() => removeHeaderElement(el.id)}
                      aria-label="Remove navigation item"
                    >
                      X
                    </button>
                    <div className="nav-items">
                      <input
                        type="text"
                        value={el.content}
                        onChange={(e) =>
                          updateHeaderElement(el.id, "content", e.target.value)
                        }
                        className="content-input"
                        aria-label="Navigation item content"
                      />

                      <label className="style-label">
                        Color{" "}
                        <input
                          type="color"
                          value={el.color}
                          onChange={(e) =>
                            updateHeaderElement(el.id, "color", e.target.value)
                          }
                          className="color-input"
                        />
                      </label>
                      <label className="style-label">
                        Font Size{" "}
                        <input
                          type="number"
                          min={8}
                          max={72}
                          value={el.fontSize}
                          onChange={(e) =>
                            updateHeaderElement(
                              el.id,
                              "fontSize",
                              parseInt(e.target.value)
                            )
                          }
                          className="number-input"
                        />
                      </label>
                      <label className="style-label">
                        Font Family{" "}
                        <select
                          value={el.fontFamily}
                          onChange={(e) =>
                            updateHeaderElement(
                              el.id,
                              "fontFamily",
                              e.target.value
                            )
                          }
                          className="select-input"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
        )}

        {/* Footer Section */}
        {showFooter && (
          <section className="section">
            <h3 className="section-title">
              <button
                className="toggle-btn"
                onClick={() => setShowFooterSettings(!showFooterSettings)}
                aria-label="Toggle Footer Settings"
              >
                {showFooterSettings ? "−" : "+"}
              </button>
              <Palette className="section-icon" /> Footer Style
            </h3>
            {showFooterSettings && (
              <>
                <div className="footer-bg">
                  <label className="color-label">
                    Background Color{" "}
                    <input
                      type="color"
                      value={footerStyle.backgroundColor}
                      onChange={(e) =>
                        setFooterStyle({
                          ...footerStyle,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="color-input"
                    />
                  </label>
                  <input
                    type="text"
                    value={footerStyle.backgroundColor}
                    onChange={(e) =>
                      setFooterStyle({
                        ...footerStyle,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="text-input color-text"
                  />
                  <label className="padding-label">
                    Padding{" "}
                    <input
                      type="text"
                      value={footerStyle.padding}
                      onChange={(e) =>
                        setFooterStyle({
                          ...footerStyle,
                          padding: e.target.value,
                        })
                      }
                      className="text-input padding-input"
                    />
                  </label>
                </div>

                <button onClick={addFooterElement} className="add-btn">
                  Add Item
                </button>
                {footerElements.map((el) => (
                  <div key={el.id} className="footer-edit-item">
                    <button
                      className="remove-btn"
                      onClick={() => removeFooterElement(el.id)}
                      aria-label="Remove footer item"
                    >
                      X
                    </button>
                    <div className="nav-items">
                      <input
                        type="text"
                        value={el.content}
                        onChange={(e) =>
                          updateFooterElement(el.id, "content", e.target.value)
                        }
                        className="content-input"
                        aria-label="Footer item content"
                      />

                      <label className="style-label">
                        Color{" "}
                        <input
                          type="color"
                          value={el.color}
                          onChange={(e) =>
                            updateFooterElement(el.id, "color", e.target.value)
                          }
                          className="color-input"
                        />
                      </label>
                      <label className="style-label">
                        Font Size{" "}
                        <input
                          type="number"
                          min={8}
                          max={72}
                          value={el.fontSize}
                          onChange={(e) =>
                            updateFooterElement(
                              el.id,
                              "fontSize",
                              parseInt(e.target.value)
                            )
                          }
                          className="number-input"
                        />
                      </label>
                      <label className="style-label">
                        Font Family{" "}
                        <select
                          value={el.fontFamily}
                          onChange={(e) =>
                            updateFooterElement(
                              el.id,
                              "fontFamily",
                              e.target.value
                            )
                          }
                          className="select-input"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
        )}

        {/* Pages list */}
        <h4>Pages:</h4>
        <div className="add-btn-page">
          <button onClick={handleAddPage}>Add Page</button>
        </div>
        <ul className="pages-list">
          {pages.map((page, i) => (
            <li key={page.id} className="page-item">
              <input
                type="text"
                value={page.name}
                onChange={(e) => handlePageNameChange(i, e.target.value)}
                placeholder={`Page ${i + 1} Name`}
              />
              <div className="page-buttons">
                <button
                  className="edit-content-button"
                  onClick={() =>
                    navigate(`/projects/${project.id}/page/${page.id}/edit`)
                  }
                  title="Edit Page Content"
                >
                  <FaWrench />
                </button>
                <button
                  onClick={() => handleRequestDeletePage(i)}
                  title="Delete Page"
                  className="delete-icon-button"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <br />
        <div className="add-btn-page">
          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      {/* Modal for confirming page deletion */}
      {confirmDeletePageId !== null && (
        <div className="delete-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this page?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelDeletion}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDeletion}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footerbar />
      <ToastContainer />
    </div>
  );
}

export default EditProjectPage;
