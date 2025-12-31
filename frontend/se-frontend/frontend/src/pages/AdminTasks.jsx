import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://localhost:8081/api";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  /* ================= SORT & PAGINATION STATE ================= */
  const [sortField, setSortField] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/tasks/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= SORT LOGIC ================= */
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortField, sortDir]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedTasks.length / pageSize);

  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-900/40 text-green-300";
      case "IN_PROGRESS":
        return "bg-yellow-900/40 text-yellow-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <h2 className="text-3xl font-bold text-gray-100">
          All Tasks
        </h2>

        {/* ================= CONTROLS ================= */}
        <div className="flex flex-wrap gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-800 text-gray-200 px-3 py-2 rounded border border-slate-700"
          >
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
            <option value="categoryName">Sort by Category</option>
          </select>

          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-slate-800 text-gray-200 rounded border border-slate-700 hover:bg-slate-700"
          >
            {sortDir === "asc" ? "⬆ Asc" : "⬇ Desc"}
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-800 text-gray-200 px-3 py-2 rounded border border-slate-700"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-hidden bg-slate-900 rounded-xl shadow-lg border border-slate-800">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/60 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-100">
                      {t.title}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {t.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {t.categoryName || "No Category"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {t.assignedToUsername || (
                        <span className="italic text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/comments/${t.id}`)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Comments
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-slate-800 text-gray-300 disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-slate-800 text-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
