import Charts from './components/Charts'
import PomodoroTimer from './components/PomodoroTimer'
import { useState, useMemo, useEffect } from 'react'
import { auth, logOut } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'
import Login from './components/Login'

const DEFAULT_SUBJECTS = ['Data Structures', 'Machine Learning']

export default function App() {
  const { tasks, addTask, deleteTask, toggleTask } = useTasks()
  const [user,       setUser]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [search,    setSearch]    = useState('')
  const [dark,      setDark]      = useState(false)
  const [subjects,  setSubjects]  = useState(DEFAULT_SUBJECTS)
  const [filters,   setFilters]   = useState({ status: 'All', subject: 'All', type: 'All' })
  const [showCharts, setShowCharts] = useState(false)

  // Listen for login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
  }, [dark])

  const addSubject    = (s) => { if (s && !subjects.includes(s)) setSubjects(p => [...p, s]) }
  const removeSubject = (s) => { setSubjects(p => p.filter(x => x !== s)); setFilters(f => ({ ...f, subject: 'All' })) }

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

  // Loading screen
  if (authLoading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f2fe, #f0fdf4)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🖥️</div>
        <p style={{ color: '#0ea5e9', fontWeight: 700 }}>Loading DevDesk...</p>
      </div>
    </div>
  )

  // Login screen
  if (!user) return <Login />

  // Main app
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="app">

        {/* Top bar */}
        <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={user.photoURL}
              width={36} height={36}
              style={{ borderRadius: '50%', border: '2px solid #bae6fd' }}
              alt="avatar"
            />
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Hi, {user.displayName?.split(' ')[0]}! 👋
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="dark-toggle" onClick={() => setDark(d => !d)}>
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              className="dark-toggle"
              onClick={logOut}
              style={{ borderColor: '#fecaca', color: '#ef4444' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="header">
          <h1>🖥️ DevDesk</h1>
          <p>Your personal CSE study & task tracker</p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card blue"><div className="num">{total}</div><div className="label">Total</div></div>
          <div className="stat-card orange"><div className="num">{pending}</div><div className="label">Pending</div></div>
          <div className="stat-card green"><div className="num">{done}</div><div className="label">Done ✓</div></div>
        </div>

        {/* Progress */}
        {total > 0 && (
          <div className="progress-card">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span>{Math.round((done / total) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
        )}
        {/* Pomodoro Timer */}
        <PomodoroTimer />

        {/* Charts toggle */}
<button
  onClick={() => setShowCharts(s => !s)}
  style={{
    width: '100%',
    padding: '12px',
    borderRadius: 14,
    border: '2px solid #e0f2fe',
    background: showCharts ? '#0ea5e9' : 'white',
    color: showCharts ? 'white' : '#0ea5e9',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}
>
  {showCharts ? '📋 Show Tasks' : '📊 Show Analytics'}
</button>

{showCharts
  ? <Charts tasks={tasks} />
  : <>
      <TaskForm onAdd={addTask} subjects={subjects} onAddSubject={addSubject} onRemoveSubject={removeSubject} />
      <SearchBar search={search} setSearch={setSearch} />
      <FilterBar filters={filters} setFilters={setFilters} subjects={subjects} />
      <TaskList tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} />
    </>
}
        

        <div className="footer">
          💻 DevDesk · Built for CSE Students · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}