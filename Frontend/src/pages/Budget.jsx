import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Budget.css";
import { budgetApi } from "../utils/api";

function BudgetTab() {
  const [budgetLimits, setBudgetLimits] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchBudgetCategories();
  }, []);

  const fetchBudgetCategories = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getCategories();
      setBudgetLimits(response.data);
      // Calculate total monthly budget
      const total = response.data.reduce((sum, item) => sum + parseFloat(item.limit), 0);
      setMonthlyBudget(total);
    } catch (err) {
      setError("Failed to fetch budget categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend on mount
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    fetch("http://127.0.0.1:8000/api/categories/", {
      headers: {
        username: String(userName),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBudgetLimits(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleAddCategory = () => setShowForm(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newCategory && newLimit) {
      try {
        const formData = {
          category: newCategory,
          limit: parseFloat(newLimit),
          image: newImage
        };

        await budgetApi.createCategory(formData);
        await fetchBudgetCategories(); // Refresh the list

        // Reset form fields
        setNewCategory("");
        setNewLimit("");
        setNewImage(null);
        setShowForm(false);
      } catch (err) {
        setError("Failed to create new category");
        console.error(err);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="budget-tab">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="budget-tab">
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="budget-tab">
      <Navbar />
      <div className="budget-container">
        <h2>Budget and Spending Tracker</h2>

        <div className="monthly-budget-box">
          <p>Monthly Budget Allowance</p>
          <h1>${totalAdded.toLocaleString()}</h1>
        </div>
        <div className="budget-header">
          <h3>Budget Limits</h3>
          <button className="add-entry-btn" onClick={handleAddCategory}>
            + Add Category
          </button>
        </div>

        <table className="budget-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Monthly Limit</th>
            </tr>
          </thead>
          <tbody>
            {budgetLimits.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.category}</td>
                <td>${parseFloat(item.limit).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="side-panel">
            <div className="form-header">
              <h2>Add Category</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                &times;
              </button>
            </div>
            <form
              onSubmit={handleFormSubmit}
              encType="multipart/form-data"
              className="form-body"
            >
              <label>Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                required
              />

              <label>Monthly Limit</label>
              <div className="input-group">
                <span className="currency-prefix">$</span>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  placeholder="0.00"
                  required
                  step="0.01"
                />
              </div>

              <label>Category Image</label>
              <input
                type="file"
                accept="image/*"
                className="image-upload"
                onChange={handleImageChange}
              />

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetTab;
