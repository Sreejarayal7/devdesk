import { useState, useRef, useEffect } from "react";

const GEMINI_API_KEY = "AIzaSyAOY5gYww71rsq7XC1AheCTfWwnQLGXl6A";

const QUICK_QUESTIONS = [
  "📚 Explain Binary Search Trees",
  "🧠 What is Gradient Descent?",
  "💻 Difference between Stack and Queue",
  "🔄 Explain Deadlock in OS",
  "📊 What is Normalization in DBMS?",
  "⚡ Explain Time Complexity",
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your CSE study assistant 🤖 Ask me anything about Data Structures, Algorithms, DBMS, OS, Machine Learning, or any CSE topic!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setLoading(true);

    const userMsg = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: "You are a helpful CSE tutor for a student. Give clear, concise explanations with examples. Use emojis to make it friendly. Format with bullet points when listing things. Keep responses focused and educational.",
                },
              ],
            },
            contents: [...history, { role: "user", parts: [{ text: msg }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
          }),
        },
      );

      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate a response. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Something went wrong. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 20,
        border: "2px solid #e9d5ff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        height: 520,
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#7c3aed",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        🧠 AI Study Assistant
      </p>

      {/* Quick questions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q.slice(2))}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid #e9d5ff",
              background: "#f5f3ff",
              color: "#7c3aed",
              fontSize: "0.68rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingRight: 4,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius:
                  m.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "#f5f3ff",
                color: m.role === "user" ? "white" : "#1e293b",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "18px 18px 18px 4px",
                background: "#f5f3ff",
                color: "#7c3aed",
                fontSize: "0.82rem",
              }}
            >
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Ask any CSE question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 14,
            border: "2px solid #e9d5ff",
            background: "#f8fafc",
            fontSize: "0.875rem",
            outline: "none",
            fontFamily: "inherit",
            color: "#1e293b",
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            border: "none",
            background:
              loading || !input.trim()
                ? "#e2e8f0"
                : "linear-gradient(90deg, #7c3aed, #a855f7)",
            color: loading || !input.trim() ? "#94a3b8" : "white",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
        >
          Send ➤
        </button>
      </div>
    </div>
  );
}
