import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://localhost:8081/api";
const PAGE_SIZE = 5;

const TaskAssignment = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // SORT & PAGINATION
  const [sortField, setSortField] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/user/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/tasks/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unassigned = res.data.filter((t) => !t.assignedUser);
      setTasks(unassigned);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // ================= ASSIGN =================
  const assignTask = async () => {
    if (!selectedUserId || !selectedTaskId) {
      toast.warning("Please select both task and user");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/tasks/assign`,
        { taskId: selectedTaskId, userId: selectedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Task assigned successfully");
      setSelectedTaskId(null);
      setSelectedUserId(null);
      fetchTasks();
    } catch {
      toast.error("Failed to assign task");
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // ================= FILTER + SORT =================
  useEffect(() => {
    let data = [...tasks];

    if (filterTitle) {
      data = data.filter((t) =>
        t.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    if (filterCategory) {
      data = data.filter((t) =>
        (t.categoryName || "")
          .toLowerCase()
          .includes(filterCategory.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setFilteredTasks(data);
    setPage(1);
  }, [tasks, filterTitle, filterCategory, sortField, sortDir]);

  // ================= PAGINATION =================
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-extrabold text-white">
            Task Assignment
          </h1>
          <p className="text-sm text-slate-400">
            Assign unassigned tasks to users
          </p>
        </div>

        {/* ASSIGN CARD */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6 border border-slate-700">

          {/* Task Selector */}
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-slate-300">
              Task
            </label>
            <button
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-slate-700 text-white"
            >
              {selectedTask
                ? `${selectedTask.title} · ${selectedTask.categoryName || "No Category"}`
                : "Select Task"}
              ▾
            </button>

            {showTaskDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-slate-800 rounded-xl border border-slate-700 max-h-64 overflow-y-auto">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setShowTaskDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer"
                  >
                    <p className="font-semibold text-white">{t.title}</p>
                    <span className="text-xs text-slate-400">
                      {t.categoryName || "No Category"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Selector */}
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-slate-300">
              User
            </label>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-slate-700 text-white"
            >
              {selectedUser ? selectedUser.username : "Select User"} ▾
            </button>

            {showUserDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-slate-800 rounded-xl border border-slate-700 max-h-64 overflow-y-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setShowUserDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer text-white"
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={assignTask}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
          >
            Assign Task
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-slate-800 rounded-2xl p-4 flex gap-4 border border-slate-700">
          <input
            placeholder="Filter by title..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-700 text-white"
          />
          <input
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-700 text-white"
          />
        </div>

        {/* TABLE */}
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          <table className="min-w-full">
            <thead className="bg-slate-700">
              <tr>
                <th
                  onClick={() => toggleSort("title")}
                  className="px-6 py-3 text-left text-sm text-white cursor-pointer"
                >
                  Title ⬍
                </th>
                <th className="px-6 py-3 text-left text-sm text-white">
                  Description
                </th>
                <th
                  onClick={() => toggleSort("categoryName")}
                  className="px-6 py-3 text-left text-sm text-white cursor-pointer"
                >
                  Category ⬍
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-700">
                  <td className="px-6 py-4 text-white font-semibold">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {task.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-blue-400">
                    {task.categoryName || "No Category"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskAssignment;
