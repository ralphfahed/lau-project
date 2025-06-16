import React, { useState, useEffect } from "react";
import "../layout/Navbar.css"; // Make sure this path is correct
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  function UserMenu({ userName, onLogout }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const navigate = useNavigate();

    const handleProjectsClick = () => {
      setIsOpen(false); // close menu
      navigate("/projects"); // navigate to projects page
    };

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="user-avatar"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        {isOpen && (
          <div className="user-menu">
            <div className="underlined-text">{userName}</div>

            <div
              className="clickable-text"
              onClick={handleProjectsClick}
              style={{ cursor: "pointer" }}
            >
              My Projects
            </div>
            <div onClick={onLogout} className="logout-button">
              Logout
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("auth");
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUserName(null);
      navigate("/login"); // redirect to login page after logout
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/check_auth", {
      credentials: "include", // important to send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUserName(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container-auto">
      {/* Welcome Section */}
      <div id="welcome">
        <div id="icon">
          <img
            src="https://img.icons8.com/?size=100&id=ddiDblGivpG2&format=png&color=000000"
            width="35"
            height="35"
            alt="Logo"
          />
        </div>
        {/* <div id="usermail">Welcome {userName}</div> */}

        <div>
          {userName ? (
            <UserMenu userName={userName} onLogout={handleLogout} />
          ) : (
            <Link to="/login">Login</Link> // <-- changed here
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
