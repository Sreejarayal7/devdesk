import { useState, useEffect, useRef } from 'react'

const MODES = {
  focus:      { label: '🔴 Focus',       minutes: 25, color: '#ef4444', light: '#fee2e2' },
  shortBreak: { label: '🟢 Short Break', minutes: 5,  color: '#22c55e', light: '#dcfce7' },
  longBreak:  { label: '🔵 Long Break',  minutes: 15, color: '#0ea5e9', light: '#e0f2fe' },
}

export default function PomodoroTimer() {
  const [mode,      setMode]      = useState('focus')
  const [seconds,   setSeconds]   = useState(25 * 60)
  const [running,   setRunning]   = useState(false)
  const [rounds,    setRounds]    = useState(0)
  const [sessions,  setSessions]  = useState(0)
  const intervalRef = useRef(null)
  const current = MODES[mode]

  // Tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const handleComplete = () => {
    // Play a soft beep
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch(e) {}

    if (mode === 'focus') {
      const newRounds = rounds + 1
      setRounds(newRounds)
      setSessions(s => s + 1)
      if (newRounds % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('focus')
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setSeconds(MODES[newMode].minutes * 60)
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(current.minutes * 60)
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const total = current.minutes * 60
  const progress = ((total - seconds) / total) * 100
  const circumference = 2 * Math.PI * 90
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div style={{
      background: 'white',
      borderRadius: 24,
      padding: '28px 24px',
      border: `2px solid ${current.light}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        🍅 Pomodoro Timer
      </p>

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: `2px solid ${mode === key ? val.color : '#e2e8f0'}`,
              background: mode === key ? val.color : 'white',
              color: mode === key ? 'white' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Circular progress */}
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke={current.light} strokeWidth="10" />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke={current.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: current.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {mins}:{secs}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
            {current.label}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            padding: '12px 36px',
            borderRadius: 14,
            border: 'none',
            background: running
              ? '#f1f5f9'
              : `linear-gradient(90deg, ${current.color}, ${current.color}cc)`,
            color: running ? '#64748b' : 'white',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: running ? 'none' : `0 4px 12px ${current.color}44`,
            transition: 'all 0.2s',
            minWidth: 120,
          }}
        >
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '12px 20px',
            borderRadius: 14,
            border: '2px solid #e2e8f0',
            background: 'white',
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ↺
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div style={{
          background: '#fef9c3', borderRadius: 12, padding: '8px 16px',
          border: '1px solid #fef08a'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ca8a04' }}>{sessions}</div>
          <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 600 }}>Sessions</div>
        </div>
        <div style={{
          background: '#fee2e2', borderRadius: 12, padding: '8px 16px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#dc2626' }}>{rounds % 4}/4</div>
          <div style={{ fontSize: '0.68rem', color: '#991b1b', fontWeight: 600 }}>Round</div>
        </div>
        <div style={{
          background: '#dcfce7', borderRadius: 12, padding: '8px 16px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a' }}>{sessions * 25}m</div>
          <div style={{ fontSize: '0.68rem', color: '#14532d', fontWeight: 600 }}>Focused</div>
        </div>
      </div>
    </div>
  )
}