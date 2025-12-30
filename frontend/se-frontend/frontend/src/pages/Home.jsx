import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-white scroll-smooth">

      {/* Custom Animation */}
      <style>
        {`
          @keyframes shimmer { 100% { transform: translateX(100%); } }
          .animate-shimmer { animation: shimmer 2s infinite; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-[80vh] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="relative z-10 text-center px-6 max-w-5xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Task Management <br />
            <span className="text-yellow-400">System</span>
          </h1>
          <p className="text-gray-100 text-lg md:text-2xl mb-10 leading-relaxed font-light max-w-3xl mx-auto drop-shadow-md">
            Manage users, create tasks, assign tasks, and track progress efficiently in one central platform.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/tasks")}
              className="relative group overflow-hidden px-14 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
              <span className="relative flex items-center gap-3">Manage Tasks</span>
            </button>
            <button
              onClick={() => navigate("/assign")}
              className="relative group overflow-hidden px-14 py-4 bg-gradient-to-r from-green-600 via-green-500 to-teal-600 text-white rounded-full font-bold text-xl transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_35px_rgba(5,150,105,0.6)] hover:-translate-y-1 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
              <span className="relative flex items-center gap-3">Assign Tasks</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-white py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Core Features</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Manage Categories",
                text: "Create and organize categories for tasks to simplify assignment and tracking.",
              },
              {
                title: "Create Tasks",
                text: "Add tasks with title, description, due date, and assign them to categories before assigning to users.",
              },
              {
                title: "Assign Tasks",
                text: "Assign tasks to registered users and track their progress efficiently with status updates.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 p-8"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-slate-50 py-28 px-6 border-y border-gray-200">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Productivity Hub</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight">About Task Management System</h2>
          <div className="text-gray-600 text-xl leading-relaxed font-light space-y-6">
            <p>
              This system allows admins to create tasks, manage categories, register users, and assign tasks. Users can see their assigned tasks and update progress easily.
            </p>
            <p>
              Designed for teams and organizations, it provides a{" "}
              <span className="text-blue-600 font-semibold italic">
                secure, efficient, and user-friendly platform
              </span>{" "}
              to improve productivity, accountability, and project tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-blue-950 rounded-[3rem] p-12 md:p-20 text-white flex flex-col items-center text-center shadow-2xl shadow-blue-900/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Get In Touch</h2>
            <div className="grid md:grid-cols-3 gap-12 w-full">
              <div className="space-y-3">
                <p className="text-blue-400 font-semibold tracking-widest uppercase text-xs">Email Us</p>
                <p className="text-lg font-medium tracking-tight">taskmanager@local.com</p>
              </div>
              <div className="space-y-3">
                <p className="text-blue-400 font-semibold tracking-widest uppercase text-xs">Call Us</p>
                <p className="text-lg font-medium">+251 912 345 678</p>
              </div>
              <div className="space-y-3">
                <p className="text-blue-400 font-semibold tracking-widest uppercase text-xs">Visit Us</p>
                <p className="text-lg font-medium">Woldia, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-16 mt-auto border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h2 className="text-white text-3xl font-black italic tracking-tighter">
              TASK <span className="text-blue-600">MANAGER</span>
            </h2>
          </div>
          <p className="mb-6 text-sm">© {new Date().getFullYear()} Task Management System. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
