import { useState } from 'react'
import { Share2, AlertTriangle, Edit2 } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Modal      from '../components/ui/Modal'
import { useApp } from '../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"
const BODY = "'Barlow', sans-serif"

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ position:'relative', width:40, height:20, borderRadius:20, background: checked ? '#ff2d78' : '#2e1820', border: checked ? 'none' : '1px solid #4a2530', cursor:'pointer', flexShrink:0, transition:'background 0.2s' }}
    >
      <span style={{ position:'absolute', top:2, left: checked ? 22 : 2, width:16, height:16, borderRadius:'50%', background:'#ffffff', transition:'left 0.2s' }} />
    </button>
  )
}

export default function Configuration() {
  const { addToast } = useApp()
  const [globalVisibility, setGlobalVisibility] = useState(false)
  const [publicProfile,    setPublicProfile]    = useState(true)
  const [copied,           setCopied]           = useState(false)
  const [purgeOpen,        setPurgeOpen]        = useState(false)
  const [saved,            setSaved]            = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('figlog.studio/alpha').catch(() => {})
    setCopied(true)
    addToast('Link copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 1500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title:'Figlog Profile', url:'https://figlog.studio/alpha' }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  const handleSave = () => {
    setSaved(true)
    addToast('Configuration saved', 'success')
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePurge = () => {
    addToast('System snapshots purged', 'error')
  }

  return (
    <PageLayout>
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'36px 48px' }}>

        {/* ── Header ── */}
        <div style={{ borderLeft:'2px solid #ff2d78', paddingLeft:'16px', marginBottom:'8px' }}>
          <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'6px' }}>Control Panel</p>
          <h1 style={{ fontFamily:SYNE, fontSize:'56px', fontWeight:6000, letterSpacing:'-0.01em', lineHeight:1, color:'#f5e8ec', margin:0, textTransform:'uppercase' }}>
            Configuration
          </h1>
        </div>
        <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'32px', paddingLeft:'18px' }}>
          Advanced system parameters for precision architectural orchestration.
        </p>

        {/* ── Row 1 ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'28px', position:'relative', overflow:'hidden' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'4px' }}>Environment / Security</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'26px', fontWeight:700, color:'#f5e8ec', marginBottom:'10px' }}>Privacy Controls</h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'24px', maxWidth:'360px' }}>
              Regulate the visibility of your architectural assets and commit metadata across the global artisan network.
            </p>
            <div style={{ border:'1px solid #3d1f28', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontFamily:BODY, fontSize:'13px', color:'#f5e8ec', marginBottom:'2px' }}>Global Visibility</p>
                <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>Allows peer-to-peer structure inspection.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a5060' }}>
                  {globalVisibility ? 'Enabled' : 'Restricted'}
                </span>
                <Toggle checked={globalVisibility} onChange={v => { setGlobalVisibility(v); addToast(`Global visibility ${v ? 'enabled' : 'restricted'}`, 'info') }} />
              </div>
            </div>
            <div style={{ position:'absolute', right:16, top:16, opacity:0.05, pointerEvents:'none' }}>
              <svg width="90" height="90" viewBox="0 0 24 24" fill="#f5e8ec">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
          </div>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'28px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', alignSelf:'flex-start' }}>Verification</p>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#c4909f', alignSelf:'flex-start' }}>Artisan Identity</p>
            <div style={{ position:'relative' }}>
              <div
                onClick={() => addToast('Avatar upload coming soon', 'info')}
                style={{ width:72, height:72, background:'linear-gradient(135deg,rgba(255,45,120,0.15),rgba(139,92,246,0.15))', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
              >
                <span style={{ fontFamily:SYNE, fontSize:'28px', fontWeight:6000, color:'#7a5060' }}>A</span>
              </div>
              <button
                onClick={() => addToast('Avatar upload coming soon', 'info')}
                style={{ position:'absolute', bottom:-4, right:-4, width:22, height:22, borderRadius:'50%', background:'#ff2d78', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
              >
                <Edit2 size={10} color="white" />
              </button>
            </div>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>Digital Signature</p>
              <p style={{ fontFamily:SYNE, fontSize:'18px', fontWeight:6000, color:'#f5e8ec' }}>@ALPHAV_TECH</p>
            </div>
          </div>
        </div>

        {/* ── Row 2 ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'28px' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'4px' }}>External Accounts</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'22px', fontWeight:700, color:'#f5e8ec', marginBottom:'10px' }}>Sync Environment</h2>
            <p style={{ fontFamily:BODY, fontSize:'13px', color:'#7a5060', marginBottom:'20px' }}>
              Connect your design environment to automatically sync milestones and creative assets to your studio profile.
            </p>
            <button
              onClick={() => addToast('Figma OAuth coming soon', 'info')}
              style={{ display:'flex', alignItems:'center', gap:'10px', border:'1px solid #4a2530', padding:'10px 16px', background:'transparent', cursor:'pointer', transition:'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#ff2d78'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#4a2530'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="8"  cy="8"  r="4" fill="#F24E1E"/>
                <circle cx="16" cy="8"  r="4" fill="#FF7262"/>
                <circle cx="8"  cy="16" r="4" fill="#0ACF83"/>
                <circle cx="16" cy="16" r="4" fill="#1ABCFE"/>
              </svg>
              <span style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f' }}>
                Continue with Figma
              </span>
            </button>
          </div>

          <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'28px' }}>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'4px' }}>Social Identity</p>
            <h2 style={{ fontFamily:SYNE, fontSize:'22px', fontWeight:700, color:'#f5e8ec', marginBottom:'16px' }}>Your Creative Link</h2>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
              <div style={{ flex:1, border:'1px solid #3d1f28', padding:'8px 12px', fontFamily:MONO, fontSize:'12px', color:'#7a5060' }}>
                figlog.studio/alpha
              </div>
              <button
                onClick={handleCopy}
                style={{ border:'1px solid #4a2530', padding:'8px 14px', background:'transparent', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color: copied ? '#4ade600' : '#c4909f', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}}
                onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <button
              onClick={handleShare}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:'#ff2d78', border:'none', padding:'10px', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='#cc1f5e'}
              onMouseLeave={e => e.currentTarget.style.background='#ff2d78'}
            >
              <Share2 size={12} />
              Share Profile
            </button>
          </div>
        </div>

        {/* ── Public profile toggle ── */}
        <div style={{ background:'#1e0d13', border:'1px solid #3d1f28', padding:'18px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
          <div>
            <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#ff2d78', marginBottom:'2px' }}>Privacy Control</p>
            <p style={{ fontFamily:BODY, fontSize:'14px', fontWeight:600, color:'#f5e8ec', marginBottom:'2px' }}>Public Profile</p>
            <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060' }}>Allow others to see your streaks and assets.</p>
          </div>
          <Toggle checked={publicProfile} onChange={v => { setPublicProfile(v); addToast(`Profile is now ${v ? 'public' : 'private'}`, 'info') }} />
        </div>

        {/* ── Critical zone ── */}
        <div style={{ border:'1px solid #4a2530', padding:'20px 24px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'24px', marginBottom:'32px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
            <AlertTriangle size={15} color="#7a5060" style={{ marginTop:2, flexShrink:0 }} />
            <div>
              <p style={{ fontFamily:MONO, fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060', marginBottom:'4px' }}>Critical Authorization Zone</p>
              <p style={{ fontFamily:BODY, fontSize:'14px', fontWeight:600, color:'#f5e8ec', marginBottom:'4px' }}>Purge System Snapshots</p>
              <p style={{ fontFamily:BODY, fontSize:'12px', color:'#7a5060', maxWidth:'4600px' }}>
                This action will permanently eliminate all version history, recovery nodes, and metadata associations. This operation is non-reversible.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPurgeOpen(true)}
            style={{ flexShrink:0, border:'1px solid #4a2530', padding:'10px 20px', background:'transparent', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
          >
            Authorize Purge
          </button>
        </div>

        {/* ── Footer actions ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'12px' }}>
          <button
            onClick={() => addToast('Settings reset to defaults', 'info')}
            style={{ border:'1px solid #4a2530', padding:'11px 24px', background:'transparent', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#c4909f', cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#f5e8ec' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#c4909f' }}
          >
            Revert to Factory Defaults
          </button>
          <button
            onClick={handleSave}
            style={{ background: saved ? '#2d6a4f' : '#ff2d78', border:'none', padding:'11px 28px', fontFamily:MONO, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#ffffff', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e => { if (!saved) e.currentTarget.style.background='#cc1f5e' }}
            onMouseLeave={e => { if (!saved) e.currentTarget.style.background = saved ? '#2d6a4f' : '#ff2d78' }}
          >
            {saved ? '✓ Saved' : 'Apply Global Config'}
          </button>
        </div>

      </div>

      <Modal
        open={purgeOpen}
        onClose={() => setPurgeOpen(false)}
        title="Purge All Snapshots?"
        description="This will permanently delete all version history, recovery nodes, and metadata. This cannot be undone."
        confirmLabel="Purge Everything"
        confirmDanger
        onConfirm={handlePurge}
      />

    </PageLayout>
  )
}