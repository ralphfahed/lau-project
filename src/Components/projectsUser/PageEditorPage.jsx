import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import "./PageEditorPage.css";

function EditPage() {
  const navigate = useNavigate();
  const { pageId = "defaultPage", projectId } = useParams();
  const storageKey = `EditPageDesign-${pageId}`;

  const [showBody, setShowBody] = useState(true);
  const [bodyCards, setBodyCards] = useState([]);
  const [activeTab, setActiveTab] = useState("design");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (typeof data.showBody === "boolean") setShowBody(data.showBody);
      if (Array.isArray(data.bodyCards)) setBodyCards(data.bodyCards);
    }
  }, [storageKey]);

  const addBodyCard = () => {
    const newCard = {
      id: Date.now().toString(),
      type: "card",
      image: "",
      price: "New Price",
      priceColor: "#000000",
      priceFontSize: 16,
      priceFontFamily: "Inter",
      info: "New Info",
      infoColor: "#000000",
      infoFontSize: 14,
      infoFontFamily: "Inter",
    };
    setBodyCards([...bodyCards, newCard]);
  };

  const addBodyText = () => {
    const newText = {
      id: Date.now().toString(),
      type: "text",
      text: "New text block",
      textColor: "#000000",
      textFontSize: 16,
      textFontFamily: "Inter",
    };
    setBodyCards([...bodyCards, newText]);
  };

  const updateBodyCard = (id, field, value) => {
    setBodyCards(
      bodyCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const removeBodyCard = (id) => {
    setBodyCards(bodyCards.filter((card) => card.id !== id));
  };

  const handleSave = () => {
    const bodyCardsToSave = bodyCards.map(({ image, ...rest }) => rest);
    const dataToSave = {
      showBody,
      bodyCards: bodyCardsToSave,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log("Saved successfully without images");
      navigate(-1);
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert(
          "Storage quota exceeded! Images are too large to save in localStorage."
        );
      } else {
        console.error("Error saving data:", e);
      }
    }
  };

  const handleBackClick = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  return (
    <div className="container">
      <Navbar />
      <button onClick={handleBackClick} className="back-button">
        ← Back
      </button>

      <div className="sport-body">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === "design" ? "active" : ""}`}
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={`tab-button ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {activeTab === "design" && (
          <>
            {showBody && (
              <section className="section">
                <h3 className="section-title body-title">Body Style</h3>

                <div className="body-controls">
                  <button onClick={addBodyCard} className="addd-btn">
                    Add Card
                  </button>
                  <button onClick={addBodyText} className="addd-btn">
                    Add Text
                  </button>
                </div>

                {bodyCards.map((card) => (
                  <div key={card.id} className="body-card">
                    <button
                      className="remove-btn card-remove"
                      onClick={() => removeBodyCard(card.id)}
                      aria-label="Remove body card"
                    >
                      X
                    </button>

                    {card.type === "card" ? (
                      <>
                        <div className="image-section">
                          <h4>Image</h4>
                          <div className="edit-image">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () =>
                                    updateBodyCard(
                                      card.id,
                                      "image",
                                      reader.result
                                    );
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="file-input"
                            />
                            <img
                              src={
                                card.image ||
                                "https://st2.depositphotos.com/2586633/46477/v/450/depositphotos_464771766-stock-illustration-no-photo-or-blank-image.jpg"
                              }
                              alt="Card"
                              className="card-image"
                            />
                          </div>
                        </div>

                        <div className="body-info">
                          <h4>Price</h4>
                          <div className="body-style">
                            <input
                              type="text"
                              value={card.price}
                              onChange={(e) =>
                                updateBodyCard(card.id, "price", e.target.value)
                              }
                              className="text-input"
                            />
                            <input
                              type="color"
                              value={card.priceColor}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "priceColor",
                                  e.target.value
                                )
                              }
                              className="color-input"
                            />
                            <input
                              type="number"
                              min={8}
                              max={72}
                              value={card.priceFontSize}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "priceFontSize",
                                  parseInt(e.target.value)
                                )
                              }
                              className="number-input"
                            />
                            <select
                              value={card.priceFontFamily}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "priceFontFamily",
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
                          </div>
                        </div>

                        <div className="body-info">
                          <h4>Info</h4>
                          <div className="body-style">
                            <input
                              type="text"
                              value={card.info}
                              onChange={(e) =>
                                updateBodyCard(card.id, "info", e.target.value)
                              }
                              className="text-input"
                            />
                            <input
                              type="color"
                              value={card.infoColor}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "infoColor",
                                  e.target.value
                                )
                              }
                              className="color-input"
                            />
                            <input
                              type="number"
                              min={8}
                              max={72}
                              value={card.infoFontSize}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "infoFontSize",
                                  parseInt(e.target.value)
                                )
                              }
                              className="number-input"
                            />
                            <select
                              value={card.infoFontFamily}
                              onChange={(e) =>
                                updateBodyCard(
                                  card.id,
                                  "infoFontFamily",
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
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-block-editor">
                        <h4>Text Block</h4>
                        <textarea
                          value={card.text}
                          onChange={(e) =>
                            updateBodyCard(card.id, "text", e.target.value)
                          }
                          className="text-area-input"
                          rows={4}
                          style={{ width: "100%", resize: "vertical" }}
                        />
                        <input
                          type="color"
                          value={card.textColor}
                          onChange={(e) =>
                            updateBodyCard(card.id, "textColor", e.target.value)
                          }
                          className="color-input"
                        />
                        <input
                          type="number"
                          min={8}
                          max={72}
                          value={card.textFontSize}
                          onChange={(e) =>
                            updateBodyCard(
                              card.id,
                              "textFontSize",
                              parseInt(e.target.value)
                            )
                          }
                          className="number-input"
                        />
                        <select
                          value={card.textFontFamily}
                          onChange={(e) =>
                            updateBodyCard(
                              card.id,
                              "textFontFamily",
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
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            <div className="save-section">
              <button onClick={handleSave} className="save-btn">
                Save Changes & Return
              </button>
            </div>
          </>
        )}

        {activeTab === "preview" && (
          <main className="preview-body">
            <div className="preview-cards-container">
              {bodyCards.map((card) =>
                card.type === "card" ? (
                  <div key={card.id} className="preview-card">
                    <img
                      src={
                        card.image ||
                        "https://st2.depositphotos.com/2586633/46477/v/450/depositphotos_464771766-stock-illustration-no-photo-or-blank-image.jpg"
                      }
                      alt="Card"
                      className="preview-card-image"
                    />

                    <div className="preview-card-bottom">
                      <p
                        className="preview-card-price"
                        style={{
                          color: card.priceColor,
                          fontSize: `${card.priceFontSize}px`,
                          fontFamily: card.priceFontFamily,
                        }}
                      >
                        {card.price}
                      </p>
                      <p
                        className="preview-card-info"
                        style={{
                          color: card.infoColor,
                          fontSize: `${card.infoFontSize}px`,
                          fontFamily: card.infoFontFamily,
                        }}
                      >
                        {card.info}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={card.id}
                    className="preview-text-block"
                    style={{
                      color: card.textColor,
                      fontSize: `${card.textFontSize}px`,
                      fontFamily: card.textFontFamily,
                      marginBottom: "1rem",
                      whiteSpace: "pre-wrap",
                      width: "100%",
                      maxWidth: "600px",
                    }}
                  >
                    {card.text}
                  </div>
                )
              )}
            </div>
          </main>
        )}
      </div>

      <Footerbar />
    </div>
  );
}

export default EditPage;
