import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://localhost:8081/api";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-300 flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // Stats
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  const barData = [
    {
      name: "Tasks",
      Pending: pending,
      "In Progress": inProgress,
      Completed: completed,
    },
  ];

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-extrabold text-blue-400">
          Admin Dashboard
        </h1>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Pie Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Task Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
             <PieChart>
  <Pie
    data={pieData}
    dataKey="value"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label={({ name, percent }) =>
      `${name} ${(percent * 100).toFixed(0)}%`
    }
    labelStyle={{
      fill: "#e5e7eb", // light gray text
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {pieData.map((_, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>

  <Tooltip
    contentStyle={{
      backgroundColor: "#020617",
      border: "1px solid #334155",
      color: "#e5e7eb",
    }}
  />

  <Legend
    wrapperStyle={{
      color: "#e5e7eb", // legend text visible
      fontSize: 14,
    }}
  />
</PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Task Status Count
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #334155",
                    color: "#e5e7eb",
                  }}
                />
                <Legend />
                <Bar dataKey="Pending" fill="#facc15" />
                <Bar dataKey="In Progress" fill="#3b82f6" />
                <Bar dataKey="Completed" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-yellow-400">
              Pending
            </h3>
            <p className="text-3xl font-bold">{pending}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-blue-400">
              In Progress
            </h3>
            <p className="text-3xl font-bold">{inProgress}</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold text-green-400">
              Completed
            </h3>
            <p className="text-3xl font-bold">{completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
