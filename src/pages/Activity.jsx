import { useState, useMemo } from 'react'
import { Play, Square } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import { useTimer } from '../hooks/useTimer'
import { useApp }   from '../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

const DAYS = ['M','T','W','T','F','S','S']
const todayIdx = (new Date().getDay() + 6) % 7

const INITIAL_SESSIONS = [
  { project: 'Mobile Redesign',    start: '14:02:11', end: '14:56:42', durationMinutes: 54,  dayIndex: todayIdx },
  { project: 'IDISCOVR',           start: '11:15:00', end: '12:35:12', durationMinutes: 80,  dayIndex: todayIdx },
  { project: 'ABELTON Team Sync',  start: '10:00:00', end: '10:30:00', durationMinutes: 30,  dayIndex: 1 },
  { project: 'Mobile Redesign v3', start: '09:00:00', end: '10:30:00', durationMinutes: 90,  dayIndex: 0 },
]

const formatMinutesToDisplay = (totalMinutes) => {
  if (totalMinutes <= 0) return '0m'
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export default function Activity() {
  const { addToast, activeSession } = useApp()
  const timer = useTimer()
  const [list, setList]               = useState(INITIAL_SESSIONS)
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [hoveredDay, setHoveredDay]   = useState(null)

  const liveMinutes = Math.floor(timer.elapsed / 60)

  const barDataMinutes = useMemo(() => {
    const daysData = Array(7).fill(0)
    list.forEach(s => {
      if (s.dayIndex >= 0 && s.dayIndex < 7) daysData[s.dayIndex] += s.durationMinutes
    })
    if (timer.running) daysData[todayIdx] += liveMinutes
    return daysData
  }, [list, timer.running, liveMinutes])

  const barChartHeights = barDataMinutes.map(mins => Math.min(100, Math.floor((mins / 120) * 100)))
  const todayTotalMinutes = barDataMinutes[todayIdx]
  const weeklyTotalMinutes = barDataMinutes.reduce((sum, mins) => sum + mins, 0)

  const topFocusProject = useMemo(() => {
    if (list.length === 0) return 'No Active Projects'
    const projectMap = {}
    list.forEach(s => { projectMap[s.project] = (projectMap[s.project] || 0) + s.durationMinutes })
    const currentActiveName = activeSession || 'Live Session'
    if (timer.running) projectMap[currentActiveName] = (projectMap[currentActiveName] || 0) + liveMinutes
    return Object.keys(projectMap).reduce((a, b) => projectMap[a] > projectMap[b] ? a : b, 'System Core')
  }, [list, timer.running, liveMinutes, activeSession])

  const topFocusTrackedMinutes = useMemo(() => {
    const matchedHistory = list.filter(s => s.project === topFocusProject).reduce((sum, s) => sum + s.durationMinutes, 0)
    const runningAddition = (timer.running && (activeSession || 'Live Session') === topFocusProject) ? liveMinutes : 0
    return matchedHistory + runningAddition
  }, [list, topFocusProject, timer.running, liveMinutes, activeSession])

  const handleFAB = () => {
    if (timer.running) {
      timer.stop()
      const now = new Date()
      const durationMins = Math.max(1, Math.floor(timer.elapsed / 60))
      const newSession = {
        project:         activeSession || 'Live Session',
        start:           new Date(now - timer.elapsed * 1000).toLocaleTimeString('en-GB', { hour12:false }),
        end:             now.toLocaleTimeString('en-GB', { hour12:false }),
        durationMinutes: durationMins,
        dayIndex:        todayIdx,
      }
      setList(prev => [newSession, ...prev])
      timer.reset()
      addToast('Tracking session saved', 'success')
    } else {
      timer.start()
      addToast('Workspace tracking started', 'info')
    }
  }

  const handleExport = () => {
    const rows = [['Project','Start','End','Duration'], ...list.map(s => [s.project, s.start, s.end, formatMinutesToDisplay(s.durationMinutes)])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'figlog-sessions.csv'
    a.click()
    URL.revokeObjectURL(url)
    addToast('Log data exported', 'success')
  }

  return (
    <PageLayout>
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'36px 48px' }}>

        {/* Page Title Block */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', borderBottom:'1px solid #1e2d4a', paddingBottom:'20px', marginBottom:'32px' }}>
          <div>
            <h1 style={{ fontFamily:SYNE, fontSize:'72px', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1, color:'#f5e8ec', margin:0  }}>
              Activity Log
            </h1>
            <p style={{ fontFamily:MONO, fontSize:'10px', color:'#4a6a9a', margin:'6px 0 0 0', textTransform:'uppercase', letterSpacing:'0.15em' }}>
              System runtime tracking & workspace diagnostics
            </p>
          </div>
          <div style={{ display:'flex', gap:'24px' }}>
            <div>
              <span style={{ fontFamily:MONO, fontSize:'9px', color:'#4a6a9a', display:'block', textTransform:'uppercase' }}>Status</span>
              <span style={{ fontFamily:MONO, fontSize:'12px', color: timer.running ? '#ff2d78' : '#4ade80', fontWeight:700 }}>
                ● {timer.running ? 'TRACKING_ACTIVE' : 'ENGINE_IDLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Rows */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'12px', marginBottom:'28px' }}>

          {/* Left Summary Card */}
          <div style={{ background:'#131928', border:'1px solid #1e2d4a', padding:'28px 32px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'220px' }}>
            <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#4a6a9a' }}>
              {hoveredDay !== null ? `${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][hoveredDay]} Usage` : "Today's Active Time"}
            </span>
            <span style={{ fontFamily:SYNE, fontSize:'72px', fontWeight:600, lineHeight:1, color: hoveredDay !== null ? '#ffffff' : (timer.running ? '#ff2d78' : '#ffffff'), transition:'color 0.3s', letterSpacing:'-0.02em' }}>
              {formatMinutesToDisplay(hoveredDay !== null ? barDataMinutes[hoveredDay] : todayTotalMinutes)}
            </span>
            
            {/* Weekly Mini Bars Chart */}
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'52px', marginTop:'16px' }}>
              {DAYS.map((d, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', height:'100%', cursor:'pointer' }}
                >
                  <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                    {barChartHeights[i] > 0 && (
                      <div style={{ 
                        width:'100%', 
                        height: `${barChartHeights[i]}%`, 
                        background: (hoveredDay === i) ? '#ffffff' : (i === todayIdx ? '#ff2d78' : '#1e2d4a'), 
                        transition:'height 0.3s, background 0.2s' 
                      }} />
                    )}
                  </div>
                  <span style={{ fontFamily:MONO, fontSize:'10px', textTransform:'uppercase', color: (hoveredDay === i) ? '#ffffff' : (i === todayIdx ? '#ff2d78' : '#4a6a9a') }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ background:'#131928', border:'1px solid #1e2d4a', padding:'20px 24px' }}>
              <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#4a6a9a' }}>
                Weekly Overview
              </span>
              <p style={{ fontFamily:SYNE, fontSize:'44px', fontWeight:600, lineHeight:1, color:'#ffffff', margin:'8px 0 6px', letterSpacing:'-0.02em' }}>
                {formatMinutesToDisplay(weeklyTotalMinutes)}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ fontFamily:MONO, fontSize:'11px', fontWeight:700, color:'#4ade80' }}>● Synchronized</span>
                <span style={{ fontFamily:MONO, fontSize:'10px', color:'#4a6a9a' }}>active engine baseline</span>
              </div>
            </div>

            <div style={{ background:'#131928', border:'1px solid #1e2d4a', padding:'20px 24px', position:'relative', flex:1 }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>
                Top Focus
              </p>
              <p style={{ fontFamily:SYNE, fontSize:'26px', fontWeight:600, lineHeight:1.15, color:'#ffffff', maxWidth:'90%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {topFocusProject}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'12px' }}>
                <span style={{ background:'rgba(255,45,120,0.1)', color:'#ff2d78', border:'1px solid rgba(255,45,120,0.2)', fontFamily:MONO, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 8px' }}>
                  {timer.running ? 'Tracking Active' : 'Calculated Focus'}
                </span>
                <span style={{ fontFamily:MONO, fontSize:'11px', color:'#4a6a9a' }}>
                  {formatMinutesToDisplay(topFocusTrackedMinutes)} total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History Log Title section */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060' }}>
            Session_History
          </p>
          <button
            onClick={handleExport}
            style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', padding:'7px 14px', background:'transparent', border:'1px solid #4a2530', color:'#c4909f', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
          >
            Export Log
          </button>
        </div>

        {/* History Table Container */}
        <div style={{ background:'#131928', border:'1px solid #1e2d4a' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 100px', padding:'10px 24px', borderBottom:'1px solid #1e2d4a' }}>
            {['Project / Screen', 'Start', 'End', 'Duration'].map(h => (
              <span key={h} style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#4a6a9a' }}>{h}</span>
            ))}
          </div>

          {list.map((s, i) => (
            <div key={i}>
              <div
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                style={{ display:'grid', gridTemplateColumns:'1fr 120px 100px 100px', padding:'16px 24px', alignItems:'center', borderBottom:'1px solid #1e2d4a', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                  <span style={{ fontFamily:BODY, fontSize:'13px', color:'#ffffff' }}>{s.project}</span>
                  {/* Real file-target data reflection */}
                  <span style={{ fontFamily:MONO, fontSize:'9px', color: '#ff2d78' }}>
                    {s.fileTarget || 'core_render.sys'}
                  </span>
                </div>
                <span style={{ fontFamily:MONO, fontSize:'12px', color:'#c4909f' }}>{s.start}</span>
                <span style={{ fontFamily:MONO, fontSize:'12px', color:'#c4909f' }}>{s.end}</span>
                <span style={{ fontFamily:SYNE, fontSize:'20px', fontWeight:600, color:'#ff2d78' }}>
                  {formatMinutesToDisplay(s.durationMinutes)}
                </span>
              </div>

              {expandedIdx === i && (
                <div style={{ padding:'12px 24px 14px', background:'rgba(255,45,120,0.02)', borderBottom:'1px solid #1e2d4a' }}>
                  <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>
                    Session Diagnostic
                  </p>
                  <p style={{ fontFamily:BODY, fontSize:'12px', color:'#c4909f' }}>
                    Target: <span style={{ color:'#ffffff' }}>{s.fileTarget || 'core_render.sys'}</span>
                    &nbsp;·&nbsp; Total Duration: <span style={{ color:'#ff2d78', fontWeight:700 }}>{formatMinutesToDisplay(s.durationMinutes)}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Floating Action Button Control */}
      <button
        onClick={handleFAB}
        title={timer.running ? 'Stop session' : 'Start session'}
        style={{ position:'fixed', bottom:32, right:32, width:44, height:44, borderRadius:'50%', background: timer.running ? '#cc1f5e' : '#ff2d78', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(255,45,120,0.35)', transition:'background 0.15s', zIndex:50 }}
        onMouseEnter={e => e.currentTarget.style.background='#991a4a'}
        onMouseLeave={e => e.currentTarget.style.background = timer.running ? '#cc1f5e' : '#ff2d78'}
      >
        {timer.running
          ? <Square size={14} fill="white" color="white" />
          : <Play   size={14} fill="white" color="white" style={{ marginLeft:2 }} />
        }
      </button>

    </PageLayout>
  )
}