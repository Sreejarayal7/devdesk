const LEVELS = [
  { name: "Beginner", min: 0, icon: "🌱", color: "#22c55e" },
  { name: "Student", min: 100, icon: "📚", color: "#0ea5e9" },
  { name: "Scholar", min: 300, icon: "🎓", color: "#a855f7" },
  { name: "Coder", min: 600, icon: "💻", color: "#f97316" },
  { name: "Hacker", min: 1000, icon: "🔥", color: "#ef4444" },
  { name: "Legend", min: 2000, icon: "⚡", color: "#facc15" },
];

const BADGES = [
  {
    id: "first_task",
    name: "First Task",
    icon: "🎯",
    desc: "Complete your first task",
    check: (t) => t.filter((x) => x.completed).length >= 1,
  },
  {
    id: "five_tasks",
    name: "On a Roll",
    icon: "🔥",
    desc: "Complete 5 tasks",
    check: (t) => t.filter((x) => x.completed).length >= 5,
  },
  {
    id: "ten_tasks",
    name: "Task Master",
    icon: "⚡",
    desc: "Complete 10 tasks",
    check: (t) => t.filter((x) => x.completed).length >= 10,
  },
  {
    id: "all_types",
    name: "Well Rounded",
    icon: "🌟",
    desc: "Try all task types",
    check: (t) => new Set(t.map((x) => x.type)).size >= 5,
  },
  {
    id: "two_subjects",
    name: "Multi Subject",
    icon: "📚",
    desc: "Add tasks for 2+ subjects",
    check: (t) => new Set(t.map((x) => x.subject)).size >= 2,
  },
  {
    id: "high_pri",
    name: "Priority Pro",
    icon: "🎖️",
    desc: "Complete a High priority task",
    check: (t) => t.some((x) => x.completed && x.priority === "High"),
  },
  {
    id: "twenty_tasks",
    name: "Unstoppable",
    icon: "🏆",
    desc: "Complete 20 tasks",
    check: (t) => t.filter((x) => x.completed).length >= 20,
  },
  {
    id: "subtasks",
    name: "Detail Oriented",
    icon: "🔍",
    desc: "Use subtasks feature",
    check: (t) => t.some((x) => x.subtasks && x.subtasks.length > 0),
  },
];

const getXP = (tasks) => {
  let xp = 0;
  tasks.forEach((t) => {
    if (t.completed) {
      xp += t.priority === "High" ? 30 : t.priority === "Medium" ? 20 : 10;
      if (t.subtasks) xp += t.subtasks.filter((s) => s.done).length * 5;
    }
  });
  return xp;
};

const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
};

export default function Gamification({ tasks }) {
  const xp = getXP(tasks);
  const level = getLevel(xp);
  const nextLevel = LEVELS[level.index + 1];
  const progress = nextLevel
    ? ((xp - level.min) / (nextLevel.min - level.min)) * 100
    : 100;

  const earnedBadges = BADGES.filter((b) => b.check(tasks));
  const lockedBadges = BADGES.filter((b) => !b.check(tasks));

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* XP & Level card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${level.color}22, ${level.color}11)`,
          borderRadius: 20,
          padding: 24,
          border: `2px solid ${level.color}44`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: 8 }}>{level.icon}</div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: level.color,
            margin: "0 0 4px",
          }}
        >
          {level.name}
        </h2>
        <p
          style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 16px" }}
        >
          {xp} XP total
        </p>

        {nextLevel && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              <span>{level.name}</span>
              <span>
                {nextLevel.icon} {nextLevel.name} — {nextLevel.min} XP
              </span>
            </div>
            <div
              style={{
                height: 10,
                background: "#f1f5f9",
                borderRadius: 999,
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`,
                  borderRadius: 999,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
              {nextLevel.min - xp} XP to next level
            </p>
          </>
        )}

        {!nextLevel && (
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: level.color,
            }}
          >
            🏆 Maximum Level Reached!
          </p>
        )}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { label: "Total XP", value: xp, color: "#a855f7", icon: "⚡" },
          {
            label: "Completed",
            value: completed,
            color: "#22c55e",
            icon: "✅",
          },
          {
            label: "Pending",
            value: total - completed,
            color: "#f97316",
            icon: "⏳",
          },
          {
            label: "Badges",
            value: earnedBadges.length,
            color: "#0ea5e9",
            icon: "🏅",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "14px 10px",
              textAlign: "center",
              border: `2px solid ${s.color}22`,
            }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: 2 }}>{s.icon}</div>
            <div
              style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}
            >
              {s.value}
            </div>
            <div
              style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* XP Guide */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          border: "2px solid #f3e8ff",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            color: "#a855f7",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
          }}
        >
          ⚡ How to earn XP
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            {
              label: "High priority task",
              xp: "+30 XP",
              color: "#fee2e2",
              text: "#dc2626",
            },
            {
              label: "Medium priority task",
              xp: "+20 XP",
              color: "#fef9c3",
              text: "#ca8a04",
            },
            {
              label: "Low priority task",
              xp: "+10 XP",
              color: "#dcfce7",
              text: "#16a34a",
            },
            {
              label: "Each subtask",
              xp: "+5 XP",
              color: "#e0f2fe",
              text: "#0369a1",
            },
          ].map((x) => (
            <div
              key={x.label}
              style={{
                padding: "6px 12px",
                borderRadius: 10,
                background: x.color,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "0.75rem", color: x.text, fontWeight: 600 }}
              >
                {x.label}
              </span>
              <span
                style={{ fontSize: "0.75rem", color: x.text, fontWeight: 900 }}
              >
                {x.xp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 16,
            border: "2px solid #fef9c3",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "#ca8a04",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            🏅 Earned Badges ({earnedBadges.length})
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {earnedBadges.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "linear-gradient(135deg, #fef9c3, #fef08a)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  border: "2px solid #fde68a",
                  textAlign: "center",
                  minWidth: 100,
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>
                  {b.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#92400e",
                  }}
                >
                  {b.name}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#a16207",
                    marginTop: 2,
                  }}
                >
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 16,
            border: "2px solid #f1f5f9",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            🔒 Locked Badges
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {lockedBadges.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  padding: "10px 14px",
                  border: "2px solid #f1f5f9",
                  textAlign: "center",
                  minWidth: 100,
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: 4,
                    filter: "grayscale(1)",
                  }}
                >
                  {b.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#64748b",
                  }}
                >
                  {b.name}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
