import React from "react";
import "./Footerbar.css"; // Make sure this path is correct

const Footerbar = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
        <p>&copy; 2025 My Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footerbar;
