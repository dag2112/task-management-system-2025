import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiLogOut,
  FiHome,
  FiShield,
  FiUserCheck,
  FiActivity,
} from "react-icons/fi";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const rawRole = localStorage.getItem("role") || "USER";
  const userRole = rawRole.replace("ROLE_", "").toUpperCase();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <FiHome />,
      roles: ["USER", "ADMIN"],
    },
    {
      name: "Task",
      path: "/task",
      icon: <FiActivity />,
      roles: ["ADMIN"],
    },
    {
      name: "Assign Role",
      path: "/assign-role",
      icon: <FiUserCheck />,
      roles: ["ADMIN"],
    },
    {
      name: "Assign Task",
      path: "/assign-task",
      roles: ["ADMIN"],
    },
    {
      name: "Admin Tasks",
      path: "/admin-tasks",
      roles: ["ADMIN"],
    },
    {
      name: "User Tasks",
      path: "/user-tasks",
      roles: ["USER"],
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <FiShield />,
      roles: ["ADMIN"],
    },
    {
      name: "Notifications",
      path: "/notifications",
      roles: ["USER", "ADMIN"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <header className="bg-slate-900 text-slate-100 shadow-xl fixed w-full z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-9 h-9" />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">
              Task Manager
            </h1>
            <span className="text-[10px] tracking-widest text-emerald-400 uppercase">
              {userRole} Access
            </span>
          </div>
        </div>

        {/* Menu  */}
        <nav className="hidden md:flex space-x-8">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 text-sm font-semibold transition-all
                  ${
                    isActive
                      ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
                      : "text-slate-300 hover:text-teal-400"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth    */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 
                bg-red-500/10 hover:bg-red-500 
                text-red-400 hover:text-white 
                px-4 py-2 rounded-lg font-semibold transition"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 
                text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
