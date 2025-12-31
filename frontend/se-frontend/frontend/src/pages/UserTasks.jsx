import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://localhost:8081/api";

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      setUpdatingId(taskId);

      await axios.put(
        `${BASE_URL}/tasks/status/${taskId}?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );

      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBg = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-600 text-white";
      case "IN_PROGRESS":
        return "bg-yellow-500 text-black";
      default:
        return "bg-slate-700 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-400">
          📋 My Tasks
        </h2>

        <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-700 text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Comments
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-700/50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-100">
                      {t.title}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {t.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {t.categoryName || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        disabled={updatingId === t.id}
                        onChange={(e) =>
                          updateStatus(t.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-lg border border-slate-600 focus:outline-none ${statusBg(
                          t.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">
                          IN PROGRESS
                        </option>
                        <option value="COMPLETED">
                          COMPLETED
                        </option>
                      </select>
                    </td>

                    {/* COMMENTS */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/comments/${t.id}`)
                        }
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        View / Add
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-400"
                  >
                    No tasks assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTasks;
