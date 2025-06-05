import React, { useState, useEffect } from "react";
import "./login.css";
import logoImage from "../assets/ecowalletlogo.png";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Login failed");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Login successful:", data);

        // Store the authentication token
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }

        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Store username/email if returned
        if (data.username) {
          sessionStorage.setItem("userName", data.username);
        }

        navigate("/summary");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setError(err.message || "Invalid credentials. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="branding">
          <img src={logoImage} alt="EcoWallet Logo" className="chart-icon" />
        </div>
      </div>

      <div className="right-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Hello, welcome back!</h1>
          {error && <div className="error-message">{error}</div>}
          <input
            id="email"
            type="text"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeSharp /> : <FaRegEyeSlash />}
              </span>
            )}
          </div>
          <div className="options">
            <label>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">LOG IN</button>

          <p className="signup-text">
            New User? <a href="/register">Signup</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;