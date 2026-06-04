import { useState, useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageLayout      from '../components/layout/PageLayout'
import StreakBadge     from '../components/ui/StreakBadge'
import WeeklySummary   from '../components/ui/WeeklySummary'
import { useApp }      from '../context/AppContext'

const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Barlow Condensed', sans-serif"
const SYNE    = "'Syne', sans-serif"
const BODY    = "'Barlow', sans-serif"

function ActivityMatrix({ historyData = {} }) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const heatBg = ['#1c0c11', '#5c1a35', '#991a4a', '#cc1f5e', '#ff2d78'];

  // Logic remains the same to keep the calendar structure intact
  const matrixLayout = useMemo(() => {
    const year = 2026;
    const allDays = [];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, m, d);
        let dayOfWeek = dateObj.getDay();
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        allDays.push({
          month: m,
          day: d,
          dayOfWeek,
          dateString: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dataKey: `${m}-${dayOfWeek}-${Math.floor((d - 1) / 7)}`
        });
      }
    }
    const firstDay = new Date(year, 0, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const paddedDays = [...Array(offset).fill(null), ...allDays];
    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      const week = paddedDays.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }, []);

  return (
    <div style={{ background: '#12070a', border: '1px solid #2e1820', padding: '32px 40px', boxSizing: 'border-box', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <span style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5e8ec' }}>
          ACTIVITY_MATRIX_2026
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: MONO, fontSize: '10px', color: '#7a5060' }}>LESS</span>
          {heatBg.map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, background: c, borderRadius: '1px' }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: '10px', color: '#7a5060' }}>MORE</span>
        </div>
      </div>

      {/* Main Grid Area */}
      {/* We set display: flex to ensure the container stretches dynamically */}
      <div style={{ display: 'flex', position: 'relative', paddingLeft: '45px', width: '100%', overflowX: 'auto' }}>
        {/* Row Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 0, top: 22 }}>
          {days.map((day, i) => (
            <div key={day} style={{ 
              fontFamily: MONO, fontSize: '10px', color: '#7a5060', 
              height: 'clamp(6px, 0.8vw, 12px)', // Matches cell height
              marginBottom: 'clamp(2px, 0.3vw, 4px)', // Matches cell margin
              lineHeight: '1',
              visibility: i % 2 === 0 ? 'visible' : 'hidden' 
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Dynamic Weeks Container */}
        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
          {matrixLayout.map((week, colIndex) => {
            const monthStartDay = week.find(d => d !== null && d.day === 1);
            const monthLabel = monthStartDay ? months[monthStartDay.month] : null;

            return (
              <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: 'clamp(1px, 0.2vw, 4px)' }}>
                {/* Month Label */}
                <div style={{ height: 16, marginBottom: '4px', fontFamily: MONO, fontSize: '10px', color: '#7a5060', overflow: 'hidden' }}>
                  {monthLabel || ''}
                </div>

                {/* Daily Cells - Using clamp for fluid resizing */}
                {week.map((cell, rowIndex) => {
                  const heat = cell ? (historyData[cell.dataKey] || 0) : 0;
                  return (
                    <div
                      key={rowIndex}
                      title={cell ? `${cell.dateString} • Activity: ${heat}` : undefined}
                      style={{
                        width: 'clamp(6px, 0.8vw, 12px)', // Dynamic Width
                        height: 'clamp(6px, 0.8vw, 12px)', // Dynamic Height
                        marginBottom: 'clamp(2px, 0.3vw, 4px)', // Dynamic Gap
                        background: cell ? heatBg[heat] : '#1c0c11',
                        borderRadius: '1px',
                        cursor: cell ? 'pointer' : 'default',
                        transition: 'transform 0.1s, filter 0.1s'
                      }}
                      onMouseEnter={e => { if (cell) { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.filter = 'brightness(1.3)'; }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate()
  
  const { 
    addToast, 
    commitLog = [], 
    stats = { currentStreak: 0, longestStreak: 0, baseCommitsCount: 0 },
    matrixHistory = {}
  } = useApp()

  const [refreshing, setRefreshing] = useState(false)
  const [streakOpen, setStreakOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(true)

  const recentLogs = commitLog.slice(0, 3).map(c => ({
    id: c.message ? c.message.replace(/\s+/g,'_').toUpperCase().slice(0, 24) : 'UNKNOWN_COMMIT',
    date: c.date || new Date().toLocaleDateString('en-GB'),
    time: c.time || '--:--',
    live: true,
  }))

  const totalCommitsCount = stats.baseCommitsCount + commitLog.length

  const handleExport = () => {
    const rows = [
      ['Metric','Value'],
      ['Current Streak', `${stats.currentStreak} days`],
      ['Longest Streak', `${stats.longestStreak} days`],
      ['Total Commits', String(totalCommitsCount)],
      ...commitLog.map(c => ['Session Commit', c.message]),
    ]
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'figlog-contribution.csv'
    a.click()
    URL.revokeObjectURL(url)
    addToast('Logs exported successfully', 'success')
  }

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    addToast('Syncing workspace logs…', 'info')
    setTimeout(() => { 
      setRefreshing(false)
      addToast('Data synchronized', 'success') 
    }, 1500)
  }

  return (
    <PageLayout footerLeft="© 2026 FIGLOG">
      <WeeklySummary open={summaryOpen} onClose={() => setSummaryOpen(false)} increase={commitLog.length} milestones={stats.currentStreak > 0 ? 1 : 0} />
      <StreakBadge open={streakOpen} onDismiss={() => setStreakOpen(false)} streakCount={stats.currentStreak} />

      <div style={{ maxWidth:1440, margin:'0 auto', padding:'36px 48px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'32px' }}>
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>
              Proof of Work
            </p>
            <h1 style={{ fontFamily:SYNE, fontSize:'72px', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1, color:'#f5e8ec', margin:0 }}>
              Contribution
            </h1>
          </div>
          <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
            <button
              onClick={handleExport}
              style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 20px', background:'#ff2d78', border:'none', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
              onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
            >
              Export_Logs
            </button>
            <button
              onClick={handleRefresh}
              style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 20px', background:'transparent', border:'1px solid #4a2530', color: refreshing ? '#7a5060' : '#c4909f', cursor: refreshing ? 'not-allowed' : 'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => { if (!refreshing) { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}}
              onMouseLeave={e => { if (!refreshing) { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}}
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'12px' }}>
          <div
            onClick={() => setStreakOpen(true)}
            style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#3d1f28'}
          >
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'16px' }}>Current Streak</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', marginBottom:'16px' }}>
              <span style={{ fontFamily:SYNE, fontSize:'84px', fontWeight:600, lineHeight:1, color:'#ff2d78', textShadow:'0 0 30px rgba(255,45,120,0.4)' }}>
                {stats.currentStreak}
              </span>
              <span style={{ fontFamily:DISPLAY, fontSize:'20px', fontWeight:700, color:'#7a5060', marginBottom:'10px' }}>DAYS</span>
            </div>
            <div style={{ height:'2px', background:'#2e1820', width:'100%' }}>
              <div style={{ height:'100%', width:`${Math.min((stats.currentStreak / (stats.longestStreak || 1)) * 100, 100)}%`, background:'linear-gradient(90deg,#8b5cf6,#ff2d78)' }} />
            </div>
          </div>

          <div
            onClick={() => navigate('/activity')}
            style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#3d1f28'}
          >
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'16px' }}>Longest Streak</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', marginBottom:'8px' }}>
              <span style={{ fontFamily:SYNE, fontSize:'84px', fontWeight:600, lineHeight:1, color:'#f5e8ec' }}>
                {stats.longestStreak}
              </span>
              <span style={{ fontFamily:DISPLAY, fontSize:'20px', fontWeight:700, color:'#7a5060', marginBottom:'10px' }}>DAYS</span>
            </div>
            <p style={{ fontFamily:DISPLAY, fontSize:'14px', fontStyle:'italic', color:'#7a5060' }}>System Record Tracking</p>
            <span style={{ position:'absolute', right:16, bottom:8, fontSize:'64px', opacity:0.07, userSelect:'none', pointerEvents:'none' }}>🏆</span>
          </div>

          <div
            onClick={() => navigate('/version-history')}
            style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#3d1f28'}
          >
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'16px' }}>Total Commits</p>
            <span style={{ fontFamily:SYNE, fontSize:'84px', fontWeight:600, lineHeight:1, color:'#f5e8ec', display:'block', marginBottom:'8px' }}>
              {totalCommitsCount.toLocaleString()}
            </span>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060' }}>
              {commitLog.length > 0 ? `+${commitLog.length} pending save` : 'System performance: Optimal'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom:'28px' }}>
          <ActivityMatrix historyData={matrixHistory} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyBetween:'space-between', marginBottom:'12px' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060' }}>
                Recent_Logs
              </p>
            </div>
            <div style={{ border:'1px solid #3d1f28' }}>
              {recentLogs.length === 0 ? (
                <div style={{ padding:'20px', fontFamily:MONO, fontSize:'11px', color:'#7a5060', textAlign:'center' }}>NO_RECENT_COMMITS_LOGGED</div>
              ) : (
                recentLogs.map((log, i) => (
                  <div
                    key={i}
                    onClick={() => navigate('/version-history')}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom: i < recentLogs.length - 1 ? '1px solid #3d1f28' : 'none', cursor:'pointer', transition:'background 0.15s', background: 'rgba(255,45,120,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background='#1c0c11'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,45,120,0.03)'}
                  >
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:'#ff2d78', flexShrink:0 }} />
                        <p style={{ fontFamily:MONO, fontSize:'12px', fontWeight:700, color:'#f5e8ec' }}>{log.id}</p>
                      </div>
                      <p style={{ fontFamily:MONO, fontSize:'10px', color:'#7a5060' }}>{log.date} • {log.time}</p>
                    </div>
                    <ArrowRight size={15} color="#ff2d78" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            onClick={() => navigate('/activity')}
            style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'24px', display:'flex', flexDirection:'column', justifyContent:'space-between', backgroundImage:'radial-gradient(ellipse at 80% 20%, rgba(255,45,120,0.06) 0%, transparent 60%)', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#3d1f28'}
          >
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060' }}>System_Status</p>
            <p style={{ fontFamily:SYNE, fontSize:'30px', fontWeight:600, lineHeight:1.25, color:'#f5e8ec', margin:'16px 0' }}>
              {commitLog.length > 0 ? `Unsaved data staging cache contains ${commitLog.length} changes.` : "Workspace state sync completed successfully."}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
              <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#4ade80' }}>Session_Active</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}