import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectPreview.css";

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
      setSelectedPageId(String(selectedProject.pages[0].id));
    }

    const loadedDesignData = {};
    selectedProject.pages.forEach((page) => {
      const key = `EditPageDesign-project-${selectedProject.id}-page-${page.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          loadedDesignData[String(page.id)] = JSON.parse(saved);
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
      </div>
    );
  }

  if (!project.pages || project.pages.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>No pages created yet</h2>
      </div>
    );
  }

  if (!selectedPageId) {
    return <div style={{ padding: "1rem" }}>Loading pages...</div>;
  }

  const selectedPage = project.pages.find(
    (p) => String(p.id) === selectedPageId
  );
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
            onClick={() => setSelectedPageId(String(matchedPage.id))}
            style={{
              color: el.color,
              fontSize: `${el.fontSize}px`,
              fontFamily: el.fontFamily,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration:
                String(matchedPage.id) === selectedPageId
                  ? "underline"
                  : "none",
              fontWeight:
                String(matchedPage.id) === selectedPageId ? "bold" : "normal",
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
    <div className="page-wrapper">
      {showHeader && (
        <header
          className="pp-header"
          style={{
            backgroundColor:
              globalDesign?.headerStyle?.backgroundColor || "#1e40af",
            color: globalDesign?.headerStyle?.color || "#fff",
            padding: globalDesign?.headerStyle?.padding || "1rem 2rem",
          }}
        >
          {globalDesign?.userIcon && (
            <img
              src={globalDesign.userIcon}
              alt="User Icon"
              className="pp-user-icon"
            />
          )}
          {globalDesign?.headerElements &&
            renderElements(globalDesign.headerElements)}
        </header>
      )}

      <main className="body-container">
        {design.showBody && design.bodyCards?.length > 0 ? (
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              margin: "2rem",
            }}
          >
            {design.bodyCards.map((card) => {
              if (card.type === "card") {
                return (
                  <div
                    key={card.id}
                    style={{
                      flex: "0 0 calc((100% / 4) - 0.75rem)",
                      boxSizing: "border-box",
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
                        textAlign: card.priceAlignment || "left",
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
                        textAlign: card.infoAlignment || "left",
                        color: card.infoColor,
                        fontSize: `${card.infoFontSize}px`,
                        fontFamily: card.infoFontFamily,
                        margin: 0,
                      }}
                    >
                      {card.info}
                    </p>
                  </div>
                );
              } else if (card.type === "text") {
                return (
                  <div
                    key={card.id}
                    style={{
                      flex: "0 0 100%",
                      padding: "1rem",
                      borderRadius: "4px",
                      fontSize: `${card.textFontSize || 18}px`,
                      fontFamily: card.fontFamily || "sans-serif",
                      color: card.textColor || "#333",
                      textAlign: card.alignment || "left",
                    }}
                  >
                    {card.text || "No content"}
                  </div>
                );
              }
              return null;
            })}
          </section>
        ) : (
          <div className="body-cont">
            <p>No body content to show</p>
          </div>
        )}
      </main>

      {showFooter && (
        <footer
          className="pp-footer"
          style={{
            backgroundColor:
              globalDesign?.footerStyle?.backgroundColor || "#1e40af",
            color: globalDesign?.footerStyle?.color || "#fff",
            padding: globalDesign?.footerStyle?.padding || "1rem 2rem",
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
