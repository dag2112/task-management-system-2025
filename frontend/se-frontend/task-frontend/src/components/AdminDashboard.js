"use client";
import { useEffect, useState } from "react";
import {
    getAllTasks,
    createTask,
    getAllUsers,
    assignTask
} from "../services/adminServices";
import UserManagement from "./UserManagement";

export default function AdminDashboard() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [priority, setPriority] = useState("MEDIUM");
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("tasks");

    // ✅ Pagination & Sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [sortBy, setSortBy] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const tasksRes = await getAllTasks();
            const usersRes = await getAllUsers();
            setTasks(tasksRes.data || []);
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error("Failed to load data:", error);
            alert("Failed to load data");
        }
    };

    const submitTask = async () => {
        if (!title.trim()) {
            alert("Please enter a task title");
            return;
        }

        try {
            await createTask({ title, description, status, priority });
            alert("✅ Task created successfully!");
            setTitle("");
            setDescription("");
            setStatus("TODO");
            setPriority("MEDIUM");
            loadData();
        } catch (error) {
            alert("❌ Failed to create task");
        }
    };

    const handleAssign = async (taskId, userId) => {
        if (!userId) return;
        try {
            await assignTask(taskId, userId);
            alert("✅ Task assigned successfully!");
            loadData();
        } catch (error) {
            alert("❌ Failed to assign task");
        }
    };

    if (!mounted) return null;

    // ✅ SORTING
    const sortedTasks = [...tasks].sort((a, b) => {
        const aVal = a?.[sortBy] || "";
        const bVal = b?.[sortBy] || "";
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // ✅ PAGINATION
    const totalPages = Math.ceil(sortedTasks.length / pageSize);
    const paginatedTasks = sortedTasks.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>👑 Admin Dashboard</h1>
                    <p style={styles.subtitle}>
                        Manage tasks, users, and assignments from one place
                    </p>
                </div>

                {/* Tabs */}
                <div style={styles.tabsContainer}>
                    {["tasks", "users", "assignments"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                ...styles.tabButton,
                                ...(activeTab === tab ? styles.activeTab : {})
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div style={styles.tabContent}>
                    {activeTab === "tasks" && (
                        <>
                            {/* CREATE TASK */}
                            <div style={styles.formSection}>
                                <h2 style={styles.sectionTitle}>Create New Task</h2>

                                <div style={styles.formGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Title *</label>
                                        <input
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            style={styles.input}
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Status</label>
                                        <select
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                            style={styles.select}
                                        >
                                            <option value="TODO">TODO</option>
                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Priority</label>
                                        <select
                                            value={priority}
                                            onChange={e => setPriority(e.target.value)}
                                            style={styles.select}
                                        >
                                            <option value="LOW">LOW</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HIGH">HIGH</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows="3"
                                        style={styles.textarea}
                                    />
                                </div>

                                <button onClick={submitTask} style={styles.createButton}>
                                    Create Task
                                </button>
                            </div>

                            {/* SORT + PAGE CONTROLS */}
                            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="title">Title</option>
                                    <option value="priority">Priority</option>
                                    <option value="status">Status</option>
                                </select>

                                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>

                                <select
                                    value={pageSize}
                                    onChange={e => {
                                        setPageSize(+e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={6}>6</option>
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                </select>
                            </div>

                            {/* TASK LIST */}
                            <div style={styles.tasksGrid}>
                                {paginatedTasks.map(task => (
                                    <div key={task.id} style={styles.taskCard}>
                                        <div style={styles.taskHeader}>
                                            <h3 style={styles.taskTitle}>{task.title}</h3>
                                            <span
                                                style={{
                                                    ...styles.priorityBadge,
                                                    ...(task.priority === "HIGH"
                                                        ? styles.priorityHigh
                                                        : task.priority === "MEDIUM"
                                                            ? styles.priorityMedium
                                                            : styles.priorityLow)
                                                }}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>

                                        <p style={styles.taskDescription}>
                                            {task.description || "No description"}
                                        </p>

                                        <div style={styles.taskFooter}>
                                            <span
                                                style={{
                                                    ...styles.statusBadge,
                                                    ...(task.status === "DONE"
                                                        ? styles.statusDone
                                                        : task.status === "IN_PROGRESS"
                                                            ? styles.statusInProgress
                                                            : styles.statusTodo)
                                                }}
                                            >
                                                {task.status}
                                            </span>
                                            <span style={styles.taskId}>ID: {task.id}</span>
                                        </div>

                                        <div style={styles.assignSection}>
                                            <label style={styles.assignLabel}>Assign to Worker</label>
                                            <select
                                                onChange={e => handleAssign(task.id, e.target.value)}
                                                style={styles.assignSelect}
                                            >
                                                <option value="">Select worker</option>
                                                {users
                                                    .filter(u => u.role === "WORKER")
                                                    .map(u => (
                                                        <option key={u.id} value={u.id}>
                                                            {u.username}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION */}
                            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    Prev
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === "users" && <UserManagement />}

                    {activeTab === "assignments" && (
                        <div>
                            {tasks
                                .filter(t => t.assignedTo)
                                .map(t => (
                                    <div key={t.id}>
                                        {t.title} →{" "}
                                        {users.find(u => u.id === t.assignedTo)?.username || "Unknown"}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ✅ ALL ORIGINAL CSS — UNCHANGED */
const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "16px 24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    content: { maxWidth: "1200px", margin: "0 auto" },
    header: { marginBottom: "32px" },
    title: { fontSize: "32px", fontWeight: "bold", color: "#1f2937" },
    subtitle: { color: "#6b7280" },
    tabsContainer: { display: "flex", gap: "6px", marginBottom: "24px" },
    tabButton: { padding: "10px 14px", cursor: "pointer", border: "none" },
    activeTab: { borderBottom: "2px solid #2563eb" },
    tabContent: { background: "white", padding: "24px", borderRadius: "12px" },
    formSection: { marginBottom: "40px" },
    sectionTitle: { fontSize: "20px", fontWeight: "600" },
    formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" },
    formGroup: { marginBottom: "16px" },
    label: { fontSize: "14px", fontWeight: "500" },
    input: { width: "100%", padding: "10px" },
    select: { width: "100%", padding: "10px" },
    textarea: { width: "100%", padding: "10px" },
    createButton: { marginTop: "12px", padding: "12px", backgroundColor: "#059669", color: "white", border: "none" },
    tasksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" },
    taskCard: { border: "1px solid #e5e7eb", padding: "16px", borderRadius: "8px" },
    taskHeader: { display: "flex", justifyContent: "space-between" },
    taskTitle: { fontSize: "16px", fontWeight: "500" },
    priorityBadge: { padding: "4px 8px", borderRadius: "4px" },
    priorityHigh: { backgroundColor: "#fee2e2", color: "#dc2626" },
    priorityMedium: { backgroundColor: "#fef3c7", color: "#d97706" },
    priorityLow: { backgroundColor: "#d1fae5", color: "#059669" },
    taskDescription: { color: "#6b7280", marginBottom: "12px" },
    taskFooter: { display: "flex", justifyContent: "space-between" },
    statusBadge: { padding: "4px 8px", borderRadius: "4px" },
    statusDone: { backgroundColor: "#d1fae5", color: "#059669" },
    statusInProgress: { backgroundColor: "#dbeafe", color: "#2563eb" },
    statusTodo: { backgroundColor: "#f3f4f6", color: "#6b7280" },
    taskId: { fontSize: "12px", color: "#9ca3af" },
    assignSection: { marginTop: "12px" },
    assignLabel: { fontSize: "12px" },
    assignSelect: { width: "100%", padding: "6px" }
};
