import { useState, useMemo, useEffect } from "react";
import { auth, logOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import Login from "./components/Login";
import Charts from "./components/Charts";
import PomodoroTimer from "./components/PomodoroTimer";
import AIStudyPlan from "./components/AIStudyPlan";
import Timetable from "./components/Timetable";
import AIChat from "./components/AIChat";
import Logo from "./components/Logo";
import HabitTracker from "./components/HabitTracker";
import Notes from "./components/Notes";
import Gamification from "./components/Gamification";

const DEFAULT_SUBJECTS = ["Data Structures", "Machine Learning"];

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { tasks, addTask, deleteTask, toggleTask, updateSubtasks } = useTasks(
    user?.uid,
  );

  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [filters, setFilters] = useState({
    status: "All",
    subject: "All",
    type: "All",
  });
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const addSubject = (s) => {
    if (s && !subjects.includes(s)) setSubjects((p) => [...p, s]);
  };
  const removeSubject = (s) => {
    setSubjects((p) => p.filter((x) => x !== s));
    setFilters((f) => ({ ...f, subject: "All" }));
  };

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (filters.status === "Completed" && !t.completed) return false;
        if (filters.status === "Pending" && t.completed) return false;
        if (filters.subject !== "All" && t.subject !== filters.subject)
          return false;
        if (filters.type !== "All" && t.type !== filters.type) return false;
        return true;
      }),
    [tasks, search, filters],
  );

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;

  if (authLoading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f2fe, #f0fdf4)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🧠</div>
          <p style={{ color: "#0ea5e9", fontWeight: 700 }}>
            Loading DevDesk...
          </p>
        </div>
      </div>
    );

  if (!user) return <Login />;

  const TABS = [
    { id: "tasks", label: "📋 Tasks" },
    { id: "habits", label: "🎯 Habits" },
    { id: "notes", label: "📝 Notes" },
    { id: "xp", label: "🏆 XP & Badges" },
    { id: "timetable", label: "📅 Timetable" },
    { id: "chat", label: "🧠 AI Chat" },
    { id: "analytics", label: "📊 Analytics" },
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="app">
        {/* Top bar */}
        <div
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={user.photoURL}
              width={36}
              height={36}
              style={{ borderRadius: "50%", border: "2px solid #bae6fd" }}
              alt="avatar"
            />
            <div>
              <p
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Hi, {user.displayName?.split(" ")[0]}! 👋
              </p>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>
                {user.email}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="dark-toggle" onClick={() => setDark((d) => !d)}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              className="dark-toggle"
              onClick={logOut}
              style={{ borderColor: "#fecaca", color: "#ef4444" }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Header with Brain Logo */}
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <Logo size={52} />
          <div>
            <h1 style={{ margin: 0 }}>DevDesk</h1>
            <p style={{ margin: 0 }}>Your personal CSE study & task tracker</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card blue">
            <div className="num">{total}</div>
            <div className="label">Total</div>
          </div>
          <div className="stat-card orange">
            <div className="num">{pending}</div>
            <div className="label">Pending</div>
          </div>
          <div className="stat-card green">
            <div className="num">{done}</div>
            <div className="label">Done ✓</div>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="progress-card">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span>{Math.round((done / total) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Pomodoro + AI Study Plan */}
        <div className="two-col">
          <PomodoroTimer />
          <AIStudyPlan onAddTask={addTask} subjects={subjects} />
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                borderRadius: 14,
                border: activeTab === tab.id ? "none" : "2px solid #e2e8f0",
                background: activeTab === tab.id ? "#0ea5e9" : "white",
                color: activeTab === tab.id ? "white" : "#64748b",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  activeTab === tab.id
                    ? "0 4px 12px rgba(14,165,233,0.3)"
                    : "none",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "tasks" && (
          <div className="main-content">
            <div className="main-left">
              <TaskForm
                onAdd={addTask}
                subjects={subjects}
                onAddSubject={addSubject}
                onRemoveSubject={removeSubject}
              />
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                subjects={subjects}
              />
            </div>
            <div className="main-right">
              <SearchBar search={search} setSearch={setSearch} />
              <TaskList
                tasks={filtered}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdateSubtasks={updateSubtasks}
              />
            </div>
          </div>
        )}

        {activeTab === "habits" && <HabitTracker />}
        {activeTab === "notes" && <Notes />}
        {activeTab === "xp" && <Gamification tasks={tasks} />}
        {activeTab === "timetable" && <Timetable />}
        {activeTab === "chat" && <AIChat />}
        {activeTab === "analytics" && <Charts tasks={tasks} />}

        {/* Footer */}
        <div className="footer">
          🧠 DevDesk · Built for CSE Students · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
