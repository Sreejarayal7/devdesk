import { useState } from 'react'

export default function AIStudyPlan({ onAddTask, subjects }) {
  const [topic,   setTopic]   = useState('')
  const [days,    setDays]    = useState('7')
  const [level,   setLevel]   = useState('Beginner')
  const [loading, setLoading] = useState(false)
  const [plan,    setPlan]    = useState(null)
  const [error,   setError]   = useState('')

  const GEMINI_API_KEY = 'AIzaSyAOY5gYww71rsq7XC1AheCTfWwnQLGXl6A'

  const generatePlan = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setPlan(null)

    const prompt = `You are a CSE study planner. Create a ${days}-day study plan for a ${level} student learning "${topic}".

Return ONLY a valid JSON object with no extra text, no markdown, no backticks:
{
  "title": "Study plan title",
  "overview": "2 sentence overview",
  "tasks": [
    {
      "day": 1,
      "title": "Task title",
      "description": "What to study and do",
      "duration": "2 hours",
      "type": "Assignment",
      "priority": "High"
    }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}

Rules:
- Generate exactly ${days} tasks, one per day
- type must be one of: Assignment, Lab Work, Exam Prep, Project, Coding Practice, Deadline
- priority must be one of: High, Medium, Low
- Return pure JSON only, nothing else`

    try {
      const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
  {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error?.message || 'API error. Check your API key!')
        return
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setPlan(parsed)

    } catch {
      setError('Failed to generate plan. Check your API key and try again!')
    } finally {
      setLoading(false)
    }
  }

  const addAllTasks = () => {
    if (!plan) return
    plan.tasks.forEach(t => {
      onAddTask({
        title: `Day ${t.day}: ${t.title}`,
        note: t.description,
        type: t.type,
        priority: t.priority,
        subject: subjects[0] || 'Other',
        dueDate: ''
      })
    })
    setPlan(null)
    setTopic('')
  }

  const addSingleTask = (t) => {
    onAddTask({
      title: `Day ${t.day}: ${t.title}`,
      note: t.description,
      type: t.type,
      priority: t.priority,
      subject: subjects[0] || 'Other',
      dueDate: ''
    })
  }

  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: 20,
      border: '2px solid #e9d5ff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <p style={{
        fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16
      }}>
        🤖 AI Study Plan Generator
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generatePlan()}
          placeholder="What do you want to study? e.g. Binary Trees, Neural Networks..."
          style={{
            padding: '10px 14px', borderRadius: 12,
            border: '2px solid #f1f5f9', background: '#f8fafc',
            fontSize: '0.875rem', outline: 'none',
            fontFamily: 'inherit', color: '#1e293b'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <select value={days} onChange={e => setDays(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' }}>
            {['3', '5', '7'].map(d => <option key={d} value={d}>{d} day plan</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' }}>
            {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <button
          onClick={generatePlan}
          disabled={loading || !topic.trim()}
          style={{
            padding: '12px', borderRadius: 14, border: 'none',
            background: loading || !topic.trim()
              ? '#e2e8f0'
              : 'linear-gradient(90deg, #7c3aed, #a855f7)',
            color: loading || !topic.trim() ? '#94a3b8' : 'white',
            fontSize: '0.9rem', fontWeight: 800,
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(124,58,237,0.3)'
          }}
        >
          {loading ? '⏳ Generating your plan...' : '✨ Generate Study Plan'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 10, textAlign: 'center' }}>
          ⚠️ {error}
        </p>
      )}

      {plan && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
            borderRadius: 14, padding: 16, marginBottom: 14,
            border: '1px solid #ddd6fe'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#5b21b6', margin: '0 0 6px' }}>
              📚 {plan.title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6d28d9', margin: 0 }}>{plan.overview}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {plan.tasks.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12,
                background: '#fafafa', border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white', fontSize: '0.72rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {t.day}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {t.title}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0' }}>
                    ⏱ {t.duration} · {t.type} · {t.priority} priority
                  </p>
                </div>
                <button
                  onClick={() => addSingleTask(t)}
                  style={{
                    padding: '4px 10px', borderRadius: 8, border: 'none',
                    background: '#e9d5ff', color: '#7c3aed',
                    fontSize: '0.72rem', fontWeight: 700,
                    cursor: 'pointer', flexShrink: 0
                  }}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

          {plan.tips && (
            <div style={{
              background: '#f0fdf4', borderRadius: 12, padding: 12,
              border: '1px solid #bbf7d0', marginBottom: 14
            }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', marginBottom: 6 }}>
                💡 Study Tips
              </p>
              {plan.tips.map((tip, i) => (
                <p key={i} style={{ fontSize: '0.78rem', color: '#166534', margin: '4px 0' }}>
                  • {tip}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={addAllTasks}
            style={{
              width: '100%', padding: '12px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(90deg, #0ea5e9, #22c55e)',
              color: 'white', fontSize: '0.9rem', fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
            }}
          >
            ➕ Add All Tasks to DevDesk
          </button>
        </div>
      )}
    </div>
  )
}