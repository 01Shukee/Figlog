import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

const STEPS = ['Connect','Profile','Preferences','Done']

function StepIndicator({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:'40px' }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:`1px solid ${i <= current ? '#ff2d78' : '#3d1f28'}`, background: i < current ? '#ff2d78' : i === current ? 'rgba(255,45,120,0.15)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              {i < current
                ? <CheckCircle size={14} color="white" />
                : <span style={{ fontFamily:MONO, fontSize:'10px', color: i === current ? '#ff2d78' : '#7a5060' }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontFamily:MONO, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', color: i === current ? '#ff2d78' : i < current ? '#c4909f' : '#7a5060' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex:1, height:1, background: i < current ? '#ff2d78' : '#3d1f28', margin:'0 8px', marginBottom:20, transition:'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function AuthSettings() {
  const navigate           = useNavigate()
  const { addToast }       = useApp()
  const [step,  setStep]   = useState(0)
  const [email, setEmail]  = useState('')
  const [pass,  setPass]   = useState('')
  const [show,  setShow]   = useState(false)
  const [handle, setHandle] = useState('')
  const [notifs, setNotifs] = useState({ streak:true, commits:false, milestones:true })
  const [loading, setLoading] = useState(false)

  const proceed = (n) => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(n) }, 800)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#120609', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px' }}>
      <div style={{ width:'100%', maxWidth:520 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'48px' }}>
          <div style={{ position:'relative', width:24, height:24 }}>
            <div style={{ position:'absolute', top:0, left:0, width:12, height:12, background:'#ff2d78' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, background:'#ff2d78', opacity:0.6 }} />
          </div>
          <span style={{ fontFamily:SYNE, fontSize:'18px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#f5e8ec' }}>Figlog</span>
        </div>

        <StepIndicator current={step} />

        {/* ── Step 0: Connect ── */}
        {step === 0 && (
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'8px' }}>Step 1</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'36px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px', lineHeight:1 }}>Connect your account</h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'32px', lineHeight:1.6 }}>
              Sign in or create a free Figlog account to start tracking your design activity.
            </p>

            {/* Figma OAuth */}
            <button
              onClick={() => proceed(1)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', border:'1px solid #4a2530', padding:'14px', background:'transparent', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', marginBottom:'16px', transition:'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="8"  cy="8"  r="4" fill="#F24E1E"/>
                <circle cx="16" cy="8"  r="4" fill="#FF7262"/>
                <circle cx="8"  cy="16" r="4" fill="#0ACF83"/>
                <circle cx="16" cy="16" r="4" fill="#1ABCFE"/>
              </svg>
              Continue with Figma
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
              <div style={{ flex:1, height:1, background:'#3d1f28' }} />
              <span style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>OR</span>
              <div style={{ flex:1, height:1, background:'#3d1f28' }} />
            </div>

            {/* Email */}
            <div style={{ marginBottom:'12px' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>Email</p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="artisan@studio.io"
                style={{ width:'100%', background:'#1e0d13', border:'1px solid #3d1f28', padding:'12px 14px', fontFamily:MONO, fontSize:'12px', color:'#f5e8ec', outline:'none', transition:'border-color 0.15s', boxSizing:'border-box' }}
                onFocus={e => e.target.style.borderColor='#ff2d78'}
                onBlur={e => e.target.style.borderColor='#3d1f28'}
              />
            </div>

            <div style={{ marginBottom:'24px' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>Password</p>
              <div style={{ position:'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width:'100%', background:'#1e0d13', border:'1px solid #3d1f28', padding:'12px 40px 12px 14px', fontFamily:MONO, fontSize:'12px', color:'#f5e8ec', outline:'none', transition:'border-color 0.15s', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor='#ff2d78'}
                  onBlur={e => e.target.style.borderColor='#3d1f28'}
                />
                <button
                  onClick={() => setShow(s => !s)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#7a5060', cursor:'pointer', display:'flex' }}
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => email && pass ? proceed(1) : addToast('Fill in all fields', 'error')}
              style={{ width:'100%', padding:'14px', background: loading ? '#cc1f5e' : '#ff2d78', border:'none', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
            >
              {loading ? 'Connecting…' : 'Sign In'} {!loading && <ArrowRight size={13} />}
            </button>
          </div>
        )}

        {/* ── Step 1: Profile ── */}
        {step === 1 && (
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'8px' }}>Step 2</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'36px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px', lineHeight:1 }}>Set your artisan handle</h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'32px', lineHeight:1.6 }}>
              This is your public identity on the Figlog network. Choose wisely.
            </p>

            <div style={{ marginBottom:'8px' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>Handle</p>
              <div style={{ display:'flex', alignItems:'center', border:'1px solid #3d1f28', background:'#1e0d13', transition:'border-color 0.15s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor='#ff2d78'}
                onBlurCapture={e => e.currentTarget.style.borderColor='#3d1f28'}
              >
                <span style={{ fontFamily:MONO, fontSize:'12px', color:'#7a5060', padding:'12px 0 12px 14px' }}>figlog.com/</span>
                <input
                  value={handle}
                  onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                  placeholder="your_handle"
                  style={{ flex:1, background:'transparent', border:'none', padding:'12px 14px 12px 4px', fontFamily:MONO, fontSize:'12px', color:'#f5e8ec', outline:'none' }}
                />
              </div>
            </div>

            {handle && (
              <p style={{ fontFamily:MONO, fontSize:'10px', color:'#4ade80', marginBottom:'24px' }}>
                ✓ figlog.com/{handle} is available
              </p>
            )}
            {!handle && <div style={{ marginBottom:'24px' }} />}

            <button
              onClick={() => handle ? proceed(2) : addToast('Choose a handle', 'error')}
              style={{ width:'100%', padding:'14px', background: loading ? '#cc1f5e' : '#ff2d78', border:'none', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
            >
              {loading ? 'Saving…' : 'Continue'} {!loading && <ArrowRight size={13} />}
            </button>
          </div>
        )}

        {/* ── Step 2: Preferences ── */}
        {step === 2 && (
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'8px' }}>Step 3</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'36px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px', lineHeight:1 }}>Notification preferences</h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'32px', lineHeight:1.6 }}>
              Choose what you want Figlog to notify you about.
            </p>

            {[
              { key:'streak',     label:'Streak Alerts',     desc:'Notify me when I\'m at risk of breaking a streak' },
              { key:'commits',    label:'Commit Reminders',  desc:'Daily reminder to commit if no activity detected' },
              { key:'milestones', label:'Milestone Unlocks', desc:'Celebrate when I hit a new streak milestone' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px', border:`1px solid ${notifs[key] ? 'rgba(255,45,120,0.3)' : '#3d1f28'}`, marginBottom:'8px', cursor:'pointer', background: notifs[key] ? 'rgba(255,45,120,0.04)' : 'transparent', transition:'all 0.15s' }}
              >
                <div>
                  <p style={{ fontFamily:BODY, fontSize:'13px', fontWeight:600, color:'#f5e8ec', marginBottom:'2px' }}>{label}</p>
                  <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>{desc}</p>
                </div>
                <div style={{ width:40, height:20, borderRadius:20, background: notifs[key] ? '#ff2d78' : '#2e1820', border: notifs[key] ? 'none' : '1px solid #4a2530', position:'relative', flexShrink:0, transition:'background 0.2s' }}>
                  <span style={{ position:'absolute', top:2, left: notifs[key] ? 22 : 2, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
                </div>
              </div>
            ))}

            <button
              onClick={() => proceed(3)}
              style={{ width:'100%', padding:'14px', marginTop:'16px', background: loading ? '#cc1f5e' : '#ff2d78', border:'none', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
            >
              {loading ? 'Saving…' : 'Save Preferences'} {!loading && <ArrowRight size={13} />}
            </button>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:64, height:64, background:'rgba(255,45,120,0.1)', border:'1px solid rgba(255,45,120,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
              <CheckCircle size={28} color="#ff2d78" />
            </div>
            <h2 style={{ fontFamily:SYNE, fontSize:'36px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px', lineHeight:1 }}>
              You're all set.
            </h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'32px', lineHeight:1.6 }}>
              Welcome to Figlog{handle ? `, @${handle}` : ''}. Your design activity is now being tracked. Start committing to build your streak.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ width:'100%', padding:'14px', background:'#ff2d78', border:'none', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
              onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
              onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
            >
              Go to Dashboard <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}