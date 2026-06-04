import { useState } from 'react'
import { Share2, Trophy, Zap, Star } from 'lucide-react'
import StreakBadge from '../../components/ui/StreakBadge'
import { useApp }  from '../../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

const milestones = [
  { streak:7,   label:'First Week',     desc:'7 consecutive days of commits',          unlocked:true  },
  { streak:14,  label:'Two Weeks',      desc:'14 consecutive days of commits',         unlocked:true  },
  { streak:30,  label:'Monthly Grind',  desc:'30 consecutive days — top 10%',          unlocked:false },
  { streak:42,  label:'Current Streak', desc:'42 days and counting',                   unlocked:false },
  { streak:100, label:'Century',        desc:'100 days — legendary artisan status',    unlocked:false },
]

export default function SharingMilestones() {
  const { addToast }                    = useApp()
  const [badgeStreak, setBadgeStreak]   = useState(null)
  const [badgeOpen,   setBadgeOpen]     = useState(false)

  const openBadge = (streak) => {
    setBadgeStreak(streak)
    setBadgeOpen(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#120609', display:'flex', flexDirection:'column' }}>

      <StreakBadge open={badgeOpen} onDismiss={() => setBadgeOpen(false)} streakCount={badgeStreak || 7} />

      <div style={{ maxWidth:1440, margin:'0 auto', width:'100%', padding:'36px 48px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'32px' }}>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>
            Plugin / Milestones
          </p>
          <h1 style={{ fontFamily:SYNE, fontSize:'52px', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1, color:'#f5e8ec', margin:0 }}>
            Sharing & Milestones
          </h1>
          <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginTop:'8px' }}>
            Track achievements and share your creative momentum with the world.
          </p>
        </div>

        {/* ── Current achievement ── */}
        <div style={{ background:'linear-gradient(135deg,#2e1820,#1e0d13)', border:'1px solid #4a2530', padding:'32px', marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
            <div style={{ width:56, height:56, background:'rgba(255,45,120,0.15)', border:'1px solid rgba(255,45,120,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={24} color="#ff2d78" />
            </div>
            <div>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'4px' }}>Active Streak</p>
              <p style={{ fontFamily:SYNE, fontSize:'32px', fontWeight:600, color:'#f5e8ec', lineHeight:1 }}>42 Days</p>
              <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060', marginTop:'4px' }}>Top 5% of artisans this month</p>
            </div>
          </div>
          <button
            onClick={() => openBadge(42)}
            style={{ display:'flex', alignItems:'center', gap:'8px', background:'#ff2d78', border:'none', padding:'12px 24px', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
          >
            <Share2 size={13} />
            Share Achievement
          </button>
        </div>

        {/* ── Milestone list ── */}
        <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'12px' }}>
          All Milestones
        </p>

        <div style={{ background:'#1e0d13', border:'1px solid #3d1f28' }}>
          {milestones.map((m, i) => (
            <div
              key={i}
              style={{ display:'flex', alignItems:'center', gap:'16px', padding:'18px 24px', borderBottom: i < milestones.length - 1 ? '1px solid #3d1f28' : 'none', opacity: m.unlocked ? 1 : 0.45, transition:'background 0.15s' }}
              onMouseEnter={e => { if (m.unlocked) e.currentTarget.style.background='#120609' }}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {/* Icon */}
              <div style={{ width:36, height:36, background: m.unlocked ? 'rgba(255,45,120,0.12)' : '#2e1820', border:`1px solid ${m.unlocked ? 'rgba(255,45,120,0.3)' : '#3d1f28'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Trophy size={15} color={m.unlocked ? '#ff2d78' : '#7a5060'} />
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                  <span style={{ fontFamily:SYNE, fontSize:'15px', fontWeight:600, color: m.unlocked ? '#f5e8ec' : '#7a5060' }}>{m.label}</span>
                  {m.unlocked && (
                    <span style={{ fontFamily:MONO, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#4ade80', border:'1px solid #4ade8033', padding:'2px 6px' }}>
                      Unlocked
                    </span>
                  )}
                </div>
                <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>{m.desc}</p>
              </div>

              {/* Streak number */}
              <span style={{ fontFamily:SYNE, fontSize:'28px', fontWeight:600, color: m.unlocked ? '#ff2d78' : '#3d1f28', flexShrink:0 }}>
                {String(m.streak).padStart(2,'0')}
              </span>

              {/* Share button */}
              {m.unlocked && (
                <button
                  onClick={() => openBadge(m.streak)}
                  style={{ flexShrink:0, border:'1px solid #4a2530', padding:'7px 14px', background:'transparent', fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
                >
                  Share
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Next milestone ── */}
        <div style={{ marginTop:'16px', padding:'16px 20px', border:'1px solid #3d1f28', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <Star size={14} color="#7a5060" />
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060' }}>
              Next milestone: <span style={{ color:'#f5e8ec' }}>Monthly Grind (30 days)</span> — {30 - 14} days away
            </p>
          </div>
          <div style={{ width:160, height:3, background:'#2e1820' }}>
            <div style={{ width:'47%', height:'100%', background:'linear-gradient(90deg,#8b5cf6,#ff2d78)' }} />
          </div>
        </div>

      </div>
    </div>
  )
}