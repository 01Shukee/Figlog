import { useState, useMemo } from 'react'
import { RotateCcw, Archive, Lock, FileCode } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Modal from '../components/ui/Modal'
import { useApp } from '../context/AppContext'

const DESIGN_SYSTEM = {
  mono: "'JetBrains Mono', monospace",
  syne: "'Syne', sans-serif",
  body: "'Barlow', sans-serif"
}

// Added 'frame' property to fallbacks to ensure they render in the hierarchy
const STABLE_FALLBACK_COMMITS = [
  { version: 'v2.1.04', message: 'Update vector pathing algorithm',      date: 'Oct 24, 2023', time: '14:22:05', file: 'core_render.sys', frame: 'Engine' },
  { version: 'v2.1.00', message: 'Optimized math matrix computations',        date: 'Oct 22, 2023', time: '11:14:02', file: 'core_render.sys', frame: 'Engine' },
  { version: 'v2.0.95', message: 'Patched kernel thread safety allocation',    date: 'Oct 19, 2023', time: '08:05:44', file: 'core_render.sys', frame: 'Kernel' },
  { version: 'v2.0.90', message: 'Rebuilt coordinate space pipeline transform',date: 'Oct 15, 2023', time: '17:30:12', file: 'core_render.sys', frame: 'Transform' },
  { version: 'v2.0.88', message: 'Initial core structure layout baseline',    date: 'Oct 10, 2023', time: '09:11:00', file: 'core_render.sys', frame: 'UI' },
  { version: 'v2.1.03', message: 'Modified shader light-pass constants',       date: 'Oct 24, 2023', time: '09:15:33', file: 'lighting_engine.glsl', frame: 'Shaders' },
  { version: 'v2.0.82', message: 'Fallback support for Legacy WebGL pipelines',date: 'Oct 12, 2023', time: '16:42:10', file: 'lighting_engine.glsl', frame: 'Pipeline' },
  { version: 'v2.1.02', message: 'Fixing aspect ratio scaling on mobile',     date: 'Oct 23, 2023', time: '18:44:12', file: 'viewport_manager.ts', frame: 'Mobile_Resizer' },
  { version: 'v2.1.01', message: 'Initial deployment of experimental engine',  date: 'Oct 22, 2023', time: '23:59:59', file: 'manifest.json', frame: 'Deploy' },
  { version: 'v2.0.99', message: 'Emergency rollback of broken texture maps',  date: 'Oct 21, 2023', time: '11:02:14', file: 'assets_index.db', frame: 'DB_Core' },
]

function IconBtn({ icon: Icon, disabled, title, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ width:30, height:30, border:`1px solid ${disabled ? '#3d1f28' : '#4a2530'}`, background:'transparent', cursor: disabled ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: disabled ? '#4a2f38' : '#7a5060', transition:'border-color 0.15s, color 0.15s' }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor='#ff2d78'; e.currentTarget.style.color='#ff2d78' }}}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor='#4a2530'; e.currentTarget.style.color='#7a5060' }}}
    >
      <Icon size={13} strokeWidth={1.5} />
    </button>
  )
}

