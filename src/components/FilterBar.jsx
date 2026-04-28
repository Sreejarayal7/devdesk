const TYPES    = ['All', 'Assignment', 'Lab Work', 'Exam Prep', 'Project', 'Coding Practice', 'Deadline']
const STATUSES = ['All', 'Pending', 'Completed']

export default function FilterBar({ filters, setFilters, subjects }) {
  const activeCls = (key, value) => {
    if (filters[key] !== value) return ''
    if (key === 'status')  return 'active-blue'
    if (key === 'subject') return 'active-green'
    return 'active-yellow'
  }

  const pill = (key, value) => (
    <button
      key={value}
      onClick={() => setFilters(f => ({ ...f, [key]: value }))}
      style={{
        display: 'inline-block',
        padding: '5px 14px',
        borderRadius: '999px',
        fontSize: '0.73rem',
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        border: filters[key] === value ? '2px solid transparent' : '2px solid #e2e8f0',
        background: filters[key] === value
          ? key === 'status'  ? '#0ea5e9'
          : key === 'subject' ? '#22c55e'
          :                     '#facc15'
          : 'white',
        color: filters[key] === value
          ? key === 'type' ? '#1e293b' : 'white'
          : '#64748b',
        boxShadow: filters[key] === value ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {value}
    </button>
  )

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 16,
      border: '2px solid #bae6fd',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', width: 58, flexShrink: 0 }}>Status</span>
        {STATUSES.map(s => pill('status', s))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', width: 58, flexShrink: 0 }}>Subject</span>
        {['All', ...subjects].map(s => pill('subject', s))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', width: 58, flexShrink: 0 }}>Type</span>
        {TYPES.map(t => pill('type', t))}
      </div>
    </div>
  )
}