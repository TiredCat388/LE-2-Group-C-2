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
  const [categoryToUpdate, setCategoryToUpdate] = useState(null); // Add state to store the category to be updated

  useEffect(() => {
    fetchBudgetCategories();
  }, []);

  const fetchBudgetCategories = async () => {
    try {
      setLoading(true);
      const response = await budgetApi.getCategories();
      setBudgetLimits(response.data);
      const total = response.data.reduce(
        (sum, item) => sum + parseFloat(item.limit),
        0
      );
      setMonthlyBudget(total);
    } catch (err) {
      setError("Failed to fetch budget categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => setShowForm(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newCategory && newLimit) {
      try {
        const formData = {
          category: newCategory,
          limit: parseFloat(newLimit),
          image: newImage,
        };

        if (categoryToUpdate) {
          // If updating, just update the existing category
          await budgetApi.updateCategory(categoryToUpdate.id, formData);
          setCategoryToUpdate(null); // Clear the category to update
        } else {
          // If adding a new category, create a new one
          await budgetApi.createCategory(formData);
        }

        // Refresh categories
        await fetchBudgetCategories();

        // Reset the form
        setNewCategory("");
        setNewLimit("");
        setNewImage(null);
        setShowForm(false);
      } catch (err) {
        setError("Failed to save category");
        console.error(err);
      }
    }
  };



  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpdate = (item) => {
    setCategoryToUpdate(item); // Store the category to update
    setNewCategory(item.category);
    setNewLimit(item.limit);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    try {
      await budgetApi.deleteCategory(item.id); // Make sure item has id
      await fetchBudgetCategories();
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
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
        <div className="monthly-budget-box">
          <p>Monthly Budget Allowance</p>
          <h1>${monthlyBudget.toLocaleString()}</h1>
        </div>

        <div className="budget-header">
          <h3>Budget Limits</h3>
          <button className="add-category-btn" onClick={handleAddCategory}>
            + Add Category
          </button>
        </div>

        <table className="budget-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Monthly Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetLimits.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.category}</td>
                <td>₱{parseFloat(item.limit).toLocaleString()}</td>
                <td>
                  <button
                    className="action-btn update"
                    onClick={() => handleUpdate(item)}
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </td>
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
                <span className="currency-prefix">₱</span>
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
