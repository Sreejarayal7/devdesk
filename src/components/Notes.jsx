import { useState, useEffect } from "react";

const STORAGE_KEY = "devdesk-notes";

const COLORS = [
  { bg: "#fef9c3", border: "#fef08a", text: "#92400e" },
  { bg: "#e0f2fe", border: "#bae6fd", text: "#0369a1" },
  { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d" },
  { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" },
  { bg: "#fce7f3", border: "#fbcfe8", text: "#9d174d" },
  { bg: "#fff7ed", border: "#fed7aa", text: "#7c2d12" },
];

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [active, setActive] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      color: Math.floor(Math.random() * COLORS.length),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    setActive(note.id);
  };

  const updateNote = (id, field, value) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, [field]: value, updatedAt: new Date().toISOString() }
          : n,
      ),
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (active === id) setActive(null);
  };

  const activeNote = notes.find((n) => n.id === active);

  return (
    <div style={{ display: "flex", gap: 16, height: 600 }}>
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={addNote}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(168,85,247,0.3)",
          }}
        >
          ✏️ New Note
        </button>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {notes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#94a3b8",
              }}
            >
              <p style={{ fontSize: "2rem", margin: "0 0 8px" }}>📝</p>
              <p style={{ fontSize: "0.8rem" }}>No notes yet</p>
            </div>
          )}
          {notes.map((note) => {
            const c = COLORS[note.color];
            return (
              <div
                key={note.id}
                onClick={() => setActive(note.id)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: `2px solid ${active === note.id ? c.border : "#f1f5f9"}`,
                  background: active === note.id ? c.bg : "white",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: active === note.id ? c.text : "#1e293b",
                    margin: "0 0 4px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {note.title || "Untitled Note"}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    margin: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {note.content || "No content..."}
                </p>
                <p
                  style={{
                    fontSize: "0.65rem",
                    color: "#cbd5e1",
                    margin: "4px 0 0",
                  }}
                >
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          border: `2px solid ${activeNote ? COLORS[activeNote.color].border : "#f1f5f9"}`,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: activeNote ? COLORS[activeNote.color].bg : "#f8fafc",
          transition: "all 0.3s",
        }}
      >
        {!activeNote ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p style={{ fontSize: "3rem", margin: 0 }}>📝</p>
            <p
              style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.9rem" }}
            >
              Select a note or create a new one
            </p>
            <button
              onClick={addNote}
              style={{
                padding: "10px 24px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(90deg, #a855f7, #ec4899)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              ✏️ Create Note
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Color picker */}
              <div style={{ display: "flex", gap: 6 }}>
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => updateNote(activeNote.id, "color", i)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: c.bg,
                      border: `2px solid ${activeNote.color === i ? c.text : c.border}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => deleteNote(activeNote.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </div>

            <input
              value={activeNote.title}
              onChange={(e) =>
                updateNote(activeNote.id, "title", e.target.value)
              }
              placeholder="Note title..."
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: COLORS[activeNote.color].text,
                border: "none",
                background: "transparent",
                outline: "none",
                fontFamily: "inherit",
                width: "100%",
              }}
            />

            <textarea
              value={activeNote.content}
              onChange={(e) =>
                updateNote(activeNote.id, "content", e.target.value)
              }
              placeholder="Start writing your notes here... Use this for lecture notes, formulas, important concepts, or anything you want to remember!"
              style={{
                flex: 1,
                fontSize: "0.875rem",
                lineHeight: 1.8,
                color: COLORS[activeNote.color].text,
                border: "none",
                background: "transparent",
                outline: "none",
                fontFamily: "inherit",
                resize: "none",
                width: "100%",
              }}
            />

            <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: 0 }}>
              Last saved: {new Date(activeNote.updatedAt).toLocaleString()}·{" "}
              {activeNote.content.split(" ").filter(Boolean).length} words
            </p>
          </>
        )}
      </div>
    </div>
  );
}
