import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Budget.css";

function BudgetTab() {
  const [budgetLimits, setBudgetLimits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [newImage, setNewImage] = useState(null);
  
  
  const totalAdded = budgetLimits.reduce(
    (sum, item) => sum + Number(item.limit),
    0
  );


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

    const userName = localStorage.getItem("userName");

    if (!userName) {
      alert("User is not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("category", newCategory);
    formData.append("limit", newLimit);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: {
          username: String(userName),
        },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const newCategoryData = await response.json();
        setBudgetLimits((prevLimits) => [...prevLimits, newCategoryData]);

        setNewCategory("");
        setNewLimit("");
        setNewImage(null);
        setShowForm(false);
      } else {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        alert(`Failed to add category: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("An error occurred: " + error.message);
    }
  };

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
                <td>${item.limit}</td>
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
                />
              </div>

              <label>Category Image</label>
              <input
                type="file"
                accept="image/*"
                className="image-upload"
                onChange={(e) => setNewImage(e.target.files[0])}
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
