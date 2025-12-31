import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://localhost:8081/api";

const Task = () => {
  // ================= STATES =================
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Task creation
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskCategoryId, setTaskCategoryId] = useState("");

  // Category creation
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  // Task editing
  const [editingTask, setEditingTask] = useState(null);

  // Filters
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/list-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  // ================= CATEGORY CREATE =================
  const createCategory = async () => {
    if (!categoryName) return toast.warning("Category name required");
    try {
      await axios.post(
        `${BASE_URL}/categories/create-categories`,
        { name: categoryName, description: categoryDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category created");
      setCategoryName("");
      setCategoryDesc("");
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  // ================= TASK CREATE =================
  const createTask = async () => {
    if (!taskTitle) return toast.warning("Task title required");
    try {
      await axios.post(
        `${BASE_URL}/tasks/create`,
        {
          title: taskTitle,
          description: taskDesc,
          dueDate: taskDueDate || null,
          categoryId: taskCategoryId || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task created");
      setTaskTitle("");
      setTaskDesc("");
      setTaskDueDate("");
      setTaskCategoryId("");
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  // ================= TASK UPDATE =================
  const updateTask = async () => {
    try {
      await axios.put(
        `${BASE_URL}/tasks/update/${editingTask.id}`,
        {
          title: editingTask.title,
          description: editingTask.description,
          dueDate: editingTask.dueDate || null,
          categoryId: editingTask.categoryId || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task updated");
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  // ================= TASK DELETE =================
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${BASE_URL}/tasks/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // ================= FILTERED TASKS =================
  const filteredTasks = tasks
    .filter((t) => (filterStatus === "ALL" ? true : t.status === filterStatus))
    .filter((t) =>
      t.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .filter((t) =>
      (t.categoryName || "")
        .toLowerCase()
        .includes(filterCategory.toLowerCase())
    );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= STATUS STYLE =================
  const statusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-900/40 text-green-400";
      case "IN_PROGRESS":
        return "bg-yellow-900/40 text-yellow-400";
      default:
        return "bg-gray-700/40 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-6 space-y-10">
      <ToastContainer position="top-right" theme="dark" />

      {/* ================= CATEGORY CREATE ================= */}
      <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          Create Category
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <input
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            placeholder="Description"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
          />
        </div>
        <button
          onClick={createCategory}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white"
        >
          Create Category
        </button>
      </section>

      {/* ================= TASK CREATE ================= */}
      <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          Create Task
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            placeholder="Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            placeholder="Description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
          <input
            type="date"
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <select
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
            value={taskCategoryId}
            onChange={(e) => setTaskCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={createTask}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white"
        >
          Create Task
        </button>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-4">
        <input
          placeholder="Filter by title..."
          value={filterTitle}
          onChange={(e) => {
            setFilterTitle(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
        />
        <input
          placeholder="Filter by category..."
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </section>

      {/* ================= TASK LIST ================= */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-gray-300">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {displayedTasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-700/50">
                <td className="p-4">{t.title}</td>
                <td className="p-4">{t.categoryName || "-"}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      setEditingTask({
                        ...t,
                        categoryId: categories.find(
                          (c) => c.name === t.categoryName
                        )?.id,
                      })
                    }
                    className="bg-blue-600 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-600 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Task;
