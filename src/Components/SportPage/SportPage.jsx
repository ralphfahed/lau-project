import React, { useState } from "react";
import { Eye, Settings, Palette, Type, Image, Download } from "lucide-react";
import "./SportPage.css";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";

function Sport() {
  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "1rem 2rem",
  });

  const [headerElements, setHeaderElements] = useState([
    {
      id: "1",
      content: "Home",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    },
    {
      id: "2",
      content: "News",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    },
    {
      id: "3",
      content: "About us",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    },
    {
      id: "4",
      content: "Contact us",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    },
  ]);

  const [userIcon, setUserIcon] = useState(
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400"
  );
  const [activeTab, setActiveTab] = useState("design");

  const addHeaderElement = () => {
    const newElement = {
      id: Date.now().toString(),
      content: "New Item",
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "Inter",
    };
    setHeaderElements([...headerElements, newElement]);
  };

  const updateElement = (id, field, value) => {
    setHeaderElements(
      headerElements.map((el) =>
        el.id === id ? { ...el, [field]: value } : el
      )
    );
  };

  const removeElement = (id) => {
    setHeaderElements(headerElements.filter((el) => el.id !== id));
  };

  return (
    <div className="container">
      <Navbar />
      <div className="sport-body">
        {activeTab === "design" && (
          <div className="tab-buttons">
            <button className="active" onClick={() => setActiveTab("design")}>
              Design
            </button>
            <button onClick={() => setActiveTab("preview")}>Preview</button>
          </div>
        )}

        {activeTab === "design" ? (
          <div className="design-layout">
            {/* Design Panel */}
            <div className="design-panel">
              <section className="section">
                <h3>
                  <Palette /> Header Style
                </h3>
                <label>Background Color</label>
                <input
                  type="color"
                  value={headerStyle.backgroundColor}
                  onChange={(e) =>
                    setHeaderStyle({
                      ...headerStyle,
                      backgroundColor: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={headerStyle.backgroundColor}
                  onChange={(e) =>
                    setHeaderStyle({
                      ...headerStyle,
                      backgroundColor: e.target.value,
                    })
                  }
                />

                <label>Padding</label>
                <input
                  type="text"
                  value={headerStyle.padding}
                  onChange={(e) =>
                    setHeaderStyle({ ...headerStyle, padding: e.target.value })
                  }
                />
              </section>

              <section className="section">
                <h3>
                  <Image /> User Icon
                </h3>

                <label>Upload Icon Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setUserIcon(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {userIcon && (
                  <img
                    src={userIcon}
                    alt="Preview"
                    className="user-preview"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </section>

              <section className="section">
                <h3>
                  <Type /> Navigation Items
                </h3>
                <button onClick={addHeaderElement}>Add Item</button>
                {headerElements.map((el) => (
                  <div key={el.id} className="nav-edit-item">
                    <input
                      type="text"
                      value={el.content}
                      onChange={(e) =>
                        updateElement(el.id, "content", e.target.value)
                      }
                    />
                    <button onClick={() => removeElement(el.id)}>Remove</button>
                    <label>Color</label>
                    <input
                      type="color"
                      value={el.color}
                      onChange={(e) =>
                        updateElement(el.id, "color", e.target.value)
                      }
                    />
                    <label>Font Size</label>
                    <input
                      type="number"
                      value={el.fontSize}
                      onChange={(e) =>
                        updateElement(
                          el.id,
                          "fontSize",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <label>Font Family</label>
                    <select
                      value={el.fontFamily}
                      onChange={(e) =>
                        updateElement(el.id, "fontFamily", e.target.value)
                      }
                    >
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                ))}
              </section>
            </div>

            {/* Live Header Preview */}
            <div
              className="header-preview"
              style={{ flex: 1, marginLeft: "1rem" }}
            >
              <div className="live-prev">
                <h5>Live Preview</h5>
              </div>
              <header className="main-header" style={headerStyle}>
                {userIcon && (
                  <img
                    src={userIcon}
                    alt="User"
                    className="user-icon"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <nav className="nav">
                  {headerElements.map((el) => (
                    <span
                      key={el.id}
                      style={{
                        color: el.color,
                        fontSize: `${el.fontSize}px`,
                        fontFamily: el.fontFamily,
                      }}
                      className="nav-item"
                    >
                      {el.content}
                    </span>
                  ))}
                </nav>
              </header>
              {/* <h2>sportfffffffffffffffffffffffffffffffffffffffff</h2> */}
            </div>
          </div>
        ) : (
          <div className="preview-panel">
            <div className="full-back">
              <h3>Full Preview</h3>
              <button
                className="back-button"
                onClick={() => setActiveTab("design")}
              >
                Back to Design
              </button>
            </div>
            <div className="preview-header" style={headerStyle}>
              {userIcon && (
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="user-icon"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <nav className="nav">
                {headerElements.map((el) => (
                  <span
                    key={el.id}
                    style={{
                      color: el.color,
                      fontSize: `${el.fontSize}px`,
                      fontFamily: el.fontFamily,
                    }}
                    className="nav-item"
                  >
                    {el.content}
                  </span>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      <Footerbar />
    </div>
  );
}

export default Sport;
