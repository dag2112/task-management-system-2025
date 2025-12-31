import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

export default function TaskComments() {
  const { taskId } = useParams();
  const token = localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH COMMENTS =================
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://localhost:8081/api/comments/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  // ================= ADD COMMENT =================
  const addComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `https://localhost:8081/api/comments/${taskId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE COMMENT =================
  const updateComment = async (id) => {
    if (!editingContent.trim()) return;

    try {
      await axios.put(
        `https://localhost:8081/api/comments/update/${id}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditingContent("");
      fetchComments();
    } catch {
      alert("Failed to update comment");
    }
  };

  // ================= DELETE COMMENT =================
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(
        `https://localhost:8081/api/comments/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch {
      alert("Failed to delete comment");
    }
  };

  // ================= MARK AS READ =================
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `https://localhost:8081/api/comments/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch {
      console.error("Failed to mark as read");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const displayedComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ================= MENTION FORMAT =================
  const formatMentions = (text) =>
    text.split(/(@\w+)/g).map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-blue-400 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">
          💬 Task Comments
        </h2>

        {/* ADD COMMENT */}
        <form onSubmit={addComment} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment... Use @username"
            rows="3"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold text-white"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {/* COMMENTS */}
        <div className="space-y-4">
          {displayedComments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          )}

          {displayedComments.map((c) => (
            <div
              key={c.id}
              className={`border rounded-lg p-4 ${
                c.read
                  ? "bg-slate-900 border-slate-700"
                  : "bg-slate-900/80 border-blue-500"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-semibold">
                  {c.username}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>

              {/* EDIT MODE */}
              {editingId === c.id ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-gray-200"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateComment(c.id)}
                      className="bg-green-600 px-3 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-600 px-3 py-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300">
                    {formatMentions(c.content)}
                  </p>

                  <div className="flex gap-4 mt-3 text-sm">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingContent(c.content);
                      }}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>

                    {!c.read && (
                      <button
                        onClick={() => markAsRead(c.id)}
                        className="text-green-400 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
