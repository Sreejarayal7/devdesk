const KEY = 'cse-tasks'

export const loadTasks = () => {
  try {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveTasks = (tasks) => {
  localStorage.setItem(KEY, JSON.stringify(tasks))
}