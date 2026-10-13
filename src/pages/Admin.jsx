import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../styles/Admin.css";
import homebg from "../assets/adminBG.jpg";

export default function Admin() {
  const [username, setUsername] = useState("pawShelter@gmail.com");
  const [password, setPassword] = useState("adminSide123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Admin Credentials
    if (username.trim() === "pawShelter@gmail.com" && password === "adminSide123") {
      localStorage.setItem("admin_auth", "true");
      navigate("/adminside");
    } else {
      setError("Invalid administrative credentials. Please verify and try again.");
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <section 
      className="admin-page-wrapper"
      style={{ backgroundImage: `url(${homebg})` }}
      id="admin-login-section"
    >
      <div className="admin-login-backdrop">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon-circle">
              <FaUserShield />
            </div>
            <h2>Admin Portal</h2>
            <p>Shelter Submission & Pet Management Console</p>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="input-group">
              <label htmlFor="admin-email">Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="field-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@pawshelter.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="admin-password">Password</label>
              <div className="input-with-icon">
                <FaLock className="field-icon" />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary admin-submit-btn" id="btn-admin-login-submit">
              Sign In to Dashboard
            </button>
          </form>

          <div className="admin-login-footer">
            <button onClick={handleBack} className="admin-back-btn" id="btn-admin-back-home">
              <FaArrowLeft /> Back to Website
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
