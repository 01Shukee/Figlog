import { useApp } from '../../context/AppContext'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

const MONO = "'JetBrains Mono', monospace"

const icons  = { success:<CheckCircle size={13} color="#4ade80"/>, error:<AlertCircle size={13} color="#ff2d78"/>, info:<Info size={13} color="#60a5fa"/> }
const colors = { success:'#4ade8044', error:'#ff2d7844', info:'#60a5fa44' }

export default function ToastContainer() {
  const { toasts } = useApp()
  return (
    <div style={{ position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', gap:'8px', zIndex:99999, pointerEvents:'none', alignItems:'center' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'10px', background:'#1e0d13', border:`1px solid ${colors[t.type] || colors.info}`, padding:'12px 20px', animation:'toastIn 0.2s ease forwards', pointerEvents:'auto', whiteSpace:'nowrap' }}>
          {icons[t.type] || icons.info}
          <span style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.08em', color:'#f5e8ec' }}>{t.message}</span>
        </div>
      ))}
      <style>{`@keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}