"use client";

import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }

        setLoading(true);

        try {
            await login(username, password);
            // Login success handled in AuthContext
        } catch (error) {
            setError(error.message || "Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: "400px",
            margin: "50px auto",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
                Login
            </h1>

            {error && (
                <div style={{
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "20px"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Username *
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px"
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Password *
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px"
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: loading ? "#ccc" : "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>
                    Don't have an account?{" "}
                    <Link href="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}