import { useState, useMemo } from 'react'
import { useNavigate }  from 'react-router-dom'
import { CheckCircle, ArrowRight, Share2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Barlow Condensed', sans-serif"
const SYNE    = "'Syne', sans-serif"
const BODY    = "'Barlow', sans-serif"

// ── Same heatmap logic as Dashboard ──────────────────────────────────────────
function ActivityMatrix({ historyData = {} }) {
  const months  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const days    = ['MON','TUE','WED','THU','FRI','SAT','SUN']
  const heatBg  = ['#1c0c11','#5c1a35','#991a4a','#cc1f5e','#ff2d78']

  const matrixLayout = useMemo(() => {
    const year    = 2026
    const allDays = []
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate()
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj  = new Date(year, m, d)
        let   dayOfWeek = dateObj.getDay()
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        allDays.push({
          month: m, day: d, dayOfWeek,
          dateString: dateObj.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
          dataKey: `${m}-${dayOfWeek}-${Math.floor((d - 1) / 7)}`
        })
      }
    }
    const firstDay = new Date(year, 0, 1).getDay()
    const offset   = firstDay === 0 ? 6 : firstDay - 1
    const padded   = [...Array(offset).fill(null), ...allDays]
    const weeks    = []
    for (let i = 0; i < padded.length; i += 7) {
      const week = padded.slice(i, i + 7)
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }
    return weeks
  }, [])

  return (
    <div style={{ background:'#12070a', border:'1px solid #2e1820', padding:'24px 32px', width:'100%', boxSizing:'border-box' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <span style={{ fontFamily:MONO, fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#f5e8ec' }}>
          Contribution Matrix
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>LESS</span>
          {heatBg.map((c,i) => <div key={i} style={{ width:11, height:11, background:c, borderRadius:1 }} />)}
          <span style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>MORE</span>
        </div>
      </div>

      <div style={{ display:'flex', position:'relative', paddingLeft:'40px', width:'100%', overflowX:'auto' }}>
        {/* Day labels */}
        <div style={{ display:'flex', flexDirection:'column', position:'absolute', left:0, top:22 }}>
          {days.map((day, i) => (
            <div key={day} style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', height:'clamp(6px,0.8vw,12px)', marginBottom:'clamp(2px,0.3vw,4px)', lineHeight:1, visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div style={{ display:'flex', flexDirection:'row', flexGrow:1 }}>
          {matrixLayout.map((week, colIndex) => {
            const monthStart = week.find(d => d !== null && d.day === 1)
            const monthLabel = monthStart ? months[monthStart.month] : null
            return (
              <div key={colIndex} style={{ display:'flex', flexDirection:'column', flex:1, marginRight:'clamp(1px,0.2vw,3px)' }}>
                <div style={{ height:16, marginBottom:4, fontFamily:MONO, fontSize:'9px', color:'#7a5060', overflow:'hidden' }}>
                  {monthLabel || ''}
                </div>
                {week.map((cell, rowIndex) => {
                  const heat = cell ? (historyData[cell.dataKey] || 0) : 0
                  return (
                    <div
                      key={rowIndex}
                      title={cell ? `${cell.dateString} • Activity: ${heat}` : undefined}
                      style={{ width:'clamp(6px,0.8vw,12px)', height:'clamp(6px,0.8vw,12px)', marginBottom:'clamp(2px,0.3vw,4px)', background: cell ? heatBg[heat] : '#1c0c11', borderRadius:1, cursor: cell ? 'pointer' : 'default', transition:'transform 0.1s, filter 0.1s' }}
                      onMouseEnter={e => { if (cell) { e.currentTarget.style.transform='scale(1.3)'; e.currentTarget.style.filter='brightness(1.4)' }}}
                      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.filter='none' }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Activity bars (same shape as dashboard) ───────────────────────────────────
function ActivityBars({ commitLog = [] }) {
  // Last 14 time slots — fill rightmost with live session count
  const base = [40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75, 40]
  const bars  = [...base, Math.min(95, 60 + commitLog.length * 5)]
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'4px', height:'80px', marginTop:'16px', marginBottom:'8px' }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex:1, height:`${h}%`, background: i === bars.length - 1 ? '#ff2d78' : '#5c1a35', transition:'height 0.3s' }} />
      ))}
    </div>
  )
}

// ── Work history ──────────────────────────────────────────────────────────────
export default function PublicProfile() {
  const navigate  = useNavigate()
  const {
    commitLog     = [],
    matrixHistory = {},
    stats = { currentStreak:42, longestStreak:128, baseCommitsCount:1162 },
  } = useApp()

  const [loaded, setLoaded] = useState(5)

  // Derive all worked-on files and their last touched date from history
  const workHistory = useMemo(() => {
    const fileMap = new Map()
    commitLog.forEach(c => {
      const fileName = c.file || c.fileTarget || 'core_render.sys'
      // Keep first encounter (latest commit due to array order)
      if (!fileMap.has(fileName)) {
        fileMap.set(fileName, {
          title: c.message,
          file: fileName,
          date: `Today, ${c.time || '--:--'}`,
          active: true,
          live: true
        })
      }
    })
    return Array.from(fileMap.values())
  }, [commitLog])

  const totalCommits = stats.baseCommitsCount + commitLog.length

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title:'Figlog Profile — Kaelen Vance', url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

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
            onClick={() => navigate('/onboarding')}
            style={{ fontFamily:SYNE, fontSize:'13px', fontWeight:600, padding:'9px 20px', background:'#ff2d78', border:'none', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
          >
            Start Crafting
          </button>
        </div>
      </header>

      <main style={{ flex:1, maxWidth:1200, margin:'0 auto', width:'100%', padding:'40px 48px' }}>

        {/* ── Profile header ── */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:'24px', marginBottom:'32px' }}>
          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:120, height:120, background:'linear-gradient(135deg,rgba(255,45,120,0.2),rgba(139,92,246,0.2))', border:'1px solid #3d1f28', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:SYNE, fontSize:'48px', fontWeight:600, color:'#7a5060' }}>K</span>
            </div>
            <div style={{ position:'absolute', bottom:6, right:6, width:22, height:22, background:'#ff2d78', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CheckCircle size={12} color="white" />
            </div>
          </div>

          {/* Identity */}
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>
              Artisan ID: 0x8F2A
            </p>
            <h1 style={{ fontFamily:SYNE, fontSize:'36px', fontWeight:600, color:'#f5e8ec', margin:'0 0 6px', lineHeight:1 }}>
              Kaelen Vance
            </h1>
            <p style={{ fontFamily:MONO, fontSize:'11px', color:'#7a5060', letterSpacing:'0.08em', marginBottom:'12px' }}>
              figlog.com/kaelen_v
            </p>
            <button
              onClick={handleShare}
              style={{ display:'flex', alignItems:'center', gap:'6px', border:'1px solid #4a2530', padding:'7px 14px', background:'transparent', fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
            >
              <Share2 size={11} /> Share Profile
            </button>
          </div>

          {/* Live stats from context */}
          <div style={{ display:'flex', gap:'48px', alignItems:'flex-end' }}>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>Streak</p>
              <span style={{ fontFamily:SYNE, fontSize:'72px', fontWeight:600, lineHeight:1, color:'#ff2d78', textShadow:'0 0 30px rgba(255,45,120,0.3)' }}>
                {stats.currentStreak}
              </span>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>Commits</p>
              <span style={{ fontFamily:SYNE, fontSize:'72px', fontWeight:600, lineHeight:1, color:'#f5e8ec' }}>
                {totalCommits.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Same heatmap as Dashboard ── */}
        <div style={{ marginBottom:'24px' }}>
          <ActivityMatrix historyData={matrixHistory} />
        </div>

        {/* ── Stat cards row — mirrors dashboard ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'24px' }}>
          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'20px', position:'relative', overflow:'hidden' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'12px' }}>Current Streak</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px' }}>
              <span style={{ fontFamily:SYNE, fontSize:'56px', fontWeight:600, lineHeight:1, color:'#ff2d78', textShadow:'0 0 20px rgba(255,45,120,0.4)' }}>{stats.currentStreak}</span>
              <span style={{ fontFamily:DISPLAY, fontSize:'16px', fontWeight:700, color:'#7a5060', marginBottom:'8px' }}>DAYS</span>
            </div>
            <div style={{ height:2, background:'#2e1820', width:'100%', marginTop:12 }}>
              <div style={{ height:'100%', width:`${Math.min((stats.currentStreak / (stats.longestStreak || 1)) * 100, 100)}%`, background:'linear-gradient(90deg,#8b5cf6,#ff2d78)' }} />
            </div>
          </div>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'20px' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'12px' }}>Longest Streak</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px' }}>
              <span style={{ fontFamily:SYNE, fontSize:'56px', fontWeight:600, lineHeight:1, color:'#f5e8ec' }}>{stats.longestStreak}</span>
              <span style={{ fontFamily:DISPLAY, fontSize:'16px', fontWeight:700, color:'#7a5060', marginBottom:'8px' }}>DAYS</span>
            </div>
            <p style={{ fontFamily:DISPLAY, fontSize:'13px', fontStyle:'italic', color:'#7a5060', marginTop:8 }}>System Record</p>
          </div>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'20px' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'12px' }}>Total Commits</p>
            <span style={{ fontFamily:SYNE, fontSize:'56px', fontWeight:600, lineHeight:1, color:'#f5e8ec', display:'block' }}>
              {totalCommits.toLocaleString()}
            </span>
            {commitLog.length > 0 && (
              <p style={{ fontFamily:MONO, fontSize:'10px', color:'#ff2d78', marginTop:8 }}>+{commitLog.length} this session</p>
            )}
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:'16px' }}>

          {/* Left — active time + CTA */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'8px' }}>Active Time</p>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
                <div>
                  <span style={{ fontFamily:SYNE, fontSize:'52px', fontWeight:600, lineHeight:1, color:'#f5e8ec' }}>124h</span>
                  <p style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060', marginTop:4 }}>Last 30 Days</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:SYNE, fontSize:'24px', fontWeight:600, color:'#f5e8ec' }}>32.5h</span>
                  <p style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060', marginTop:4 }}>This Week</p>
                </div>
              </div>
              {/* Live-derived bars */}
              <ActivityBars commitLog={commitLog} />
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', letterSpacing:'0.1em' }}>4 WEEKS AGO</span>
                <span style={{ fontFamily:MONO, fontSize:'9px', color:'#7a5060', letterSpacing:'0.1em' }}>CURRENT</span>
              </div>
            </div>

            <div style={{ background:'#ff2d78', padding:'28px 24px' }}>
              <h2 style={{ fontFamily:SYNE, fontSize:'22px', fontWeight:600, color:'#1a0008', lineHeight:1.2, marginBottom:'12px', textTransform:'uppercase' }}>
                Track Your Own Design Streaks
              </h2>
              <p style={{ fontFamily:BODY, fontSize:'13px', color:'rgba(0,0,0,0.6)', marginBottom:'20px', lineHeight:1.5 }}>
                Join 12,000+ artisans pushing pixels into production everyday. Free forever.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                style={{ fontFamily:MONO, fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1a0008', background:'none', border:'none', cursor:'pointer', padding:0, transition:'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                Create Profile →
              </button>
            </div>
          </div>

          {/* Right — work history, live commits first */}
          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #3d1f28' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060' }}>
                Work History
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                {commitLog.length > 0 && (
                  <span style={{ fontFamily:MONO, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#4ade80', border:'1px solid #4ade8033', padding:'2px 8px' }}>
                    {commitLog.length} live
                  </span>
                )}
                <span style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>Showing most recent</span>
              </div>
            </div>

            {workHistory.slice(0, loaded).map((item, i) => (
              <div
                key={i}
                style={{ display:'flex', alignItems:'flex-start', gap:'16px', padding:'16px 24px', borderBottom:'1px solid #3d1f28', cursor:'pointer', transition:'background 0.15s', background: item.live ? 'rgba(255,45,120,0.03)' : 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background='#120609'}
                onMouseLeave={e => e.currentTarget.style.background = item.live ? 'rgba(255,45,120,0.03)' : 'transparent'}
              >
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, marginTop:2 }}>
                  <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${item.active || item.live ? '#ff2d78' : '#3d1f28'}` }} />
                  {i < workHistory.slice(0, loaded).length - 1 && (
                    <div style={{ width:1, flex:1, background:'#3d1f28', marginTop:4, minHeight:20 }} />
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:4 }}>
                    {item.live && <span style={{ width:5, height:5, borderRadius:'50%', background:'#ff2d78', flexShrink:0 }} />}
                    <p style={{ fontFamily:BODY, fontSize:'14px', color: (item.active || item.live) ? '#f5e8ec' : '#c4909f', lineHeight:1.4 }}>
                      {item.title}
                    </p>
                  </div>
                  <p style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>{item.file}</p>
                </div>
                <span style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060', flexShrink:0, marginTop:2 }}>{item.date}</span>
              </div>
            ))}

            <button
              onClick={() => setLoaded(l => l + 5)}
              style={{ width:'100%', padding:'16px', fontFamily:MONO, fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#7a5060', background:'transparent', border:'none', borderTop:'1px dashed #3d1f28', cursor:'pointer', transition:'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='#ff2d78'}
              onMouseLeave={e => e.currentTarget.style.color='#7a5060'}
            >
              Load More History
            </button>
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