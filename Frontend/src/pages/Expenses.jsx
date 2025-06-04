import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Expenses.css";
import { entriesApi, budgetApi } from "../utils/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState(""); 
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    date: "",
    type: "expense",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, []);

  useEffect(() => { 
    const filtered = expenses.filter((expense) => {
      const matchesSearch = Object.values(expense).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesFilter =
        !filterOption ||
        (filterOption === "amount" && expense.amount) ||
        (filterOption === "date" && expense.date) ||
        (filterOption === "category" && expense.category);

      return matchesSearch && matchesFilter;
    });

    setFilteredExpenses(filtered);
  }, [searchQuery, filterOption, expenses]);

  const fetchCategories = async () => {
    try {
      const response = await budgetApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await entriesApi.getEntries();
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      setError("Failed to fetch entries");
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => setShowForm(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await entriesApi.createEntry(newExpense);
      await fetchEntries();
      setNewExpense({
        title: "",
        amount: "",
        date: "",
        type: "expense",
        category: "",
        description: "",
      });
      setShowForm(false);
    } catch (error) {
      setError("Failed to add entry");
      console.error("Error adding entry:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await entriesApi.deleteEntry(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      setError("Failed to delete entry");
      console.error("Error deleting entry:", error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <h1>Expenses by Category</h1>
      <div className="header">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  
        />
        <select
          className="sort-select"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)} 
        >
          <option value="">Filter</option>
          <option value="amount">Year</option>
          <option value="date">Month</option>
          <option value="category">Category</option>
        </select>
        <button onClick={handleAddExpense} className="add-expense-btn">
          + Add Entry
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>₱{parseFloat(e.amount).toLocaleString()}</td>
              <td>{e.date}</td>
              <td>{e.type}</td>
              <td>{e.category}</td>
              <td>{e.description}</td>
              <td>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="delete-btn"
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
          <button className="close-btn" onClick={() => setShowForm(false)}>
            &times;
          </button>
          <h2>Add Entry</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={newExpense.title}
              onChange={(e) =>
                setNewExpense({ ...newExpense, title: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              required
              step="0.01"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              required
            />
            <select
              value={newExpense.type}
              onChange={(e) =>
                setNewExpense({ ...newExpense, type: e.target.value })
              }
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            ></textarea>
            <button type="submit" className="submit-btn">
              Add Entry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
