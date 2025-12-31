import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://localhost:8081/api";
const ROLES = ["USER", "ADMIN"];
const PAGE_SIZES = [5, 10, 20];

export default function AssignRole() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  /* 🔹 sorting */
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");

  /* 🔹 pagination */
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getAllUsers`, { headers });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const normalizeRole = (role) => role?.replace("ROLE_", "") || "USER";

  /* ================= SORT ================= */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /* ================= ACTIONS ================= */
  const changeRole = async (userId, role) => {
    try {
      await axios.put(`${BASE_URL}/user/assign-role`, { userId, role }, { headers });
      toast.success(`Role updated to ${role}`);
      loadUsers();
    } catch {
      toast.error("Permission denied or server error");
    }
  };

  const revokeRole = async (userId, role) => {
    try {
      await axios.put(`${BASE_URL}/user/revoke-role`, { userId, role }, { headers });
      toast.success(`Role ${role} revoked`);
      loadUsers();
    } catch {
      toast.error("Failed to revoke role");
    }
  };

  const toggleActivation = async (userId, isActive) => {
    try {
      await axios.put(`${BASE_URL}/user/toggle-activation/${userId}`, {}, { headers });
      toast[isActive ? "error" : "success"](
        isActive ? "User deactivated" : "User activated"
      );
      loadUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const resetPassword = async (userId) => {
    const oldPassword = prompt("Enter current password:");
    if (!oldPassword) return;
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      await axios.put(
        `${BASE_URL}/user/reset-password/${userId}`,
        { oldPassword, newPassword },
        { headers }
      );
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  /* ================= FILTER + SORT ================= */
  const processedUsers = useMemo(() => {
    let data = users.filter(u => {
      const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || normalizeRole(u.role) === roleFilter;
      return matchesSearch && matchesRole;
    });

    data.sort((a, b) => {
      const A = sortField === "role"
        ? normalizeRole(a.role)
        : a.username;
      const B = sortField === "role"
        ? normalizeRole(b.role)
        : b.username;

      return sortOrder === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });

    return data;
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(processedUsers.length / pageSize);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN": return "bg-red-900/40 text-red-300 border-red-700";
      default: return "bg-slate-800 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold">
            Access <span className="text-indigo-400">Control</span>
          </h2>
          <p className="text-slate-400 mt-2 text-lg">
            Manage user permissions, activation, and roles
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex flex-wrap gap-4 mb-8">
          <input
            placeholder="Search users..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>

          <select
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {PAGE_SIZES.map(s => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th
                  onClick={() => handleSort("username")}
                  className="px-8 py-5 cursor-pointer text-xs uppercase text-slate-400"
                >
                  User {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="px-8 py-5 cursor-pointer text-xs uppercase text-slate-400"
                >
                  Role {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-8 py-5 text-xs uppercase text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              {paginatedUsers.map(u => {
                const currentRole = normalizeRole(u.role);
                const isActive = u.active;

                return (
                  <tr key={u.id} className="hover:bg-slate-800">
                    <td className="px-8 py-6 font-bold">{u.username}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${getRoleStyle(currentRole)}`}>
                        {currentRole}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right flex gap-2 justify-end flex-wrap">
                      {/* ✅ BUTTONS NOT REMOVED */}
                      <select
                        value={currentRole}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-slate-800 px-2 py-1 rounded text-xs"
                      >
                        {ROLES.map(r => <option key={r}>Assign {r}</option>)}
                      </select>

                      <button
                        onClick={() => toggleActivation(u.id, isActive)}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          isActive ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => resetPassword(u.id)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs font-bold"
                      >
                        Reset PW
                      </button>

                      <button
                        onClick={() => revokeRole(u.id, currentRole)}
                        className="bg-slate-700 px-3 py-1 rounded text-xs font-bold"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-slate-400">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
