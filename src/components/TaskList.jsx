import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-3">🎓</p>
        <p className="text-gray-400 text-sm font-medium">No tasks yet — add one above and crush it!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}