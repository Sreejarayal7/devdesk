import { useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];
const COLORS = [
  "#e0f2fe",
  "#dcfce7",
  "#fef9c3",
  "#f3e8ff",
  "#fee2e2",
  "#fff7ed",
  "#f0fdf4",
];
const TEXT_COLORS = [
  "#0369a1",
  "#15803d",
  "#ca8a04",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#166534",
];

const STORAGE_KEY = "devdesk-timetable";

const loadTimetable = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveTimetable = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function Timetable() {
  const [slots, setSlots] = useState(loadTimetable);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: "", type: "Lecture", color: 0 });
  const [view, setView] = useState("week");

  const TYPES = ["Lecture", "Lab", "Study", "Break", "Assignment", "Project"];

  const key = (day, time) => `${day}-${time}`;

  const handleCellClick = (day, time) => {
    const k = key(day, time);
    if (slots[k]) {
      setEditing(k);
      setForm({
        subject: slots[k].subject,
        type: slots[k].type,
        color: slots[k].color,
      });
    } else {
      setEditing(k);
      setForm({ subject: "", type: "Lecture", color: 0 });
    }
  };

  const handleSave = () => {
    if (!form.subject.trim()) {
      handleDelete();
      return;
    }
    const updated = { ...slots, [editing]: { ...form } };
    setSlots(updated);
    saveTimetable(updated);
    setEditing(null);
  };

  const handleDelete = () => {
    const updated = { ...slots };
    delete updated[editing];
    setSlots(updated);
    saveTimetable(updated);
    setEditing(null);
  };

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "16px 20px",
          border: "2px solid #e0f2fe",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#0ea5e9",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          📅 Smart Timetable
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {["week", "day"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "5px 14px",
                borderRadius: 999,
                border: "none",
                background: view === v ? "#0ea5e9" : "#f1f5f9",
                color: view === v ? "white" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {v === "week" ? "📅 Week" : "📆 Day"}
            </button>
          ))}
          <button
            onClick={() => {
              if (window.confirm("Clear all slots?")) {
                setSlots({});
                saveTimetable({});
              }
            }}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              border: "none",
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Timetable grid */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "2px solid #e0f2fe",
          overflow: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: view === "week" ? 700 : 300,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 12px",
                  fontSize: "0.72rem",
                  color: "#94a3b8",
                  fontWeight: 700,
                  borderBottom: "2px solid #f1f5f9",
                  background: "#f8fafc",
                  width: 80,
                }}
              >
                Time
              </th>
              {(view === "week" ? DAYS : [today]).map((day) => (
                <th
                  key={day}
                  style={{
                    padding: "10px 8px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    borderBottom: "2px solid #f1f5f9",
                    background: "#f8fafc",
                    color: day === today ? "#0ea5e9" : "#1e293b",
                    borderLeft: "1px solid #f1f5f9",
                  }}
                >
                  {day === today ? `⭐ ${day}` : day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time) => (
              <tr key={time}>
                <td
                  style={{
                    padding: "8px 12px",
                    fontSize: "0.68rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                    borderBottom: "1px solid #f8fafc",
                    background: "#fafafa",
                    whiteSpace: "nowrap",
                  }}
                >
                  {time}
                </td>
                {(view === "week" ? DAYS : [today]).map((day) => {
                  const k = key(day, time);
                  const slot = slots[k];
                  return (
                    <td
                      key={day}
                      onClick={() => handleCellClick(day, time)}
                      style={{
                        padding: "4px",
                        borderBottom: "1px solid #f8fafc",
                        borderLeft: "1px solid #f8fafc",
                        cursor: "pointer",
                        minWidth: 80,
                        height: 44,
                        background: slot ? COLORS[slot.color] : "white",
                        transition: "background 0.15s",
                      }}
                    >
                      {slot && (
                        <div style={{ padding: "2px 6px" }}>
                          <p
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color: TEXT_COLORS[slot.color],
                              margin: 0,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {slot.subject}
                          </p>
                          <p
                            style={{
                              fontSize: "0.6rem",
                              color: TEXT_COLORS[slot.color],
                              margin: 0,
                              opacity: 0.7,
                            }}
                          >
                            {slot.type}
                          </p>
                        </div>
                      )}
                      {!slot && (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = 1)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = 0)
                          }
                        >
                          <span
                            style={{ fontSize: "0.7rem", color: "#cbd5e1" }}
                          >
                            + Add
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditing(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              width: 320,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16 }}>
              {slots[editing] ? "✏️ Edit Slot" : "➕ Add Slot"}
            </p>

            <input
              autoFocus
              value={form.subject}
              onChange={(e) =>
                setForm((f) => ({ ...f, subject: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Subject name..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                border: "2px solid #f1f5f9",
                background: "#f8fafc",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            />

            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                border: "2px solid #f1f5f9",
                background: "#f8fafc",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            {/* Color picker */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setForm((f) => ({ ...f, color: i }))}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `3px solid ${form.color === i ? TEXT_COLORS[i] : "transparent"}`,
                    background: c,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(90deg, #0ea5e9, #22c55e)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Save
              </button>
              {slots[editing] && (
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setEditing(null)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "2px solid #e2e8f0",
                  background: "white",
                  color: "#64748b",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
