import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Expenses.css";
import { fetchWithAuth } from "../utils/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    date: "",
    type: "expense",
    category: "",
    description: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/api/entries/');
      if (response) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleAddExpense = () => setShowForm(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth('http://localhost:8000/api/entries/', {
        method: 'POST',
        body: JSON.stringify(newExpense),
      });

      if (response) {
        const data = await response.json();
        setExpenses([...expenses, data]);
        setNewExpense({
          title: "",
          amount: "",
          date: "",
          type: "expense",
          category: "",
          description: "",
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/entries/${id}/`, {
        method: 'DELETE',
      });

      if (response && response.status === 204) {
        setExpenses(expenses.filter(expense => expense.id !== id));
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Expenses by Category</h1>
      <div className="header">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          style={{ marginLeft: "0"}}
        />
        <select className="sort-select">
          <option value="">Filter</option>
          <option value="amount">Year</option>
          <option value="date">Month</option>
          <option value="category">Category</option>
        </select>
        <button onClick={handleAddExpense} className="add-expense-btn">+ Add Entry</button>
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
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>${e.amount}</td>
              <td>{e.date}</td>
              <td>{e.type}</td>
              <td>{e.category}</td>
              <td>{e.description}</td>
              <td>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
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
              onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              required
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              required
            />
            <select
              value={newExpense.type}
              onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
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
