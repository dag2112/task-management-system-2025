import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const PAGE_SIZES = [5, 10, 20];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== SORT & PAGINATION ===== */
  const [sortBy, setSortBy] = useState("date"); // date | seen
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://localhost:8081/api/notifications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data || []);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  /* ===== SORT LOGIC ===== */
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "date") {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else {
        // seen: unread first
        aVal = a.seen ? 1 : 0;
        bVal = b.seen ? 1 : 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [notifications, sortBy, sortDir]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(sortedNotifications.length / pageSize);

  const paginatedNotifications = sortedNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-300 flex items-center justify-center">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <h1 className="text-3xl font-extrabold text-blue-400 flex items-center gap-2">
          🔔 Notifications
        </h1>

        {/* ===== CONTROLS ===== */}
        <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 text-gray-200 px-3 py-2 rounded border border-slate-700"
          >
            <option value="date">Sort by Date</option>
            <option value="seen">Unread First</option>
          </select>

          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-slate-900 text-gray-200 rounded border border-slate-700 hover:bg-slate-700"
          >
            {sortDir === "asc" ? "⬆ Asc" : "⬇ Desc"}
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900 text-gray-200 px-3 py-2 rounded border border-slate-700"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>

        {/* ===== LIST ===== */}
        {paginatedNotifications.length === 0 ? (
          <div className="text-gray-400 text-center bg-slate-800 p-6 rounded-lg border border-slate-700">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-xl border transition ${
                  n.seen
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-800/80 border-blue-500 shadow-md shadow-blue-500/10"
                }`}
              >
                <p
                  className={`font-semibold ${
                    n.seen ? "text-gray-300" : "text-blue-400"
                  }`}
                >
                  {n.message}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

                {!n.seen && (
                  <span className="inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
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
}
