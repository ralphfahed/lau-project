import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PageEditorPage";

function ProjectPreview() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [designData, setDesignData] = useState({});
  const [globalDesign, setGlobalDesign] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = allProjects.find(
      (p) => String(p.id) === String(projectId)
    );
    setProject(selectedProject);

    if (!selectedProject) return;

    if (selectedProject.pages.length > 0) {
      setSelectedPageId(selectedProject.pages[0].id);
    }

    const loadedDesignData = {};
    selectedProject.pages.forEach((page) => {
      const key = `EditPageDesign-project-${selectedProject.id}-page-${page.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          loadedDesignData[page.id] = JSON.parse(saved);
        } catch (e) {
          console.warn(`Failed to parse design for page ${page.name}`, e);
        }
      }
    });
    setDesignData(loadedDesignData);

    const globalKey = `EditPageDesign-project-${selectedProject.id}-global`;
    const savedGlobal = localStorage.getItem(globalKey);
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

  if (!project.pages || project.pages.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>No pages created yet</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!selectedPageId) {
    return <div style={{ padding: "1rem" }}>Loading pages...</div>;
  }

  const selectedPage = project.pages.find((p) => p.id === selectedPageId);
  const design = designData[selectedPageId] || {};
  const showHeader = globalDesign?.showHeader ?? true;
  const showFooter = globalDesign?.showFooter ?? true;

  const renderElements = (elements) =>
    elements.map((el) => {
      const matchedPage = project.pages.find(
        (page) => page.name === el.content
      );
      if (matchedPage) {
        return (
          <button
            key={el.id}
            onClick={() => setSelectedPageId(matchedPage.id)}
            style={{
              color: el.color,
              fontSize: `${el.fontSize}px`,
              fontFamily: el.fontFamily,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration:
                matchedPage.id === selectedPageId ? "underline" : "none",
              fontWeight: matchedPage.id === selectedPageId ? "bold" : "normal",
            }}
          >
            {el.content}
          </button>
        );
      }
      return (
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
      );
    });

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/projects")}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#1e40af",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "background-color 0.3s ease",
          margin: "1rem",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#3b82f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#1e40af")
        }
      >
        ← Back
      </button>

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
            marginBottom: "1rem",
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
          {globalDesign?.headerElements &&
            renderElements(globalDesign.headerElements)}
        </header>
      )}

      {/* Body Content */}
      {design.showBody && design.bodyCards?.length > 0 ? (
        <>
          {/* Image Cards */}
          {design.bodyCards.some((c) => c.type === "card") && (
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {design.bodyCards
                .filter((card) => card.type === "card")
                .map((card) => (
                  <div
                    key={card.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      padding: "1rem",
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
          )}

          {/* Text Blocks */}
          {design.bodyCards.some((c) => c.type === "text") && (
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {design.bodyCards
                .filter((card) => card.type === "text")
                .map((text) => (
                  <div
                    key={text.id}
                    style={{
                      padding: "1rem",
                      border: "1px dashed #aaa",
                      borderRadius: "4px",
                      fontSize: `${text.textFontSize || 18}px`,
                      fontFamily: text.fontFamily || "sans-serif",
                      color: text.textColor || "#333",
                    }}
                  >
                    {text.text || "No content"}
                  </div>
                ))}
            </section>
          )}
        </>
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
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            borderRadius: "4px",
          }}
        >
          {globalDesign?.footerElements &&
            renderElements(globalDesign.footerElements)}
        </footer>
      )}
    </div>
  );
}

export default ProjectPreview;
