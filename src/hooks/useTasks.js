import { useState, useEffect, useRef } from 'react'

export function useTasks(userId) {
  const KEY = `devdesk-tasks-${userId || 'guest'}`
  const initialized = useRef(false)

  const [tasks, setTasks] = useState([])

  // Load from localStorage when userId is ready
  useEffect(() => {
    if (!userId) return
    try {
      const data = localStorage.getItem(KEY)
      setTasks(data ? JSON.parse(data) : [])
      initialized.current = true
    } catch {
      setTasks([])
      initialized.current = true
    }
  }, [userId, KEY])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!initialized.current) return
    if (!userId) return
    localStorage.setItem(KEY, JSON.stringify(tasks))
  }, [tasks, KEY, userId])

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

  return { tasks, loading: false, addTask, deleteTask, toggleTask }
}