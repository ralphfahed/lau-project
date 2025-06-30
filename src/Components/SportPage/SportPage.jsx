import React, { useState } from "react";
import { Palette, Type, Image } from "lucide-react";
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

  const [showBodySettings, setShowBodySettings] = useState(false);

  const [bodyCards, setBodyCards] = useState([
    {
      id: Date.now().toString(),
      image: "",
      price: "Price 1",
      priceColor: "#000000",
      priceFontSize: 16,
      priceFontFamily: "Inter",
      info: "Info 1",
      infoColor: "#000000",
      infoFontSize: 14,
      infoFontFamily: "Inter",
    },
  ]);

  const [footerStyle, setFooterStyle] = useState({
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: "1rem 2rem",
  });

  const [footerElements, setFooterElements] = useState([
    {
      id: "f1",
      content: "Privacy Policy",
      color: "#ffffff",
      fontSize: 14,
      fontFamily: "Inter",
    },
    {
      id: "f2",
      content: "Terms of Service",
      color: "#ffffff",
      fontSize: 14,
      fontFamily: "Inter",
    },
    {
      id: "f3",
      content: "Contact",
      color: "#ffffff",
      fontSize: 14,
      fontFamily: "Inter",
    },
    {
      id: "f4",
      content: "© 2025 My Company",
      color: "#ffffff",
      fontSize: 14,
      fontFamily: "Inter",
    },
  ]);

  const [userIcon, setUserIcon] = useState(
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400"
  );

  const [activeTab, setActiveTab] = useState("design");
  const [showHeaderSettings, setShowHeaderSettings] = useState(false);
  const [showFooterSettings, setShowFooterSettings] = useState(false);

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

  const addBodyCard = () => {
    const newCard = {
      id: Date.now().toString(),
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
            <div className="design-panel">
              {/* Header Style */}
              <section className="section">
                <h3>
                  <button
                    className="toggle-btn"
                    onClick={() => setShowHeaderSettings(!showHeaderSettings)}
                  >
                    {showHeaderSettings ? "−" : "+"}
                  </button>
                  <Palette /> Header Style
                </h3>
                {showHeaderSettings && (
                  <>
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
                        setHeaderStyle({
                          ...headerStyle,
                          padding: e.target.value,
                        })
                      }
                    />

                    {/* User Icon */}
                    <h4>
                      <Image /> User Icon
                    </h4>
                    <label>Upload Icon Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setUserIcon(reader.result);
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

                    {/* Navigation Items */}
                    <h4>
                      <Type /> Navigation Items
                    </h4>
                    <button
                      onClick={addHeaderElement}
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        marginLeft: "auto",
                        fontWeight: "bold",
                      }}
                    >
                      Add Item
                    </button>
                    {headerElements.map((el) => (
                      <div key={el.id} className="nav-edit-item">
                        <button
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            marginLeft: "auto", // This pushes the button to the far right
                            padding: "10px",
                          }}
                          onClick={() => removeElement(el.id)}
                        >
                          X
                        </button>
                        <input
                          type="text"
                          value={el.content}
                          onChange={(e) =>
                            updateElement(el.id, "content", e.target.value)
                          }
                        />

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
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                        </select>
                      </div>
                    ))}
                  </>
                )}
              </section>

              {/* Body Style */}
              <section className="section">
                <h3>
                  <button
                    className="toggle-btn"
                    onClick={() => setShowBodySettings(!showBodySettings)}
                  >
                    {showBodySettings ? "−" : "+"}
                  </button>
                  Body Style
                </h3>
                {showBodySettings && (
                  <>
                    <button
                      onClick={addBodyCard}
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        marginLeft: "auto",
                        fontWeight: "bold",
                      }}
                    >
                      Add Card
                    </button>

                    <div className="nav-edit-item">
                      {bodyCards.map((card) => (
                        <div key={card.id} className="body-card">
                          <button
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              marginLeft: "auto",
                              padding: "10px",
                            }}
                            onClick={() => removeBodyCard(card.id)}
                          >
                            X
                          </button>

                          {/* Image Upload */}
                          <label>Image</label>
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
                          />
                          {card.image && (
                            <img
                              src={card.image}
                              alt="Card"
                              style={{
                                width: "100%",
                                maxHeight: "150px",
                                objectFit: "contain",
                                marginBottom: "0.5rem",
                              }}
                            />
                          )}

                          {/* Price */}
                          <label>Price</label>
                          <input
                            type="text"
                            value={card.price}
                            onChange={(e) =>
                              updateBodyCard(card.id, "price", e.target.value)
                            }
                          />
                          <label>Color</label>
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
                          />
                          <label>Font Size</label>
                          <input
                            type="number"
                            value={card.priceFontSize}
                            onChange={(e) =>
                              updateBodyCard(
                                card.id,
                                "priceFontSize",
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <label>Font Family</label>
                          <select
                            value={card.priceFontFamily}
                            onChange={(e) =>
                              updateBodyCard(
                                card.id,
                                "priceFontFamily",
                                e.target.value
                              )
                            }
                          >
                            <option value="Inter">Inter</option>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">
                              Times New Roman
                            </option>
                          </select>

                          {/* Info */}
                          <label>Info</label>
                          <input
                            type="text"
                            value={card.info}
                            onChange={(e) =>
                              updateBodyCard(card.id, "info", e.target.value)
                            }
                          />
                          <label>Color</label>
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
                          />
                          <label>Font Size</label>
                          <input
                            type="number"
                            value={card.infoFontSize}
                            onChange={(e) =>
                              updateBodyCard(
                                card.id,
                                "infoFontSize",
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <label>Font Family</label>
                          <select
                            value={card.infoFontFamily}
                            onChange={(e) =>
                              updateBodyCard(
                                card.id,
                                "infoFontFamily",
                                e.target.value
                              )
                            }
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
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* Footer Style */}
              <section className="section">
                <h3>
                  <button
                    className="toggle-btn"
                    onClick={() => setShowFooterSettings(!showFooterSettings)}
                  >
                    {showFooterSettings ? "−" : "+"}
                  </button>
                  <Palette /> Footer Style
                </h3>
                {showFooterSettings && (
                  <>
                    <label>Background Color</label>
                    <input
                      type="color"
                      value={footerStyle.backgroundColor}
                      onChange={(e) =>
                        setFooterStyle({
                          ...footerStyle,
                          backgroundColor: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      value={footerStyle.backgroundColor}
                      onChange={(e) =>
                        setFooterStyle({
                          ...footerStyle,
                          backgroundColor: e.target.value,
                        })
                      }
                    />
                    <label>Padding</label>
                    <input
                      type="text"
                      value={footerStyle.padding}
                      onChange={(e) =>
                        setFooterStyle({
                          ...footerStyle,
                          padding: e.target.value,
                        })
                      }
                    />

                    {/* Footer Items */}
                    <h4>
                      <Type /> Footer Items
                    </h4>
                    <button
                      onClick={() => {
                        const newFooterItem = {
                          id: Date.now().toString(),
                          content: "New Footer Item",
                          color: "#ffffff",
                          fontSize: 14,
                          fontFamily: "Inter",
                        };
                        setFooterElements([...footerElements, newFooterItem]);
                      }}
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        marginLeft: "auto",
                        fontWeight: "bold",
                      }}
                    >
                      Add Item
                    </button>
                    {footerElements.map((el) => (
                      <div key={el.id} className="nav-edit-item">
                        <button
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            marginLeft: "auto", // This pushes the button to the far right
                            padding: "10px",
                          }}
                          onClick={() =>
                            setFooterElements(
                              footerElements.filter((item) => item.id !== el.id)
                            )
                          }
                        >
                          X
                        </button>
                        <input
                          type="text"
                          value={el.content}
                          onChange={(e) =>
                            setFooterElements(
                              footerElements.map((item) =>
                                item.id === el.id
                                  ? { ...item, content: e.target.value }
                                  : item
                              )
                            )
                          }
                        />

                        <label>Color</label>
                        <input
                          type="color"
                          value={el.color}
                          onChange={(e) =>
                            setFooterElements(
                              footerElements.map((item) =>
                                item.id === el.id
                                  ? { ...item, color: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                        <label>Font Size</label>
                        <input
                          type="number"
                          value={el.fontSize}
                          onChange={(e) =>
                            setFooterElements(
                              footerElements.map((item) =>
                                item.id === el.id
                                  ? {
                                      ...item,
                                      fontSize: parseInt(e.target.value),
                                    }
                                  : item
                              )
                            )
                          }
                        />
                        <label>Font Family</label>
                        <select
                          value={el.fontFamily}
                          onChange={(e) =>
                            setFooterElements(
                              footerElements.map((item) =>
                                item.id === el.id
                                  ? { ...item, fontFamily: e.target.value }
                                  : item
                              )
                            )
                          }
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
                    ))}
                  </>
                )}
              </section>
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
            <div className="preview-body">
              <div className="body-cards-preview">
                {bodyCards.map((card) => (
                  <div key={card.id} className="preview-card">
                    {card.image && (
                      <img
                        src={card.image}
                        alt="Card"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "contain",
                          marginBottom: "0.5rem",
                        }}
                      />
                    )}
                    <div
                      style={{
                        color: card.priceColor,
                        fontSize: `${card.priceFontSize}px`,
                        fontFamily: card.priceFontFamily,
                        fontWeight: "bold",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {card.price}
                    </div>
                    <div
                      style={{
                        color: card.infoColor,
                        fontSize: `${card.infoFontSize}px`,
                        fontFamily: card.infoFontFamily,
                      }}
                    >
                      {card.info}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="preview-footer" style={footerStyle}>
              <nav className="navf">
                {footerElements.map((el) => (
                  <span
                    key={el.id}
                    style={{
                      color: el.color,
                      fontSize: `${el.fontSize}px`,
                      fontFamily: el.fontFamily,
                      marginRight: el.id !== "f4" ? "1rem" : 0,
                      display: el.id === "f4" ? "block" : "inline",
                      textAlign: el.id === "f4" ? "center" : "left",
                      width: el.id === "f4" ? "100%" : "auto",
                      marginTop: el.id === "f4" ? "0.5rem" : 0,
                    }}
                    className="nav-item"
                  >
                    {el.content}
                  </span>
                ))}
              </nav>
            </footer>
          </div>
        )}
      </div>
      <Footerbar />
    </div>
  );
}

export default Sport;
