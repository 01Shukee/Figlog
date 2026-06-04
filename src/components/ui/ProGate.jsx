import { useNavigate } from 'react-router-dom'
import { Lock, Zap } from 'lucide-react'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

// Usage: wrap any pro-only section
// <ProGate feature="Advanced Analytics" description="...">
//   <YourProContent />
// </ProGate>

export default function ProGate({ feature, description, children, inline = false }) {
  const navigate = useNavigate()

  if (inline) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'rgba(255,45,120,0.04)', border:'1px solid rgba(255,45,120,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Lock size={13} color="#ff2d78" />
          <span style={{ fontFamily:MONO, fontSize:'11px', color:'#c4909f' }}>
            {feature} — Pro only
          </span>
        </div>
        <button
          onClick={() => navigate('/settings')}
          style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'6px 14px', background:'#ff2d78', border:'none', color:'#fff', cursor:'pointer', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
          onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
        >
          Upgrade
        </button>
      </div>
    )
  }

  return (
    <div style={{ position:'relative', overflow:'hidden' }}>
      {/* Blurred preview */}
      <div style={{ filter:'blur(4px)', opacity:0.3, pointerEvents:'none', userSelect:'none' }}>
        {children}
      </div>

      {/* Gate overlay */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(18,6,9,0.7)', backdropFilter:'blur(2px)' }}>
        <div style={{ textAlign:'center', padding:'32px 40px', background:'#1e0d13', border:'1px solid #4a2530', maxWidth:360 }}>
          <div style={{ width:44, height:44, background:'rgba(255,45,120,0.1)', border:'1px solid rgba(255,45,120,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <Zap size={20} color="#ff2d78" />
          </div>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'8px' }}>
            Pro Feature
          </p>
          <h3 style={{ fontFamily:SYNE, fontSize:'22px', fontWeight:600, color:'#f5e8ec', marginBottom:'10px' }}>
            {feature}
          </h3>
          {description && (
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', lineHeight:1.6, marginBottom:'20px' }}>
              {description}
            </p>
          )}
          <button
            onClick={() => navigate('/settings')}
            style={{ width:'100%', padding:'12px', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', background:'#ff2d78', border:'none', color:'#fff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
          >
            Upgrade to Pro
          </button>
          <button
            onClick={() => navigate('/analytics')}
            style={{ width:'100%', padding:'10px', fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', background:'transparent', border:'none', color:'#7a5060', cursor:'pointer', marginTop:'8px', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
            onMouseLeave={e => e.currentTarget.style.color='#7a5060'}
          >
            See what's included →
          </button>
        </div>
      </div>
    </div>
  )
}