import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#facc15']

export default function Charts({ tasks }) {
  if (tasks.length === 0) return (
    <div style={{
      background: 'white', borderRadius: 24, padding: 28,
      border: '2px solid #e0f2fe', textAlign: 'center'
    }}>
      <p style={{ fontSize: '2rem', marginBottom: 8 }}>📊</p>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>
        Add some tasks to see your analytics!
      </p>
    </div>
  )

  // ── Data calculations ──────────────────────────────────────

  // Tasks by type
  const byType = Object.entries(
    tasks.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Tasks by subject
  const bySubject = Object.entries(
    tasks.reduce((acc, t) => {
      acc[t.subject] = (acc[t.subject] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Completion by priority
  const priorities = ['High', 'Medium', 'Low']
  const byPriority = priorities.map(p => {
    const total  = tasks.filter(t => t.priority === p).length
    const done   = tasks.filter(t => t.priority === p && t.completed).length
    return { name: p, Total: total, Done: done }
  }).filter(p => p.Total > 0)

  // Overall stats
  const total     = tasks.length
  const done      = tasks.filter(t => t.completed).length
  const pending   = total - done
  const pct       = total ? Math.round((done / total) * 100) : 0
  const overdue   = tasks.filter(t =>
    t.dueDate && !t.completed && new Date(t.dueDate) < new Date()
  ).length

  const completionData = [
    { name: 'Done',    value: done },
    { name: 'Pending', value: pending },
  ].filter(d => d.value > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: 20, padding: '20px 24px',
        border: '2px solid #e0f2fe',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
          📊 Analytics Dashboard
        </p>

        {/* Stat pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Total Tasks',  value: total,   color: '#0ea5e9', bg: '#e0f2fe' },
            { label: 'Completed',    value: done,    color: '#22c55e', bg: '#dcfce7' },
            { label: 'Pending',      value: pending, color: '#f97316', bg: '#fff7ed' },
            { label: 'Overdue',      value: overdue, color: '#ef4444', bg: '#fee2e2' },
            { label: 'Success Rate', value: `${pct}%`, color: '#a855f7', bg: '#f3e8ff' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 12,
              padding: '10px 16px', textAlign: 'center', flex: '1 1 80px'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: s.color, fontWeight: 700, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion pie + Priority bar — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Pie — completion */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 20,
          border: '2px solid #dcfce7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            ✅ Completion
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {completionData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#22c55e' : '#f97316'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar — priority */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 20,
          border: '2px solid #f3e8ff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            🎯 By Priority
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={byPriority} barSize={14}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Total" fill="#e0f2fe" radius={4} />
              <Bar dataKey="Done"  fill="#0ea5e9" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar — by type */}
      <div style={{
        background: 'white', borderRadius: 20, padding: 20,
        border: '2px solid #fff7ed', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          🏷️ Tasks by Type
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={byType} barSize={20}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={6}>
              {byType.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie — by subject */}
      <div style={{
        background: 'white', borderRadius: 20, padding: 20,
        border: '2px solid #fce7f3', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          📚 Tasks by Subject
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={bySubject}
              cx="50%" cy="50%"
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {bySubject.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}