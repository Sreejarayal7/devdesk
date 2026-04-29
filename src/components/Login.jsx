import { signInWithGoogle } from '../firebase'

export default function Login() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f2fe, #f0fdf4, #fef9c3)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '48px 40px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '2px solid #bae6fd',
        maxWidth: 400,
        width: '90%'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🖥️</div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 900,
          background: 'linear-gradient(90deg, #0ea5e9, #22c55e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8
        }}>DevDesk</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 8 }}>
          Your personal CSE study & task tracker
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 32 }}>
          Sign in to save your tasks to the cloud ☁️
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 14,
            border: '2px solid #e2e8f0',
            background: 'white',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#0ea5e9'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(14,165,233,0.2)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={22} height={22} alt="Google"
          />
          Sign in with Google
        </button>

        <p style={{ color: '#cbd5e1', fontSize: '0.72rem', marginTop: 24 }}>
          🔒 Secure · Free · No password needed
        </p>
      </div>
    </div>
  )
}