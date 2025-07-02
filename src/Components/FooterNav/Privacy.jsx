import React from "react";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import "./Privacy.css"; // Optional for styling

function Privacy() {
  return (
    <>
      <Navbar />
      <div
        className="privacy-container"
        style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}
      >
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> July 2, 2025
        </p>

        <section>
          <h2>1. Information</h2>
          <p>Ralph Fahed , ralphh.fahed@gmail.com , Lebanon .</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>Your information helps us to:</p>
          <ul>
            <li>Respond to your messages and inquiries</li>
            <li>Improve our website and user experience</li>
          </ul>
        </section>

        <section>
          <h2>3. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We may share information with
            trusted third-party services for website operations, or if required
            by law.
          </p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            data. You can also disable cookies via your browser settings.
          </p>
        </section>

        <section>
          <h2>5. Security</h2>
          <p>
            We implement reasonable security practices to protect your data from
            unauthorized access or disclosure.
          </p>
        </section>

        <section>
          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The latest
            version will always be available on this page.
          </p>
        </section>
      </div>

      <Footerbar />
    </>
  );
}

export default Privacy;
