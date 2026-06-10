import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

export default function Login() {
  const navigate                                              = useNavigate()
  const { login, loginWithFigma, signup, sendPasswordReset, addToast } = useApp()
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode,    setMode]    = useState('signin')
  const [error,   setError]   = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email) { addToast('Enter your email', 'error'); return }
    if (mode !== 'reset' && !pass) { addToast('Enter your password', 'error'); return }
    setLoading(true)
    try {
      if (mode === 'reset') {
        const r = await sendPasswordReset(email)
        if (r.success) { addToast('Reset link sent to ' + email, 'success'); setMode('signin') }
        else setError(r.error)
        return
      }
      if (mode === 'signin') {
        const r = await login(email, pass)
        if (r.success) { addToast('Welcome back', 'success'); navigate('/dashboard') }
        else { setError(r.error); addToast(r.error, 'error') }
        return
      }
      if (mode === 'signup') {
        const r = await signup(email, pass)
        if (r.success) { addToast('Account created — set up your profile', 'success'); navigate('/onboarding') }
        else { setError(r.error); addToast(r.error, 'error') }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFigma = async () => {
    setLoading(true)
    const r = await loginWithFigma()
    if (!r.success) { addToast(r.error || 'Figma login failed', 'error'); setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#120609', display:'flex', flexDirection:'column' }}>

      <header style={{ borderBottom:'1px solid #3d1f28', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ position:'relative', width:24, height:24 }}>
            <div style={{ position:'absolute', top:0, left:0, width:12, height:12, background:'#ff2d78' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, background:'#ff2d78', opacity:0.6 }} />
          </div>
          <span style={{ fontFamily:SYNE, fontSize:18, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#f5e8ec' }}>Figlog</span>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          style={{ fontFamily:SYNE, fontSize:13, fontWeight:600, padding:'9px 20px', background:'#ff2d78', border:'none', color:'#fff', cursor:'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
          onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
        >Start Crafting</button>
      </header>

      <main style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ width:'100%', maxWidth:440 }}>

          <div style={{ position:'relative', marginBottom:40 }}>
            <div style={{ position:'absolute', top:-60, right:-20, fontFamily:SYNE, fontSize:180, fontWeight:800, color:'transparent', WebkitTextStroke:'1px rgba(255,45,120,0.06)', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
              {mode === 'signup' ? '02' : mode === 'reset' ? '↺' : '01'}
            </div>
            <p style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:8 }}>
              {mode === 'signin' ? 'Returning Artisan' : mode === 'signup' ? 'New Artisan' : 'Access Recovery'}
            </p>
            <h1 style={{ fontFamily:SYNE, fontSize:42, fontWeight:600, color:'#f5e8ec', lineHeight:1, margin:0 }}>
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p style={{ fontFamily:BODY, fontSize:13, color:'#7a5060', marginTop:10, lineHeight:1.6 }}>
              {mode === 'signin' ? 'Access your design workspace and streak history.'
                : mode === 'signup' ? 'Join 12,000+ artisans tracking their creative output.'
                : "Enter your email and we'll send a recovery link."}
            </p>
          </div>

          {mode !== 'reset' && (
            <>
              <button
                onClick={handleFigma}
                disabled={loading}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, border:'1px solid #4a2530', padding:13, background:'transparent', fontFamily:MONO, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', marginBottom:16 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="8"  cy="8"  r="4" fill="#F24E1E"/>
                  <circle cx="16" cy="8"  r="4" fill="#FF7262"/>
                  <circle cx="8"  cy="16" r="4" fill="#0ACF83"/>
                  <circle cx="16" cy="16" r="4" fill="#1ABCFE"/>
                </svg>
                {loading ? 'Redirecting…' : 'Continue with Figma'}
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ flex:1, height:1, background:'#3d1f28' }} />
                <span style={{ fontFamily:MONO, fontSize:10, color:'#7a5060' }}>OR</span>
                <div style={{ flex:1, height:1, background:'#3d1f28' }} />
              </div>
            </>
          )}

          <div style={{ marginBottom:12 }}>
            <p style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:6 }}>Email</p>
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="artisan@studio.io"
              style={{ width:'100%', background:'#1e0d13', border:`1px solid ${error ? '#ff2d78' : '#3d1f28'}`, padding:'12px 14px', fontFamily:MONO, fontSize:12, color:'#f5e8ec', outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#ff2d78'}
              onBlur={e => e.target.style.borderColor = error ? '#ff2d78' : '#3d1f28'}
            />
          </div>

          {mode !== 'reset' && (
            <div style={{ marginBottom: mode === 'signin' ? 8 : 24 }}>
              <p style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:6 }}>Password</p>
              <div style={{ position:'relative' }}>
                <input
                  type={show ? 'text' : 'password'} value={pass}
                  onChange={e => setPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••••••"
                  style={{ width:'100%', background:'#1e0d13', border:'1px solid #3d1f28', padding:'12px 40px 12px 14px', fontFamily:MONO, fontSize:12, color:'#f5e8ec', outline:'none', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor='#ff2d78'}
                  onBlur={e => e.target.style.borderColor='#3d1f28'}
                />
                <button onClick={() => setShow(s => !s)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#7a5060', cursor:'pointer', display:'flex' }}>
                  {show ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
          )}

          {error && <p style={{ fontFamily:MONO, fontSize:10, color:'#ff2d78', marginBottom:12 }}>⚠ {error}</p>}

          {mode === 'signin' && (
            <div style={{ textAlign:'right', marginBottom:24 }}>
              <button onClick={() => setMode('reset')}
                style={{ fontFamily:MONO, fontSize:10, color:'#7a5060', background:'none', border:'none', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color='#ff2d78'}
                onMouseLeave={e => e.currentTarget.style.color='#7a5060'}>
                Forgot password?
              </button>
            </div>
          )}
          {mode === 'reset' && <div style={{ marginBottom:24 }} />}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{ width:'100%', padding:14, background: loading ? '#cc1f5e' : '#ff2d78', border:'none', fontFamily:MONO, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 }}
          >
            {loading ? 'Processing…' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            {!loading && <ArrowRight size={13}/>}
          </button>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <span style={{ fontFamily:MONO, fontSize:10, color:'#7a5060' }}>
              {mode === 'signin' ? "Don't have an account?" : mode === 'signup' ? 'Already have an account?' : 'Remember your password?'}
            </span>
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setPass(''); setError('') }}
              style={{ fontFamily:MONO, fontSize:10, color:'#ff2d78', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </div>

          <div style={{ textAlign:'center', marginTop:24 }}>
            <button onClick={() => navigate(-1)}
              style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4a2f38', background:'none', border:'none', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color='#7a5060'}
              onMouseLeave={e => e.currentTarget.style.color='#4a2f38'}>
              ← Go Back
            </button>
          </div>
        </div>
      </main>

      <footer style={{ borderTop:'1px solid #3d1f28', height:40, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', flexShrink:0 }}>
        <span style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#4a2f38' }}>© 2026 FIGLOG</span>
        <div style={{ display:'flex', gap:24 }}>
          {['Documentation','Support'].map(l => (
            <a key={l} href="#" style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a5060', textDecoration:'none' }}
              onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
              onMouseLeave={e => e.currentTarget.style.color='#7a5060'}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}