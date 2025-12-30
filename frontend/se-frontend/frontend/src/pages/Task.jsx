import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:8081/api";

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
    .filter((t) => t.title.toLowerCase().includes(filterTitle.toLowerCase()))
    .filter((t) =>
      (t.categoryName || "").toLowerCase().includes(filterCategory.toLowerCase())
    );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= STATUS BADGE STYLE =================
  const statusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "PENDING":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= RENDER =================
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= CATEGORY CREATE ================= */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create Category</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            className="border px-4 py-2 rounded-lg"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <input
            type="text"
            className="border px-4 py-2 rounded-lg"
            placeholder="Description"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
          />
        </div>
        <button
          onClick={createCategory}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Category
        </button>
      </section>

      {/* ================= TASK CREATE ================= */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create Task</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="border px-4 py-2 rounded-lg"
            placeholder="Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            className="border px-4 py-2 rounded-lg"
            placeholder="Description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
          <input
            type="date"
            className="border px-4 py-2 rounded-lg"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded-lg"
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
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Create Task
        </button>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Filter by title..."
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Filter by category..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg"
        />
        <select
          className="border px-4 py-2 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </section>

      {/* ================= TASK LIST ================= */}
      <section className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayedTasks.length > 0 ? (
              displayedTasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{t.title}</td>
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
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 border rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ================= EDIT MODAL ================= */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
            <h3 className="text-xl font-bold">Edit Task</h3>

            <input
              className="border px-4 py-2 rounded-lg w-full"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />
            <input
              className="border px-4 py-2 rounded-lg w-full"
              value={editingTask.description || ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            />
            <input
              type="date"
              className="border px-4 py-2 rounded-lg w-full"
              value={editingTask.dueDate || ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, dueDate: e.target.value })
              }
            />
            <select
              className="border px-4 py-2 rounded-lg w-full"
              value={editingTask.categoryId || ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, categoryId: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
