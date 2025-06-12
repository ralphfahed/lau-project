import React, { useState } from "react";
import {
  FaBasketballBall,
  FaEdit,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import "./SportPage.css";

function AddElementForm({ onAdd, fixedType }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd({ type: fixedType || "text", content });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder={`Enter ${fixedType || "text/button"} content`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

const SportPage = () => {
  const [headerElements, setHeaderElements] = useState([]);
  const [headerStyle, setHeaderStyle] = useState({
    backgroundColor: "#0f2b3e",
    padding: "1rem",
    color: "white",
  });
  const [showNav, setShowNav] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [userIcon, setUserIcon] = useState(null);

  // States for new element default styles
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");

  // States for editing existing element styles
  const [editColor, setEditColor] = useState("");
  const [editFontSize, setEditFontSize] = useState("");
  const [editFontFamily, setEditFontFamily] = useState("");

  const addElement = (element) => {
    setHeaderElements((prev) => [
      ...prev,
      {
        ...element,
        id: Date.now(),
        color: textColor,
        fontSize,
        fontFamily,
      },
    ]);
  };

  const changeBackgroundColor = (e) => {
    setHeaderStyle((prev) => ({ ...prev, backgroundColor: e.target.value }));
  };

  const changeTextColor = (e) => {
    setTextColor(e.target.value);
  };

  const changeFontSize = (e) => {
    setFontSize(e.target.value);
  };

  const changeFontFamily = (e) => {
    setFontFamily(e.target.value);
  };

  // When editing starts, load current styles into editing states
  const startEditing = (
    id,
    currentContent,
    currentColor,
    currentFontSize,
    currentFontFamily
  ) => {
    setEditingId(id);
    setEditContent(currentContent);
    setEditColor(currentColor || "#000000");
    setEditFontSize(currentFontSize || "16");
    setEditFontFamily(currentFontFamily || "Arial, sans-serif");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
    setEditColor("");
    setEditFontSize("");
    setEditFontFamily("");
  };

  const saveEditing = (id) => {
    setHeaderElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              content: editContent,
              color: editColor,
              fontSize: editFontSize,
              fontFamily: editFontFamily,
            }
          : el
      )
    );
    cancelEditing();
  };

  const deleteElement = (id) => {
    setHeaderElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header" style={headerStyle}>
        <button
          className="burger"
          onClick={() => setShowNav(!showNav)}
          title="Toggle menu"
        >
          ☰
        </button>
        <div className="icon-text">
          {userIcon && (
            <div className="icon-wrapper">
              <img
                src={userIcon}
                alt="User Icon"
                className="user-icon"
                title="User uploaded icon"
              />
              <button
                className="delete-icon-btn"
                onClick={() => setUserIcon(null)}
                title="Remove Icon"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="nav-elements">
            {headerElements.map((el) => {
              const isEditing = editingId === el.id;
              if (isEditing) {
                return (
                  <span key={el.id} className="nav-item editing">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <label>
                      Text Color:
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                      />
                    </label>
                    <label>
                      Font Size:
                      <input
                        type="number"
                        min="8"
                        max="72"
                        value={editFontSize}
                        onChange={(e) => setEditFontSize(e.target.value)}
                        style={{ width: "60px" }}
                      />
                    </label>
                    <label>
                      Font Family:
                      <select
                        value={editFontFamily}
                        onChange={(e) => setEditFontFamily(e.target.value)}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Courier New', Courier, monospace">
                          Courier New
                        </option>
                        <option value="'Times New Roman', Times, serif">
                          Times New Roman
                        </option>
                        <option value="'Georgia', serif">Georgia</option>
                        <option value="'Verdana', sans-serif">Verdana</option>
                        <option value="'Trebuchet MS', sans-serif">
                          Trebuchet MS
                        </option>
                      </select>
                    </label>

                    <button onClick={() => saveEditing(el.id)} title="Save">
                      <FaCheck />
                    </button>
                    <button onClick={cancelEditing} title="Cancel">
                      <FaTimes />
                    </button>
                  </span>
                );
              }

              switch (el.type) {
                case "text":
                  return (
                    <span
                      key={el.id}
                      className="nav-item"
                      style={{
                        color: el.color || "inherit",
                        fontSize: el.fontSize ? `${el.fontSize}px` : "inherit",
                        fontFamily: el.fontFamily || "inherit",
                      }}
                    >
                      {el.content}
                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEditing(
                            el.id,
                            el.content,
                            el.color,
                            el.fontSize,
                            el.fontFamily
                          )
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteElement(el.id)}
                        title="Delete"
                      >
                        <FaTrash style={{ color: "red" }} />
                      </button>
                    </span>
                  );

                case "button":
                  return (
                    <span key={el.id} className="nav-item">
                      {el.content}
                      <div className="nav-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(el.id, el.content)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteElement(el.id)}
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                    </span>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </header>

      {/* Side Nav (toggleable) */}
      {showNav && (
        <nav className="side-nav">
          <h4>Customize Header</h4>

          <label>
            Background Color:
            <input
              type="color"
              value={headerStyle.backgroundColor}
              onChange={changeBackgroundColor}
            />
          </label>

          <h4>Add Text</h4>
          <AddElementForm fixedType="text" onAdd={addElement} />

          {/* New controls for default text styles */}
          <label>
            Text Color:
            <input type="color" value={textColor} onChange={changeTextColor} />
          </label>

          <label>
            Font Size (px):
            <input
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={changeFontSize}
              style={{ width: "60px" }}
            />
          </label>

          <label>
            Font Family:
            <select value={fontFamily} onChange={changeFontFamily}>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Courier New', Courier, monospace">
                Courier New
              </option>
              <option value="'Times New Roman', Times, serif">
                Times New Roman
              </option>
              <option value="'Georgia', serif">Georgia</option>
              <option value="'Verdana', sans-serif">Verdana</option>
              <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            </select>
          </label>

          <h4>Add Icon</h4>
          <div className="upload-box">
            <label htmlFor="icon-upload" className="icon-upload-label">
              &#8682; Upload
            </label>
            <input
              type="file"
              id="icon-upload"
              accept="image/*"
              onChange={handleIconUpload}
              style={{ display: "none" }}
            />
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="page-body">
        <p>Here is the main SportPage content...</p>
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <p>© 2025 SportPage Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SportPage;
