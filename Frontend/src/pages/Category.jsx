import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import Navbar from "../components/navbar";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from backend
    fetch("http://127.0.0.1:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleClick = (category) => {
    navigate(`/category/${category.category}`, { state: category });
  };

  return (
    <div className="categories-page">
      <header className="categories-header">
        <Navbar />
      </header>

      <div className="categories-month">
        November 2022
        <div>
          <button onClick={() => navigate("/summary")}>Select Month</button>
        </div>
      </div>

      <div className="categories-container">
        <h2 className="categories-title">Expenses for the Month</h2>

        <div className="categories-search">
          <input type="text" placeholder="Search" />
        </div>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div
              className="category-card"
              key={index}
              onClick={() => handleClick(cat)}
            >
              <img
                src={
                  cat.image
                    ? cat.image
                    : "http://localhost:8000/media/budget_images"
                }
                alt={cat.category}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "http://localhost:8000/media/budget_images"; // Fallback image
                }}
              />
              <div className="info">
                <h3>{cat.category}</h3>
                <p>${cat.limit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
