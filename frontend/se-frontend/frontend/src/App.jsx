import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";

import Navbar from "./components/Navbar";

import AssignRole from "./pages/AssignRole";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";

import Task from "./pages/Task";
import TaskAssignment from "./pages/TaskAssignment";
import AdminTasks from "./pages/AdminTasks";
import UserTasks from "./pages/UserTasks";
import TaskComments from "./pages/TaskComments";

// 1. This component checks if the user is logged in
function ProtectedRoute({ children }) {
  // It looks for the "token" you set during login
  const isAuthenticated = localStorage.getItem("token"); 
  
  if (!isAuthenticated) {
    // If no token, send them back to the Login page ("/")
    return <Navigate to="/" replace />;
  }
  return children;
}

// 2. This component wraps the Navbar and spacing for all internal pages
function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div className="pt-20 p-4">{children}</div>
    </>
  );
}

// 3. This handles the logic for hiding Navbar and routing permissions
function AppWrapper() {
  const location = useLocation();

  return (
    <Routes>
      {/* Public Route - Login/Register */}
      <Route path="/" element={<AuthPage />} />
      
      
      {/* Private Routes - All nested inside ProtectedRoute */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Admin and General Pages */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/task" element={<Task />} />
                <Route path="/assign-task" element={<TaskAssignment />} />
                
                <Route path="/assign-role" element={<AssignRole />} />
                <Route path="/admin-tasks" element={<AdminTasks />} />
                <Route path="/user-tasks" element={<UserTasks />} />
                <Route path="/notifications" element={<Notifications />} />
                 <Route path="/comments/:taskId" element={<TaskComments />} />
              

                {/* Catch-all for logged-in users */}
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}