import { useEffect } from 'react'
import { X } from 'lucide-react'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

export default function Modal({ open, onClose, title, description, confirmLabel = 'Confirm', confirmDanger = false, onConfirm }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)' }}
    >
      <div style={{ background:'#1e0d13', border:'1px solid #4a2530', width:'100%', maxWidth:480, padding:'32px', position:'relative' }}>
        <button
          onClick={onClose}
          style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'#7a5060', cursor:'pointer', display:'flex', transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#f5e8ec'}
          onMouseLeave={e => e.currentTarget.style.color='#7a5060'}
        >
          <X size={16} />
        </button>

        {title && (
          <h2 style={{ fontFamily:SYNE, fontSize:'22px', fontWeight:600, color:'#f5e8ec', marginBottom:'10px' }}>
            {title}
          </h2>
        )}
        {description && (
          <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'24px', lineHeight:1.6 }}>
            {description}
          </p>
        )}

        <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
          <button
            onClick={onClose}
            style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 20px', background:'transparent', border:'1px solid #4a2530', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose() }}
            style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 20px', background: confirmDanger ? '#cc1f5e' : '#ff2d78', border:'none', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = confirmDanger ? '#991a4a' : '#cc1f5e'}
            onMouseLeave={e => e.currentTarget.style.background = confirmDanger ? '#cc1f5e' : '#ff2d78'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}