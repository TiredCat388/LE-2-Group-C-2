import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { entriesApi } from "../utils/api";
import Navbar from "../components/navbar";
import "./Categorydeets.css";

const CategoryDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state;
  const [entries, setEntries] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); 
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await entriesApi.getEntriesByCategory(category.category);
        const data = response.data;
        const filteredData = data.filter((entry) => entry.type === "expense");
        setEntries(filteredData);

        const total = filteredData.reduce((sum, entry) => sum + Number(entry.amount), 0);
        setTotalSpent(total);
      } catch (error) {
        console.error("Failed to fetch entries", error);
      }
    };

    if (category) {
      fetchEntries();
    }
  }, [category.category]);

  if (!category) return <p className="no-data">No data found.</p>;

  const handleAddClick = () => {
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await entriesApi.createEntry({
        title,
        type: "expense",
        category: category.category,
        description,
        amount: parseFloat(amount),
        date,
      });
      handleCloseDrawer();

      // Re-fetch updated entries
      const response = await entriesApi.getEntriesByCategory(category.category);
      const data = response.data;
      const filteredData = data.filter((entry) => entry.type === "expense");
      setEntries(filteredData);
      const total = filteredData.reduce((sum, entry) => sum + Number(entry.amount), 0);
      setTotalSpent(total);

      // Reset form
      setTitle("");
      setDescription("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Failed to add entry", error);
    }
  };

  return (
    <div className="category-page">
      <Navbar />
      <div className="category-container">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate("/categories")}>
            Categories
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{category.title}</span>
        </div>

        <div className="category-header">
          <img src={category.image} alt={category.title} className="category-image" />
          <div className="category-info">
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">
              Your monthly limit for <span>{category.category}</span> is <span>₱{category.limit}</span>, and you have spent <span>₱{totalSpent}</span>.
            </p>
            <div className="budget-section">
              <label>Budget Remaining</label>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min((totalSpent / category.limit) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="budget-amount">₱{(category.limit - totalSpent).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="expenses-header">
          <h3>Expenses</h3>
          <input type="text" placeholder="Search" className="search-input" />
          <button className="add-button" onClick={handleAddClick}>
            <span className="plus-icon">＋</span> Add
          </button>
        </div>
        <div className="expenses-section">
          <div className="expenses-table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Expense</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.title}</td>
                    <td>₱{entry.amount}</td>
                    <td>{entry.date}</td>
                  </tr>
                ))}
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
        <form className="drawer-form" onSubmit={handleSubmit}>
          <label>Category</label>
          <input type="text" placeholder="Category" disabled value={category.category} />
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Amount</label>
          <div className="input-group">
            <span className="currency-prefix">₱</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="drawer-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCloseDrawer}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showDrawer && <div className="drawer-backdrop" onClick={handleCloseDrawer}></div>}
    </div>
  );
};

export default CategoryDetail;
