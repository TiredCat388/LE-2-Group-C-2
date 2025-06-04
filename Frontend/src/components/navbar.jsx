import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ecologo.png";
import "./navbar.css";
import {
  FaTachometerAlt,
  FaChartPie,
  FaShoppingCart,
  FaThLarge,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("");
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  


  useEffect(() => {
    switch (location.pathname) {
      case "/summary":
        setActiveNav("review");
        break;
      case "/budget":
        setActiveNav("budget");
        break;
      case "/expenses":
        setActiveNav("expenses");
        break;
      case "/categories":
        setActiveNav("categories");
        break;
      default:
        setActiveNav("");
    }
  }, [location.pathname]);

  const handleNavClick = (icon) => {
    if (activeNav !== icon) {
      navigate(getRoute(icon));
    }
  };

  const getRoute = (icon) => {
    switch (icon) {
      case "review":
        return "/summary";
      case "budget":
        return "/budget";
      case "expenses":
        return "/expenses";
      case "categories":
        return "/categories";
      default:
        return "/";
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userName');
    navigate('/login');
  };


  return (
    <div className="navbar">
      <div className="navbar-title">
        <img src={logo} alt="Logo" className="logo" />
        EcoWallet
      </div>

      <div className="navbar-links">
        <div
          className={`nav-item ${activeNav === "review" ? "active" : ""}`}
          onClick={() => handleNavClick("review")}
        >
          <FaTachometerAlt />
          <span>Year in Review</span>
        </div>

        <div
          className={`nav-item ${activeNav === "budget" ? "active" : ""}`}
          onClick={() => handleNavClick("budget")}
        >
          <FaChartPie />
          <span>Budget</span>
        </div>

        <div
          className={`nav-item ${activeNav === "expenses" ? "active" : ""}`}
          onClick={() => handleNavClick("expenses")}
        >
          <FaShoppingCart />
          <span>Expenses</span>
        </div>

        <div
          className={`nav-item ${activeNav === "categories" ? "active" : ""}`}
          onClick={() => handleNavClick("categories")}
        >
          <FaThLarge />
          <span>Categories</span>
        </div>
      </div>

      <div className="navbar-profile">
        <div className="user-icon" onClick={toggleDropdown}>
          {userName && userName !== "undefined" && userName.trim() !== ""
            ? userName.charAt(0).toUpperCase()
            : "?"}
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-content">
              <span className="dropdown-username">{userName || "Guest"}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
