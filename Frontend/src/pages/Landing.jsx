import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './landing.css'; 

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">WELCOME!</h1>
      <div className="landing-logo">
        <img
          src="/src/assets/ecowalletlogo.png" 
          alt="Thrift Trail Logo"
          className="logo-image"
        />
      </div>
      <div className="landing-buttons">
        <button className="login-btn" onClick={() => navigate("/login")}>LOG IN</button>
        <button className="signup-btn" onClick={() => navigate("/register")}>SIGN UP</button>
      </div>
    </div>
  );
};

export default Landing;