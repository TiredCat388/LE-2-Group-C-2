import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import logoImage from '../assets/ecowalletlogo.png';
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      alert("Passwords don't match!");
      return;
    }

    fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, password: password1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      })
      .catch((err) => console.error('Signup error:', err));
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="branding">
          <img src={logoImage} alt="thrift trail logo" className="logo-image" />
        </div>
      </div>

      <div className="right-panel">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <h1>Signup</h1>

          <input
            type="text"
            name="register_username"
            placeholder="Username"
            aria-label="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            id="email"
            type="email"
            name="register_email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-container">
            <input
              type={showPassword1 ? 'text' : 'password'}
              placeholder="Password"
              className="password-input"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
            {password1 && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? <IoEyeSharp /> : <FaRegEyeSlash />}
              </span>
            )}
          </div>

          <div className="password-input-container">
            <input
              type={showPassword2 ? 'text' : 'password'}
              placeholder="Re-type Password"
              className="password-input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            {password2 && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <IoEyeSharp /> : <FaRegEyeSlash />}
              </span>
            )}
          </div>

          <button type="submit">SIGN UP</button>

          <p className="signup-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
