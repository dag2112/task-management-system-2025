import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";

const BASE_URL = "https://localhost:8081/api";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && form.username.length < 2) {
      setMessage({ text: "Username must be at least 2 characters.", type: "error" });
      return;
    }

    if (!isLogin && form.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(
          `${BASE_URL}/auth/login`,
          { username: form.username, password: form.password },
          { withCredentials: true }
        );

        const token = res?.data?.token || res?.data?.jwt;
        const user = res?.data?.user || { role: "USER" };

        if (!token) throw new Error("Invalid username/password");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        navigate("/dashboard");
      } else {
        await axios.post(
          `${BASE_URL}/user/register`,
          { username: form.username, password: form.password },
          { withCredentials: true }
        );

        setForm({ username: "", password: "" });
        setIsLogin(true);
        setMessage({ text: "Account created successfully! Please login.", type: "success" });
      }
    } catch (err) {
      setMessage({
        text: isLogin ? "Invalid username or password" : "Registration failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4">
      {/* Header */}
      <motion.div
        className="flex items-center mb-8 space-x-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
      >
        <motion.div
          className="text-indigo-400 text-4xl"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FaTasks />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Task <span className="text-indigo-400">Management</span> System
        </h1>
      </motion.div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {message.text && (
          <div
            className={`mb-4 text-center font-medium ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold transition ${
              loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-slate-400">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}
          <span
            className="text-indigo-400 cursor-pointer ml-1 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: "", type: "" });
            }}
          >
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
