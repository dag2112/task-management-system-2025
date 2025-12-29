// app/worker/page.js
"use client";

import RequireAuth from "@/auth/RequireAuth";

export default function WorkerPage() {
    return (
        <RequireAuth role="WORKER">
            <div style={{ padding: "20px" }}>
                <h1>👷 Worker Dashboard</h1>
                <p>Manage your assigned tasks here.</p>
                {/* Add worker-specific content here */}
            </div>
        </RequireAuth>
    );
}