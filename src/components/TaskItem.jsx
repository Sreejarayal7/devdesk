import { useState } from 'react'

const TYPE_EMOJI = {
  'Assignment':      '📝',
  'Lab Work':        '🧪',
  'Exam Prep':       '📖',
  'Project':         '🛠️',
  'Coding Practice': '💻',
  'Deadline':        '⏰',
}

const PRIORITY_LABEL = {
  High:   { cls: 'tag tag-high', icon: '🔴' },
  Medium: { cls: 'tag tag-med',  icon: '🟡' },
  Low:    { cls: 'tag tag-low',  icon: '🟢' },
}

export default function TaskItem({ task, onToggle, onDelete, onUpdateSubtasks }) {
  const [expanded,    setExpanded]    = useState(false)
  const [newSubtask,  setNewSubtask]  = useState('')
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()
  const p = PRIORITY_LABEL[task.priority] || PRIORITY_LABEL.Medium
  const subtasks = task.subtasks || []
  const doneSubs = subtasks.filter(s => s.done).length

  const addSubtask = () => {
    if (!newSubtask.trim()) return
    const updated = [...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), done: false }]
    onUpdateSubtasks(task.id, updated)
    setNewSubtask('')
  }

  const toggleSubtask = (subId) => {
    const updated = subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s)
    onUpdateSubtasks(task.id, updated)
  }

  const deleteSubtask = (subId) => {
    const updated = subtasks.filter(s => s.id !== subId)
    onUpdateSubtasks(task.id, updated)
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}
      style={{ flexDirection: 'column', alignItems: 'stretch' }}>

      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
        >
          {task.completed && '✓'}
        </button>

        <div className="task-body">
          <div className="task-title-row">
            <span className="task-emoji">{TYPE_EMOJI[task.type] || '📌'}</span>
            <span className={`task-title ${task.completed ? 'done' : ''}`}>{task.title}</span>
          </div>
          {task.note && <p className="task-note">📎 {task.note}</p>}
          <div className="task-tags">
            <span className="tag tag-subject">📚 {task.subject}</span>
            <span className={p.cls}>{p.icon} {task.priority}</span>
            <span className="tag tag-type">🏷️ {task.type}</span>
            {task.dueDate && (
              <span className={isOverdue ? 'tag tag-overdue' : 'tag tag-date'}>
                {isOverdue ? '⚠️ Overdue' : `📅 ${task.dueDate}`}
              </span>
            )}
            {subtasks.length > 0 && (
              <span className="tag" style={{ background: '#f0fdf4', color: '#15803d' }}>
                ✅ {doneSubs}/{subtasks.length}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: expanded ? '#e0f2fe' : 'none',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0ea5e9',
              transition: 'all 0.2s'
            }}
          >
            {expanded ? '▲' : '▼'} Subtasks
          </button>
          <button className="task-delete" onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>

      {/* Subtasks panel */}
      {expanded && (
        <div style={{
          marginTop: 12,
          marginLeft: 36,
          padding: 12,
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0'
        }}>
          {/* Subtask progress bar */}
          {subtasks.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: 4 }}>
                <span>Progress</span>
                <span>{doneSubs}/{subtasks.length}</span>
              </div>
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${subtasks.length ? (doneSubs / subtasks.length) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, #0ea5e9, #22c55e)',
                  borderRadius: 999,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Subtask list */}
          {subtasks.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8, textAlign: 'center' }}>
              No subtasks yet — add one below!
            </p>
          )}
          {subtasks.map(sub => (
            <div key={sub.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 0',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <button
                onClick={() => toggleSubtask(sub.id)}
                style={{
                  width: 18, height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${sub.done ? '#22c55e' : '#cbd5e1'}`,
                  background: sub.done ? '#22c55e' : 'white',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', color: 'white', flexShrink: 0
                }}
              >
                {sub.done && '✓'}
              </button>
              <span style={{
                fontSize: '0.8rem', flex: 1, color: '#1e293b',
                textDecoration: sub.done ? 'line-through' : 'none',
                opacity: sub.done ? 0.5 : 1
              }}>
                {sub.text}
              </span>
              <button
                onClick={() => deleteSubtask(sub.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add subtask input */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSubtask()}
              placeholder="Add a subtask..."
              style={{
                flex: 1, padding: '6px 10px', borderRadius: 8,
                border: '1px solid #e2e8f0', fontSize: '0.8rem',
                outline: 'none', fontFamily: 'inherit'
              }}
            />
            <button
              onClick={addSubtask}
              style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: '#0ea5e9', color: 'white',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}