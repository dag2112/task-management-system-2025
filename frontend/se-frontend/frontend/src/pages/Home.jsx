import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 scroll-smooth">

      {/* Animations */}
      <style>
        {`
          @keyframes shimmer { 100% { transform: translateX(100%); } }
          .animate-shimmer { animation: shimmer 2s infinite; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        `}
      </style>

      {/* HERO */}
      <section className="relative flex items-center justify-center h-[85vh] bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700">
        <div className="text-center px-6 max-w-5xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl">
            Task Management <br />
            <span className="text-emerald-300">System</span>
          </h1>

          <p className="text-emerald-50 text-lg md:text-2xl mb-12 max-w-3xl mx-auto">
            Organize work, assign tasks, track progress, and collaborate efficiently.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            {role === "ADMIN" && (
              <>
                <button
                  onClick={() => navigate("/tasks")}
                  className="px-12 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition"
                >
                  Manage Tasks
                </button>

                <button
                  onClick={() => navigate("/assign")}
                  className="px-12 py-4 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition"
                >
                  Assign Tasks
                </button>
              </>
            )}

            {role === "USER" && (
              <button
                onClick={() => navigate("/my-tasks")}
                className="px-12 py-4 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg shadow-lg hover:-translate-y-1 transition"
              >
                View My Tasks
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Category Management",
                text: "Organize tasks efficiently using structured categories.",
              },
              {
                title: "Task Assignment",
                text: "Assign work to users and track progress in real time.",
              },
              {
                title: "Comments & Notifications",
                text: "Collaborate using comments and receive instant notifications.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition"
              >
                <h3 className="text-2xl font-bold mb-4 text-emerald-700">
                  {f.title}
                </h3>
                <p className="text-slate-600 text-lg">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-slate-100 py-24 px-6 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-slate-800">
            About the System
          </h2>

          <p className="text-xl text-slate-600 leading-relaxed">
            A secure task management platform that helps teams collaborate,
            track progress, and stay productive with role-based access and
            notifications.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="text-center">
          <h3 className="text-white text-2xl font-black mb-4">
            TASK <span className="text-emerald-500">MANAGER</span>
          </h3>
          <p className="text-sm">
            © {new Date().getFullYear()} Task Management System
          </p>
        </div>
      </footer>

    </div>
  );
}
