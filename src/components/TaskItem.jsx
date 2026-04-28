const TYPE_EMOJI = {
  'Assignment':      '📝',
  'Lab Work':        '🧪',
  'Exam Prep':       '📖',
  'Project':         '🛠️',
  'Coding Practice': '💻',
  'Deadline':        '⏰',
}

const PRIORITY_LABEL = {
  High:   { cls: 'tag tag-high',   icon: '🔴' },
  Medium: { cls: 'tag tag-med',    icon: '🟡' },
  Low:    { cls: 'tag tag-low',    icon: '🟢' },
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()
  const p = PRIORITY_LABEL[task.priority]

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
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
        </div>
      </div>

      <button className="task-delete" onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
    </div>
  )
}