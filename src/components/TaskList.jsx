import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete, onUpdateSubtasks }) {
  if (tasks.length === 0) return (
    <div className="empty-state">
      <div className="emoji">🎓</div>
      <p>No tasks yet — add one above and crush it!</p>
    </div>
  )
  return (
    <div className="tasks-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateSubtasks={onUpdateSubtasks}
        />
      ))}
    </div>
  )
}