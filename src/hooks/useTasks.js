import { useState, useEffect } from 'react'
import { loadTasks, saveTasks } from '../utils/storage'

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (task) => {
    setTasks(prev => [{
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...task
    }, ...prev])
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  return { tasks, addTask, deleteTask, toggleTask }
}