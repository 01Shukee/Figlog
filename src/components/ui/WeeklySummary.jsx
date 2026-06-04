import { X, BarChart2 } from 'lucide-react'

const MONO = "'JetBrains Mono', monospace"
const BODY = "'Barlow', sans-serif"

export default function WeeklySummary({ open, onClose, increase = 12, milestones = 4 }) {
  if (!open) return null

  return (
    <div style={{ position:'fixed', top:72, right:24, zIndex:9998, width:300, background:'#1e0d13', border:'1px solid #3d1f28', padding:'16px 18px', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'slideIn 0.2s ease forwards' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
        <div style={{ width:28, height:28, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
          <BarChart2 size={13} color="#4ade80" />
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#4ade80', marginBottom:'5px' }}>
            Weekly Summary
          </p>
          <p style={{ fontFamily:BODY, fontSize:'13px', color:'#f5e8ec', lineHeight:1.5 }}>
            Activity increased by{' '}
            <span style={{ color:'#4ade80', fontWeight:700 }}>+{increase}%</span> this week.
            You completed <span style={{ color:'#f5e8ec', fontWeight:700 }}>{milestones} major milestones</span>.
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ background:'none', border:'none', color:'#7a5060', cursor:'pointer', padding:2, flexShrink:0, display:'flex', transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
          onMouseLeave={e => e.currentTarget.style.color='#7a5060'}
        >
          <X size={14} />
        </button>
      </div>
      <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}