export default function VersionHistory() {
  const { archivedVersions, toggleArchive, commitLog, addToast, activeFile } = useApp()
  
  const [revertTarget, setRevertTarget] = useState(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [localActiveOverrides, setLocalActiveOverrides] = useState({})

  const activeDisplayCommits = useMemo(() => {
    const formattedLiveCommits = commitLog.map(c => ({
      version: c.version || `v2.1.${Math.floor(10 + Math.random() * 89)}`,
      message: c.message || 'System architecture commit',
      date: c.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: c.time || new Date().toLocaleTimeString('en-US', { hour12: false }),
      file: c.file || c.fileTarget || 'core_render.sys',
      frame: c.frame || 'General',
    }))

    const combined = [...formattedLiveCommits, ...STABLE_FALLBACK_COMMITS]
    const assignedFiles = new Set()
    
    return combined.map(commit => {
      const targetFileKey = commit.file || commit.fileTarget
      
      if (localActiveOverrides[targetFileKey]) {
        return {
          ...commit,
          current: commit.version === localActiveOverrides[targetFileKey]
        }
      }

      if (!assignedFiles.has(targetFileKey)) {
        assignedFiles.add(targetFileKey)
        return { ...commit, current: true }
      }

      return { ...commit, current: false }
    })
  }, [commitLog, localActiveOverrides])

  // NEW LOGIC: Groups by File -> Then by Frame
  const groupedFiles = useMemo(() => {
    // Filter only for the currently open file
    const relevantCommits = activeDisplayCommits.filter(c => c.file === activeFile)
    const sorted = [...relevantCommits].sort((a, b) => b.version.localeCompare(a.version))
    
    const hierarchy = {}
    
    sorted.forEach(commit => {
      const fileName = commit.file || 'Unknown'
      const frameName = commit.frame || 'General'
      
      if (!hierarchy[fileName]) hierarchy[fileName] = {}
      if (!hierarchy[fileName][frameName]) hierarchy[fileName][frameName] = []
      
      hierarchy[fileName][frameName].push(commit)
    })
    return hierarchy
  }, [activeDisplayCommits, activeFile])

  const handleRevert = (targetCommit) => {
    const fileTargetKey = targetCommit.file || targetCommit.fileTarget
    setLocalActiveOverrides(prev => ({ ...prev, [fileTargetKey]: targetCommit.version }))
    setRevertTarget(null)
    if (addToast) addToast(`Switched active production layout source to ${targetCommit.version}`, 'success')
  }

  return (
    <PageLayout footerLeft="© 2026 NEON_STUDIO">
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'36px 48px' }}>

        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', paddingBottom:'24px', borderBottom:'1px solid #3d1f28', marginBottom:'32px' }}>
          <div>
            <h1 style={{ fontFamily:DESIGN_SYSTEM.syne, fontSize:'72px', fontWeight:600, lineHeight:1, color:'#f5e8ec', letterSpacing:'-0.01em', textTransform:'uppercase', margin:0 }}>
              Archive
            </h1>
            <p style={{ fontFamily:DESIGN_SYSTEM.body, fontSize:'13px', color:'#7a5060', marginTop:'6px' }}>
              Deep architecture isolation for: {activeFile || 'No file selected'}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', border:'1px solid #4a2530', padding:'6px 12px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff2d78' }} />
            <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.12em', color:'#c4909f' }}>
              Status: LIVE_BUILD
            </span>
          </div>
        </div>

        {/* Triple Hierarchy Rendering: File -> Frames -> Versions */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
          {Object.entries(groupedFiles).map(([fileName, frames]) => (
            <div key={fileName} style={{ background:'#12070a', border:'1px solid #2e1820' }}>
              
              {/* FILE HEADER */}
              <div style={{ background:'#1e0d13', borderBottom:'1px solid #3d1f28', padding:'14px 20px', display:'flex', alignItems:'center', gap:'10px' }}>
                <FileCode size={14} color="#ff2d78" />
                <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'12px', fontWeight:700, color:'#f5e8ec', letterSpacing:'0.05em' }}>
                  {fileName}
                </span>
              </div>

              {/* FRAMES CONTAINER */}
              {Object.entries(frames).map(([frameName, frameCommits]) => (
                <div key={frameName} style={{ borderBottom: '1px solid #1c0c11' }}>
                  <div style={{ padding: '10px 20px', background: 'rgba(255, 45, 120, 0.03)', fontFamily: DESIGN_SYSTEM.mono, fontSize: '9px', color: '#ff2d78', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                     {frameName}
                  </div>
                  
                  {frameCommits.map((c, index) => {
                    const isArchived = archivedVersions?.includes(c.version)
                    const isLockedByTier = index >= 3
                    
                    return (
                      <div
                        key={c.version}
                        style={{ 
                          display:'flex', alignItems:'center', padding:'16px 24px', 
                          borderBottom: index < frameCommits.length - 1 ? '1px solid #1c0c11' : 'none', 
                          opacity: isArchived ? 0.35 : isLockedByTier ? 0.5 : 1, 
                          cursor: isLockedByTier ? 'pointer' : 'default', 
                          transition:'background 0.15s, opacity 0.2s' 
                        }}
                        onMouseEnter={e => { if (!isLockedByTier) e.currentTarget.style.background='#190a0f' }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
                        onClick={() => { if (isLockedByTier) setUpgradeOpen(true) }}
                      >
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                            {c.current && (
                              <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', color:'#4ade80', border:'1px solid rgba(74,222,128,0.25)', padding:'2px 6px', background:'rgba(74,222,128,0.02)' }}>
                                CURRENT
                              </span>
                            )}
                            <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'11px', fontWeight:700, color: isLockedByTier ? '#5c3945' : '#ff2d78' }}>
                              {c.version}
                            </span>
                            <span style={{ fontFamily:DESIGN_SYSTEM.body, fontSize:'14px', color: isLockedByTier ? '#7a5060' : '#f5e8ec', textDecoration: isArchived ? 'line-through' : 'none' }}>
                              {c.message}
                            </span>
                          </div>
                          
                          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'6px' }}>
                            <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'11px', color:'#7a5060' }}>{c.date}</span>
                            <span style={{ color:'#2e1820' }}>|</span>
                            <span style={{ fontFamily:DESIGN_SYSTEM.mono, fontSize:'11px', color:'#7a5060' }}>{c.time}</span>
                          </div>
                        </div>

                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginLeft:'16px' }} onClick={e => e.stopPropagation()}>
                          {isLockedByTier ? (
                            <IconBtn icon={Lock} title="Historical node restricted" onClick={() => setUpgradeOpen(true)} />
                          ) : (
                            <IconBtn icon={RotateCcw} title="Switch active screen version" onClick={() => setRevertTarget(c)} />
                          )}
                          <IconBtn
                            icon={Archive}
                            disabled={isLockedByTier}
                            title={isArchived ? 'Unarchive' : 'Archive'}
                            onClick={() => {
                              toggleArchive(c.version)
                              if (addToast) addToast(isArchived ? `${c.version} restored` : `${c.version} archived`, 'info')
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modals remain the same */}
      <Modal open={!!revertTarget} onClose={() => setRevertTarget(null)} title="Switch Component Baseline?" description={`Switch "${revertTarget?.file}" to ${revertTarget?.version}.`} confirmLabel="Confirm Swap" onConfirm={() => handleRevert(revertTarget)} />
      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Access Blocked" description="Pro upgrade required for history recovery." confirmLabel="Upgrade to Pro" onConfirm={() => setUpgradeOpen(false)} />
    </PageLayout>
  )
}