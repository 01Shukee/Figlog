import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Download, Calendar, Shield } from 'lucide-react'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

const heatBg = ['#1c0c11','#5c1a35','#991a4a','#cc1f5e','#ff2d78']

function heat(m, d, w) {
  const v = ((m * 7 + d * 13 + w * 3) * 2654435761) >>> 0
  const n = v % 256
  if (n < 55)  return 0
  if (n < 105) return 1
  if (n < 155) return 2
  if (n < 210) return 3
  return 4
}

function CognitiveMatrix() {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const days   = ['MON','TUE','WED','FRI']
  const WEEKS  = 4

  return (
    <div style={{ padding:'20px 24px 16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'3px' }}>
            Cognitive Load Matrix
          </p>
          <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>
            Identification of peak focus windows across the week
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <span style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', marginRight:'4px' }}>LOW</span>
          {heatBg.map((c,i) => <div key={i} style={{ width:10, height:10, background:c }} />)}
          <span style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', marginLeft:'4px' }}>PEAK</span>
        </div>
      </div>

      <div style={{ display:'flex', paddingLeft:'32px', marginBottom:'4px' }}>
        {months.map(m => (
          <div key={m} style={{ flex:1, fontFamily:MONO, fontSize:'9px', color:'#7a5060' }}>{m}</div>
        ))}
      </div>
      {days.map((day, di) => (
        <div key={day} style={{ display:'flex', alignItems:'center', marginBottom:'3px' }}>
          <span style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', width:'32px', flexShrink:0 }}>{day}</span>
          {months.map((_, mi) => (
            <div key={mi} style={{ flex:1, display:'flex', gap:'2px' }}>
              {Array.from({ length: WEEKS }, (_, wi) => (
                <div key={wi} style={{ flex:1, aspectRatio:'1', background:heatBg[heat(mi,di,wi)], minWidth:0 }} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function VelocityChart() {
  const bars = [35, 50, 40, 45, 38, 55, 42, 100, 48, 52, 44, 60, 46, 58]
  const peakIdx = bars.indexOf(100)

  return (
    <div style={{ position:'relative', height:140, display:'flex', alignItems:'flex-end', gap:'6px', padding:'0 0 24px' }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
          {i === peakIdx && (
            <span style={{ fontFamily:MONO, fontSize:'9px', color:'#ff2d78', letterSpacing:'0.1em', marginBottom:4 }}>PEAK</span>
          )}
          <div style={{ width:'100%', height:`${h}%`, background: i === peakIdx ? '#ff2d78' : '#2e1820', transition:'background 0.15s' }} />
        </div>
      ))}
      {/* X axis labels */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', justifyContent:'space-between' }}>
        {['OCT 01','OCT 15','TODAY'].map(l => (
          <span key={l} style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', letterSpacing:'0.08em' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

const projects = [
  { icon:'⬡', name:'Artisan_Design_System.fig', sub:'CORE LIBRARY • 12,402 LAYERS', time:'42.8h', period:'THIS WEEK' },
  { icon:'△', name:'Client_Alpha_App_Final.fig', sub:'PROTOTYPE • 82 SCREENS',       time:'18.5h', period:'THIS WEEK' },
  { icon:'⊘', name:'Icon_Master_Set_v4.fig',    sub:'ASSETS • 210 VECTORS',          time:'4.2h',  period:'THIS WEEK' },
]

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [range,  setRange]  = useState('Last 30 Days')

  return (
    <div style={{ minHeight:'100vh', background:'#120609', display:'flex', flexDirection:'column' }}>

      {/* ── Navbar ── */}
      <header style={{ borderBottom:'1px solid #3d1f28', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/dashboard')}>
          <div style={{ position:'relative', width:24, height:24 }}>
            <div style={{ position:'absolute', top:0, left:0, width:12, height:12, background:'#ff2d78' }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, background:'#ff2d78', opacity:0.6 }} />
          </div>
          <span style={{ fontFamily:SYNE, fontSize:'18px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#f5e8ec' }}>
            Figlog
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', background:'none', border:'none', cursor:'pointer', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
            onMouseLeave={e => e.currentTarget.style.color='#c4909f'}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ fontFamily:SYNE, fontSize:'13px', fontWeight:600, padding:'9px 20px', background:'#ff2d78', border:'none', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
          >
            Start Crafting
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex:1, maxWidth:1200, margin:'0 auto', width:'100%', padding:'40px 48px' }}>

        {/* ── Page header ── */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>
              System Overview
            </p>
            <h1 style={{ fontFamily:SYNE, fontSize:'52px', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1, color:'#f5e8ec', margin:0 }}>
              Advanced Metrics
            </h1>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginTop:'8px' }}>
              Deep-level velocity tracking and resource allocation for lead designers.
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <button
              style={{ display:'flex', alignItems:'center', gap:'8px', border:'1px solid #4a2530', padding:'9px 16px', background:'transparent', fontFamily:MONO, fontSize:'11px', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#4a2530'}
            >
              <Calendar size={12} />
              {range}
            </button>
            <button
              style={{ width:36, height:36, border:'1px solid #4a2530', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#c4909f', transition:'border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* ── Row 1: Velocity + Flow State ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'12px', marginBottom:'12px' }}>

          {/* Momentum Velocity */}
          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
              <div>
                <p style={{ fontFamily:SYNE, fontSize:'15px', fontWeight:600, color:'#f5e8ec', marginBottom:'3px' }}>Momentum Velocity</p>
                <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>Commit density vs. Production output</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontFamily:SYNE, fontSize:'32px', fontWeight:600, color:'#f5e8ec', lineHeight:1 }}>+24.8%</p>
                <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#4ade80', marginTop:4 }}>Accelerating</p>
              </div>
            </div>
            <VelocityChart />
          </div>

          {/* Flow State Index */}
          <div style={{ background:'#ff2d78', padding:'28px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <Zap size={20} color="rgba(0,0,0,0.5)" style={{ marginBottom:'12px' }} />
              <p style={{ fontFamily:MONO, fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.7)', marginBottom:'10px' }}>
                Flow State Index
              </p>
              <p style={{ fontFamily:BODY, fontSize:'13px', color:'rgba(0,0,0,0.6)', lineHeight:1.5, marginBottom:'16px' }}>
                You spent 74% of your time in deep design sessions this week.
              </p>
            </div>
            <div>
              <span style={{ fontFamily:SYNE, fontSize:'56px', fontWeight:600, lineHeight:1, color:'#1a0008', display:'block', marginBottom:'4px' }}>9.2</span>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(0,0,0,0.5)' }}>
                Elite Performance Rank
              </p>
            </div>
          </div>
        </div>

        {/* ── Cognitive Load Matrix ── */}
        <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', marginBottom:'12px' }}>
          <CognitiveMatrix />
        </div>

        {/* ── Row 3: Dominant Projects + Pro Insight + Audit ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'12px' }}>

          {/* Dominant Projects */}
          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px' }}>
            <p style={{ fontFamily:SYNE, fontSize:'15px', fontWeight:600, color:'#f5e8ec', marginBottom:'20px' }}>
              Dominant Projects
            </p>
            {projects.map((p, i) => (
              <div
                key={i}
                style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 0', borderBottom: i < projects.length - 1 ? '1px solid #3d1f28' : 'none', cursor:'pointer', transition:'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                <div style={{ width:40, height:40, background:'#2e1820', border:'1px solid #3d1f28', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:'16px', color:'#7a5060' }}>{p.icon}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:MONO, fontSize:'12px', color:'#f5e8ec', marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</p>
                  <p style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060', letterSpacing:'0.08em' }}>{p.sub}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontFamily:SYNE, fontSize:'18px', fontWeight:600, color:'#f5e8ec', lineHeight:1 }}>{p.time}</p>
                  <p style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', letterSpacing:'0.1em', marginTop:3 }}>{p.period}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right col */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

            {/* Pro Insight */}
            <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px', flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'12px' }}>
                <span style={{ color:'#ff2d78', fontSize:'14px' }}>✦</span>
                <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78' }}>Pro Insight</p>
              </div>
              <p style={{ fontFamily:SYNE, fontSize:'16px', fontWeight:600, color:'#f5e8ec', lineHeight:1.3, marginBottom:'10px' }}>
                Velocity is peaking between 10 PM and 1 AM.
              </p>
              <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060', lineHeight:1.6, marginBottom:'16px' }}>
                You are most productive during 'Dark Mode' hours. Consider shifting non-essential meetings to the afternoon to protect this creative window.
              </p>
              <button
                style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#ff2d78', background:'none', border:'none', cursor:'pointer', padding:0, borderBottom:'1px solid #ff2d7855', paddingBottom:2, transition:'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                View Focus Schedule
              </button>
            </div>

            {/* Audit Trail */}
            <div style={{ background:'#131928', border:'1px solid #1e2d4a', padding:'20px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', right:12, top:12, opacity:0.08 }}>
                <Shield size={56} color="#60a5fa" />
              </div>
              <p style={{ fontFamily:SYNE, fontSize:'15px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px' }}>Audit Trail</p>
              <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060', marginBottom:'12px', lineHeight:1.5 }}>
                Last external access 14m ago from IP 192.168.1.42.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }} />
                <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#4ade80' }}>
                  Systems Encrypted
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop:'1px solid #3d1f28', height:40, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', flexShrink:0 }}>
        <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#4a2f38' }}>© 2026 FIGLOG</span>
        <div style={{ display:'flex', gap:'24px' }}>
          {['Documentation','Support'].map(l => (
            <a key={l} href="#" style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a5060', textDecoration:'none', transition:'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
              onMouseLeave={e => e.currentTarget.style.color='#7a5060'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}