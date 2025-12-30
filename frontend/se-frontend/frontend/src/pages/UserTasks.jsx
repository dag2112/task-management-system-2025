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
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-6">My Tasks</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Title</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 text-left font-semibold">Category</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Comments</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{t.title}</td>
                  <td className="px-4 py-2">{t.description || "-"}</td>
                  <td className="px-4 py-2">{t.categoryName || "-"}</td>

                  <td className="px-4 py-2">
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) =>
                        updateStatus(t.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded border 
                        ${t.status === "COMPLETED" ? "bg-green-100" : ""}
                        ${t.status === "IN_PROGRESS" ? "bg-yellow-100" : ""}
                      `}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>

                  {/* 🔹 COMMENT BUTTON */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => navigate(`/comments/${t.id}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View / Add
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No tasks assigned
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTasks;
