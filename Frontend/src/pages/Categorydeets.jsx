import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import "./Categorydeets.css";

const CategoryDetail = () => {
  const { id } = useParams(); // category ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(location.state || null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    if (!category) {
      const fetchCategory = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/budgets/${id}/`
          );
          const data = await response.json();
          setCategory(data);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

      fetchCategory();
    }
  }, [id, category]);

  if (!category) return <p className="no-data">No data found.</p>;

  const handleAddClick = () => setShowDrawer(true);
  const handleCloseDrawer = () => setShowDrawer(false);

  return (
    <div className="category-page">
      <Navbar />
      <div className="category-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span
            className="breadcrumb-link"
            onClick={() => navigate("/categories")}
          >
            Categories
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{category.category}</span>
        </div>

        {/* Header */}
        <div className="category-header">
          <img
            src={
              category.image ||
              "http://localhost:8000/media/budget_images/rent.jpg"
            }
            alt={category.category}
            className="category-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "http://localhost:8000/media/budget_images/rent.jpg";
            }}
          />
          <div className="category-info">
            <h2 className="category-title">{category.category}</h2>
            <p className="category-description">
              Your monthly limit for <span>{category.category}</span> is{" "}
              <span>${parseFloat(category.limit).toFixed(2)}</span>, and you
              have spent <span>${parseFloat(category.limit).toFixed(2)}</span>.
            </p>
            <div className="budget-section">
              <label>Budget Remaining</label>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span className="budget-amount">$0</span>
            </div>
          </div>
        </div>

        <div className="expenses-section">
          <div className="expenses-header">
            <h3>Expenses</h3>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="add-button" onClick={handleAddClick}>
              <span className="plus-icon">＋</span> Add
            </button>
          </div>

          <div className="expenses-table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Expense</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Apartment Rent</td>
                  <td>${parseFloat(category.limit).toFixed(2)}</td>
                  <td>11/21/2022</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`drawer ${showDrawer ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Add item</h2>
          <button onClick={handleCloseDrawer} className="drawer-close">
            ×
          </button>
        </div>
        <form className="drawer-form">
          <label>Category</label>
          <input type="text" disabled value={category.category} />
          <label>Description</label>
          <input type="text" placeholder="Description" />
          <label>Expense</label>
          <div className="input-group">
            <span className="currency-prefix">$</span>
            <input type="number" placeholder="0.00" />
          </div>
          <label>Date</label>
          <input type="date" />
          <div className="drawer-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCloseDrawer}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      {showDrawer && (
        <div className="drawer-backdrop" onClick={handleCloseDrawer}></div>
      )}
    </div>
  );
};

export default CategoryDetail;
