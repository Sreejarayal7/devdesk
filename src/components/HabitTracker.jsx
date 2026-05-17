import { useState, useEffect } from "react";

const DEFAULT_HABITS = [
  { id: "1", name: "Solve 1 LeetCode problem", icon: "💻", color: "#0ea5e9" },
  { id: "2", name: "Read textbook 30 mins", icon: "📖", color: "#a855f7" },
  { id: "3", name: "Review notes", icon: "📝", color: "#22c55e" },
  { id: "4", name: "Watch lecture", icon: "🎥", color: "#f97316" },
  { id: "5", name: "Practice coding", icon: "⌨️", color: "#ec4899" },
];

const getToday = () => new Date().toISOString().split("T")[0];
const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
};

const STORAGE_KEY = "devdesk-habits";
const CUSTOM_KEY = "devdesk-custom-habits";

export default function HabitTracker() {
  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [habits, setHabits] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(CUSTOM_KEY) || "null") || DEFAULT_HABITS
      );
    } catch {
      return DEFAULT_HABITS;
    }
  });
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);

  const days = getLast7Days();
  const today = getToday();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggle = (habitId, date) => {
    const k = `${habitId}-${date}`;
    setLogs((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const isDone = (habitId, date) => !!logs[`${habitId}-${date}`];

  const streak = (habitId) => {
    let count = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split("T")[0];
      if (!logs[`${habitId}-${dateStr}`]) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };

  const todayScore = () => {
    const done = habits.filter((h) => isDone(h.id, today)).length;
    return Math.round((done / habits.length) * 100);
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const icons = ["⭐", "🎯", "📌", "🔥", "✨", "🌟"];
    const colors = [
      "#0ea5e9",
      "#a855f7",
      "#22c55e",
      "#f97316",
      "#ec4899",
      "#facc15",
    ];
    const idx = habits.length % icons.length;
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newHabit.trim(),
        icon: icons[idx],
        color: colors[idx],
      },
    ]);
    setNewHabit("");
    setAdding(false);
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const score = todayScore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header card */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 20,
          border: "2px solid #fce7f3",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#ec4899",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            🎯 Daily Habit Tracker
          </p>
          <button
            onClick={() => setAdding((a) => !a)}
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              border: "none",
              background: "#fce7f3",
              color: "#ec4899",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {adding ? "✕ Cancel" : "+ Add Habit"}
          </button>
        </div>

        {/* Add habit input */}
        {adding && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              autoFocus
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="New habit name..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 10,
                border: "2px solid #fce7f3",
                background: "#fdf2f8",
                fontSize: "0.85rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={addHabit}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "none",
                background: "#ec4899",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Today score */}
        <div
          style={{
            background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#be185d",
                fontWeight: 700,
                margin: "0 0 2px",
              }}
            >
              Today's Score
            </p>
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: "#ec4899",
                margin: 0,
              }}
            >
              {score}%
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#be185d",
                fontWeight: 700,
                margin: "0 0 2px",
              }}
            >
              Completed
            </p>
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: "#ec4899",
                margin: 0,
              }}
            >
              {habits.filter((h) => isDone(h.id, today)).length}/{habits.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 8,
            background: "#fce7f3",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${score}%`,
              background: "linear-gradient(90deg, #ec4899, #a855f7)",
              borderRadius: 999,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Habit grid */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 20,
          border: "2px solid #fce7f3",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                  fontWeight: 700,
                }}
              >
                HABIT
              </th>
              {days.map((d) => {
                const dateObj = new Date(d);
                return (
                  <th
                    key={d}
                    style={{
                      padding: "8px 6px",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: d === today ? "#ec4899" : "#94a3b8",
                      textAlign: "center",
                      minWidth: 40,
                    }}
                  >
                    <div>{dayLabels[dateObj.getDay()]}</div>
                    <div style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                      {dateObj.getDate()}
                    </div>
                  </th>
                );
              })}
              <th
                style={{
                  padding: "8px 6px",
                  fontSize: "0.68rem",
                  color: "#94a3b8",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                🔥
              </th>
              <th style={{ width: 30 }}></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td style={{ padding: "8px 12px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: habit.color + "22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {habit.icon}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {habit.name}
                    </span>
                  </div>
                </td>
                {days.map((d) => (
                  <td
                    key={d}
                    style={{ padding: "8px 6px", textAlign: "center" }}
                  >
                    <button
                      onClick={() => toggle(habit.id, d)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: `2px solid ${isDone(habit.id, d) ? habit.color : "#e2e8f0"}`,
                        background: isDone(habit.id, d) ? habit.color : "white",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        color: "white",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                      }}
                    >
                      {isDone(habit.id, d) ? "✓" : ""}
                    </button>
                  </td>
                ))}
                <td style={{ padding: "8px 6px", textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: streak(habit.id) > 0 ? "#f97316" : "#cbd5e1",
                    }}
                  >
                    {streak(habit.id) > 0 ? `🔥${streak(habit.id)}` : "-"}
                  </span>
                </td>
                <td style={{ padding: "8px 4px" }}>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#e2e8f0",
                      fontSize: "0.8rem",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#f87171")}
                    onMouseLeave={(e) => (e.target.style.color = "#e2e8f0")}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
