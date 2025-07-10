import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PageEditorPage";

function ProjectPreview() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [designData, setDesignData] = useState({}); // per page designs
  const [globalDesign, setGlobalDesign] = useState(null); // global header/footer settings
  const [selectedPageId, setSelectedPageId] = useState(null);

  useEffect(() => {
    // Load all projects from localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    console.log("All Projects:", allProjects);

    // Find current project by projectId
    const selectedProject = allProjects.find(
      (p) => String(p.id) === String(projectId)
    );
    console.log("Selected Project:", selectedProject);

    setProject(selectedProject);
    if (!selectedProject) return;

    // Select first page by default
    if (selectedProject.pages.length > 0) {
      setSelectedPageId(selectedProject.pages[0].id);
    }

    // Load design data per page from localStorage
    const loadedDesignData = {};
    selectedProject.pages.forEach((page) => {
      const key = `EditPageDesign-project-${selectedProject.id}-page-${page.id}`;
      const saved = localStorage.getItem(key);
      console.log(`Design for page ${page.id} (key: ${key}):`, saved);

      if (saved) {
        try {
          loadedDesignData[page.id] = JSON.parse(saved);
        } catch (e) {
          console.warn(`Failed to parse design for page ${page.name}`, e);
        }
      }
    });
    setDesignData(loadedDesignData);

    // Load global design data for header/footer from localStorage
    const globalKey = `EditPageDesign-project-${selectedProject.id}-global`;
    const savedGlobal = localStorage.getItem(globalKey);
    console.log(`Global design data (key: ${globalKey}):`, savedGlobal);

    if (savedGlobal) {
      try {
        setGlobalDesign(JSON.parse(savedGlobal));
      } catch (e) {
        console.warn("Failed to parse global design data", e);
      }
    }
  }, [projectId]);

  if (!project) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Project not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!selectedPageId) {
    return <div style={{ padding: "1rem" }}>Loading pages...</div>;
  }

  const selectedPage = project.pages.find((p) => p.id === selectedPageId);
  const design = designData[selectedPageId] || {};

  // Use globalDesign or fallback default values
  const showHeader = globalDesign?.showHeader ?? true;
  const showFooter = globalDesign?.showFooter ?? true;

  return (
    <div>
      {/* Project Header with page navigation */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          backgroundColor: "#1e40af",
          color: "white",
          padding: "1rem",
          fontWeight: "bold",
          flexWrap: "wrap",
        }}
      >
        <div>{project.name}</div>
        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {project.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              style={{
                background: "transparent",
                border: "none",
                color: page.id === selectedPageId ? "#ffdd57" : "white",
                cursor: "pointer",
                fontWeight: page.id === selectedPageId ? "bold" : "normal",
                textDecoration:
                  page.id === selectedPageId ? "underline" : "none",
                padding: "0.25rem 0.5rem",
              }}
            >
              {page.name}
            </button>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main style={{ padding: "1rem" }}>
        <h2>{selectedPage?.name || "Page not found"}</h2>

        {/* Header Preview */}
        {showHeader && (
          <header
            style={{
              backgroundColor:
                globalDesign?.headerStyle?.backgroundColor || "#1e40af",
              color: globalDesign?.headerStyle?.color || "#fff",
              padding: globalDesign?.headerStyle?.padding || "1rem 2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              borderRadius: "4px",
            }}
          >
            {globalDesign?.userIcon && (
              <img
                src={globalDesign.userIcon}
                alt="User Icon"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            {globalDesign?.headerElements?.map((el) => (
              <span
                key={el.id}
                style={{
                  color: el.color,
                  fontSize: `${el.fontSize}px`,
                  fontFamily: el.fontFamily,
                }}
              >
                {el.content}
              </span>
            ))}
          </header>
        )}

        {/* Body Preview */}
        {design.showBody && design.bodyCards?.length > 0 ? (
          <section style={{ marginTop: "1rem" }}>
            {design.bodyCards.map((card) => (
              <div
                key={card.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: "1rem",
                  marginBottom: "1rem",
                  maxWidth: 300,
                }}
              >
                <img
                  src={
                    card.image ||
                    "https://st2.depositphotos.com/2586633/46477/v/450/depositphotos_464771766-stock-illustration-no-photo-or-blank-image.jpg"
                  }
                  alt="Card"
                  style={{ width: "100%", borderRadius: 4 }}
                />
                <p
                  style={{
                    color: card.priceColor,
                    fontSize: `${card.priceFontSize}px`,
                    fontFamily: card.priceFontFamily,
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {card.price}
                </p>
                <p
                  style={{
                    color: card.infoColor,
                    fontSize: `${card.infoFontSize}px`,
                    fontFamily: card.infoFontFamily,
                    margin: 0,
                  }}
                >
                  {card.info}
                </p>
              </div>
            ))}
          </section>
        ) : (
          <p>No body content to show</p>
        )}

        {/* Footer Preview */}
        {showFooter && (
          <footer
            style={{
              backgroundColor:
                globalDesign?.footerStyle?.backgroundColor || "#1e40af",
              color: globalDesign?.footerStyle?.color || "#fff",
              padding: globalDesign?.footerStyle?.padding || "1rem 2rem",
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              borderRadius: "4px",
            }}
          >
            {globalDesign?.footerElements?.map((el) => (
              <span
                key={el.id}
                style={{
                  color: el.color,
                  fontSize: `${el.fontSize}px`,
                  fontFamily: el.fontFamily,
                  marginRight: "1rem",
                }}
              >
                {el.content}
              </span>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}

export default ProjectPreview;
