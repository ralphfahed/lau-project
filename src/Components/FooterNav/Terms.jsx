import React from "react";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import "./Terms.css";

function Terms() {
  return (
    <>
      <Navbar />
      <div
        className="terms-container"
        style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}
      >
        <h1>Terms of Service</h1>
        <p>
          <strong>Effective Date:</strong> July 2, 2025
        </p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using this website, you agree to be bound by these
            Terms of Service. If you do not agree, please do not use our site.
          </p>
        </section>

        <section>
          <h2>2. Use of the Site</h2>
          <p>
            You agree to use the website only for lawful purposes and in a way
            that does not infringe the rights of others or restrict their use.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            If you create an account on our site, you are responsible for
            maintaining the confidentiality of your login information and for
            all activities under your account.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this site, including logos, graphics, text, and
            software, is owned by or licensed to us and protected by copyright
            and other laws.
          </p>
        </section>

        <section>
          <h2>5. Termination</h2>
          <p>
            We may suspend or terminate your access to the website at any time,
            without prior notice, if you violate these Terms.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            We are not liable for any damages or losses resulting from your use
            of the site. This includes data loss, loss of profits, or business
            interruption.
          </p>
        </section>

        <section>
          <h2>7. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            website after changes means you accept the updated Terms.
          </p>
        </section>
      </div>
      <Footerbar />
    </>
  );
}

export default Terms;
