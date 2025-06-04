import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import Navbar from "../components/navbar";
import { budgetApi } from "../utils/api";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (category) => {
    navigate(`/category/₱{category.category}`, { state: category });
  };

  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="categories-page">
        <header className="categories-header">
          <Navbar />
        </header>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page">
        <header className="categories-header">
          <Navbar />
        </header>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <header className="categories-header">
        <Navbar />
      </header>

      <div className="categories-month">
        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        <div>
          <button onClick={() => navigate("/summary")}>Select Month</button>
        </div>
      </div>

      <div className="categories-container">
        <h2 className="categories-title">Expenses for the Month</h2>

        <div className="categories-search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="categories-grid">
          {filteredCategories.map((cat, index) => (
            <div
              className="category-card"
              key={index}
              onClick={() => handleClick(cat)}
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.category} />
              ) : (
                <div className="category-placeholder">
                  {cat.category.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="info">
                <h3>{cat.category}</h3>
                <p>₱{parseFloat(cat.limit).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
