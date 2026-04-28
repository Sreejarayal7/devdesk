import { useState } from 'react'

const TYPES     = ['Assignment', 'Lab Work', 'Exam Prep', 'Project', 'Coding Practice', 'Deadline']
const PRIORITIES = ['High', 'Medium', 'Low']

export default function TaskForm({ onAdd, subjects, onAddSubject, onRemoveSubject }) {
  const [title,       setTitle]       = useState('')
  const [subject,     setSubject]     = useState(subjects[0] || '')
  const [type,        setType]        = useState('Assignment')
  const [priority,    setPriority]    = useState('Medium')
  const [dueDate,     setDueDate]     = useState('')
  const [note,        setNote]        = useState('')
  const [newSubject,  setNewSubject]  = useState('')

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), subject: subject || subjects[0], type, priority, dueDate, note })
    setTitle(''); setDueDate(''); setNote('')
  }

  const handleAddSubject = () => {
    const s = newSubject.trim()
    if (!s) return
    onAddSubject(s)
    setNewSubject('')
    setSubject(s)
  }

  return (
    <div className="form-card">
      <p className="form-label">➕ New Task</p>

      <input
        className="form-input"
        placeholder="What do you need to do? (Enter to add)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />

      <textarea
        className="form-textarea"
        placeholder="Notes, links, or details... (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
      />

      {/* Subject manager */}
      <div>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
          📚 Subjects (type your own)
        </p>
        <div className="subject-input-row">
          <input
            placeholder="Add a subject e.g. DBMS, CN..."
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
          />
          <button className="btn-add-subject" onClick={handleAddSubject}>+ Add</button>
        </div>
        {subjects.length > 0 && (
          <div className="subject-tags" style={{ marginTop: 8 }}>
            {subjects.map(s => (
              <span key={s} className="subject-tag">
                {s}
                <button onClick={() => onRemoveSubject(s)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-row">
        <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <input
          className="form-input"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <button className="btn-add" onClick={handleSubmit}>Add Task 🚀</button>
    </div>
  )
}