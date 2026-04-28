import { useState, useMemo, useEffect } from 'react'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'

const DEFAULT_SUBJECTS = ['Data Structures', 'Machine Learning']

export default function App() {
  const { tasks, addTask, deleteTask, toggleTask } = useTasks()
  const [search,   setSearch]   = useState('')
  const [dark,     setDark]     = useState(false)
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS)
  const [filters,  setFilters]  = useState({ status: 'All', subject: 'All', type: 'All' })

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
  }, [dark])

  const addSubject = (s) => {
    if (s && !subjects.includes(s)) setSubjects(prev => [...prev, s])
  }
  const removeSubject = (s) => {
    setSubjects(prev => prev.filter(x => x !== s))
    setFilters(f => ({ ...f, subject: 'All' }))
  }

  const filtered = useMemo(() => tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.status  === 'Completed' && !t.completed) return false
    if (filters.status  === 'Pending'   &&  t.completed) return false
    if (filters.subject !== 'All' && t.subject !== filters.subject) return false
    if (filters.type    !== 'All' && t.type    !== filters.type)    return false
    return true
  }), [tasks, search, filters])

  const total   = tasks.length
  const done    = tasks.filter(t => t.completed).length
  const pending = total - done

  return (
    <div className="app">
      <div className="topbar">
        <button className="dark-toggle" onClick={() => setDark(d => !d)}>
          {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="header">
        <h1>🖥️ DevDesk</h1>
        <p>Your personal CSE study & task tracker</p>
      </div>

      <div className="stats">
        <div className="stat-card blue"><div className="num">{total}</div><div className="label">Total</div></div>
        <div className="stat-card orange"><div className="num">{pending}</div><div className="label">Pending</div></div>
        <div className="stat-card green"><div className="num">{done}</div><div className="label">Done ✓</div></div>
      </div>

      {total > 0 && (
        <div className="progress-card">
          <div className="progress-header"><span>Overall Progress</span><span>{Math.round((done/total)*100)}%</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(done/total)*100}%` }} /></div>
        </div>
      )}

      <TaskForm onAdd={addTask} subjects={subjects} onAddSubject={addSubject} onRemoveSubject={removeSubject} />
      <SearchBar search={search} setSearch={setSearch} />
      <FilterBar filters={filters} setFilters={setFilters} subjects={subjects} />
      <TaskList tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} />
<div className="footer">
        💻 DevDesk · Built for CSE Students · {new Date().getFullYear()}
      </div>
    </div>
  )
}
