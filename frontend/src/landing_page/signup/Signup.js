import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Set via REACT_APP_API_URL / REACT_APP_DASHBOARD_URL in a .env file for
// local dev, and in Render's Static Site "Environment Variables" for
// production. CRA bakes these in at BUILD time.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const DASHBOARD_URL =
  process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send registration data to backend API
      const res = await axios.post(`${API_URL}/signup`, formData);
      const token = res.data.token;
      const username = res.data.username;

      // 2. The dashboard runs on a different origin with its own
      // localStorage, so hand the token/username along as URL params.
      const params = new URLSearchParams({ token, username });
      window.location.href = `${DASHBOARD_URL}/?${params.toString()}`;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>Sign Up for TradeGrid</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#387ed1",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Register & Trade
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
