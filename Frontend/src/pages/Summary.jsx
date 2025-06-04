import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/navbar";
import "./Summary.css"; // Custom styles
import { entriesApi } from "../utils/api";

function App() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [entries, setEntries] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, [month]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await entriesApi.getEntries();
      setEntries(response.data);
      processData(response.data);
    } catch (error) {
      setError("Failed to fetch entries");
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (entries) => {
    // Filter entries for the selected month
    const monthEntries = entries.filter((entry) =>
      entry.date.startsWith(month)
    );

    // Calculate summary data
    const totalExpenses = monthEntries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

    const totalIncome = monthEntries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

    const savings = totalIncome - totalExpenses;

    setSummaryData([
      { label: "Monthly Expenses", value: `₱${totalExpenses.toFixed(2)}` },
      { label: "Monthly Income", value: `₱${totalIncome.toFixed(2)}` },
      { label: "Monthly Savings", value: `₱${savings.toFixed(2)}` },
      {
        label: "Savings Rate",
        value:
          totalIncome === 0
            ? "0%"
            : `${((savings / totalIncome) * 100).toFixed(1)}%`,
      },
    ]);

    // Process pie chart data (expenses by category)
    const categoryTotals = {};
    monthEntries
      .filter((entry) => entry.type === "expense")
      .forEach((entry) => {
        categoryTotals[entry.category] =
          (categoryTotals[entry.category] || 0) + parseFloat(entry.amount);
      });

    const pieChartData = Object.entries(categoryTotals).map(
      ([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      })
    );

    setPieData(pieChartData);

    // Process line chart data (monthly trends)
    const monthlyData = {};
    entries.forEach((entry) => {
      const month = entry.date.slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (entry.type === "income") {
        monthlyData[month].income += parseFloat(entry.amount);
      } else {
        monthlyData[month].expenses += parseFloat(entry.amount);
      }
    });

    const lineChartData = Object.entries(monthlyData).map(([month, data]) => ({
      name: month,
      Income: data.income,
      Expenses: data.expenses,
      Savings: data.income - data.expenses,
    }));

    setLineData(lineChartData);

    // Process table data
    const tableChartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      expenses: `₱${data.expenses.toFixed(2)}`,
      savings: `₱${(data.income - data.expenses).toFixed(2)}`,
    }));

    setTableData(tableChartData);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AB47BC",
    "#26A69A",
    "#FFA726",
    "#EF5350",
    "#78909C",
    "#8D6E63",
  ];

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <div className="summary-container">
        <h1>Summary of Expenses</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-picker"
        />
        <div className="summary-cards">
          {summaryData.map((item, i) => (
            <div key={i} className="card">
              <div className="label">{item.label}</div>
              <div className="value">{item.value}</div>
            </div>
          ))}
        </div>
        {/* New row for charts and table side by side */}
        <div className="summary-content-row">
          <div className="charts">
            <div className="chart-box">
              <h2>Monthly Trends</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <LineChart width={500} height={260} data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Income"
                    stroke="#8884d8"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#82ca9d"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="Savings"
                    stroke="#ff6384"
                    animationDuration={1500}
                  />
                </LineChart>
              </div>
            </div>
            <div className="chart-box">
              <h2 className="chart-title">Spending Breakdown</h2>
              <div className="piechart-container">
                <div className="piechart-wrapper">
                  <ResponsiveContainer width={300} height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        onMouseEnter={(data, index) => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              hoveredIndex === null || hoveredIndex === index
                                ? COLORS[index % COLORS.length]
                                : "#ccc"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="piechart-legend">
                  {pieData.map((entry, i) => (
                    <div key={i} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      {entry.name} ${entry.value.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="table-section">
            <h2>Monthly Overview</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Expenses</th>
                  <th>Savings</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.month}</td>
                    <td>{row.expenses}</td>
                    <td>{row.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 