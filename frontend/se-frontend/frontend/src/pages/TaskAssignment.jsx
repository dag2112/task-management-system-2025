import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://localhost:8081/api";

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
      setFilteredTasks(unassigned);
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

  // ================= FILTER =================
  const handleFilter = () => {
    let filtered = tasks;

    if (filterTitle) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((t) =>
        (t.categoryName || "No Category")
          .toLowerCase()
          .includes(filterCategory.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  // Update filter automatically when input changes
  useEffect(() => {
    handleFilter();
  }, [filterTitle, filterCategory, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Task Assignment
          </h1>
          <p className="text-sm text-slate-500">
            Assign unassigned tasks to users
          </p>
        </div>

        {/* ================= ASSIGN CARD ================= */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 space-y-6 border">

          {/* Task Selector */}
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Task
            </label>
            <button
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl bg-white hover:ring-2 hover:ring-blue-500 transition"
            >
              {selectedTask
                ? `${selectedTask.title} · ${selectedTask.categoryName || "No Category"}`
                : "Select Task"}
              <span className="text-slate-400">▾</span>
            </button>

            {showTaskDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-64 overflow-y-auto">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setShowTaskDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                  >
                    <p className="font-semibold text-slate-800">{t.title}</p>
                    <span className="text-xs text-slate-500">
                      {t.categoryName || "No Category"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Selector */}
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              User
            </label>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl bg-white hover:ring-2 hover:ring-blue-500 transition"
            >
              {selectedUser ? selectedUser.username : "Select User"}
              <span className="text-slate-400">▾</span>
            </button>

            {showUserDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-64 overflow-y-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setShowUserDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assign Button */}
          <button
            onClick={assignTask}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            Assign Task
          </button>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-4 items-center border">
          <input
            type="text"
            placeholder="Filter by title..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              Unassigned Tasks
            </h3>
            <span className="text-sm text-slate-500">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredTasks.length ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {task.description || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {task.categoryName || "No Category"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 text-slate-500"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskAssignment;
