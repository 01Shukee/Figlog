import { useState } from 'react'
import { Share2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

export default function StreakBadge({ open, onDismiss, streakCount = 7 }) {
  const { addToast } = useApp()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I hit a ${streakCount}-day streak on Figlog!`,
        text:  `${streakCount} days of consistent design commits. Ranking in the top 5% of digital artisans.`,
        url:   'https://figlog.studio',
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`I hit a ${streakCount}-day streak on Figlog! figlog.studio`).catch(() => {})
      addToast('Streak link copied', 'success')
    }
    onDismiss()
  }

  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onDismiss() }}
      style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)' }}
    >
      <div style={{ width:440, background:'#120609', border:'1px solid #3d1f28', position:'relative', overflow:'hidden' }}>

        {/* Ghost number background */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:260, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', pointerEvents:'none' }}>
          {/* Smoke gradient behind number */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 60%, rgba(255,45,120,0.12) 0%, transparent 70%)' }} />
          <span style={{
            fontFamily:SYNE, fontSize:'220px', fontWeight:800, lineHeight:1,
            color:'transparent',
            WebkitTextStroke:'1px rgba(255,255,255,0.08)',
            userSelect:'none', letterSpacing:'-0.05em',
          }}>
            {String(streakCount).padStart(2,'0')}
          </span>
        </div>

        {/* Content */}
        <div style={{ position:'relative', padding:'160px 36px 0' }}>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#7a5060', marginBottom:'8px' }}>
            Achievement Unlocked
          </p>
          <h2 style={{ fontFamily:SYNE, fontSize:'40px', fontWeight:600, color:'#f5e8ec', margin:'0 0 24px', letterSpacing:'-0.01em' }}>
            Streak&nbsp;&nbsp;{String(streakCount).padStart(2,'0')}
          </h2>
        </div>

        <div style={{ padding:'0 36px 32px' }}>
          <p style={{ fontFamily:SYNE, fontSize:'16px', fontWeight:600, color:'#f5e8ec', marginBottom:'8px' }}>
            You hit a {streakCount}-day streak!
          </p>
          <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', lineHeight:1.6, marginBottom:'24px' }}>
            You've been active for {streakCount >= 7 ? 'a full week' : `${streakCount} days`}. Your consistency is ranking you in the top 5% of digital artisans this month.
          </p>

          <button
            onClick={handleShare}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', background:'#ff2d78', border:'none', padding:'16px', fontFamily:MONO, fontSize:'11px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#ffffff', cursor:'pointer', marginBottom:'8px', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
          >
            <Share2 size={14} />
            Share to Profile
          </button>

          <button
            onClick={onDismiss}
            style={{ width:'100%', padding:'14px', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', background:'transparent', border:'1px solid #3d1f28', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#3d1f28'; e.currentTarget.style.color='#7a5060' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}