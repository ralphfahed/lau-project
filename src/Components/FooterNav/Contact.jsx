import React, { useState } from "react";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your back-end or email service
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          If you have any questions, feel free to reach out using the form
          below.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Message:
            <textarea
              name="message"
              rows="6"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </label>

          <button type="submit">Send Message</button>
        </form>
      </div>
      <Footerbar />
    </>
  );
}

export default Contact;
