import { useState, useEffect } from 'react'
import { X, SlidersHorizontal, GitBranch, ChevronDown, FileCode, Layers, Package, RotateCcw } from 'lucide-react'
import PageLayout  from '../components/layout/PageLayout'
import Modal       from '../components/ui/Modal'
import { useApp }  from '../context/AppContext'

const MONO    = "'JetBrains Mono', monospace"
const DISPLAY = "'Barlow Condensed', sans-serif"
const SYNE    = "'Syne', sans-serif"
const BODY    = "'Barlow', sans-serif"

// Fallback historic registry to pull previous asset diff mutations dynamically
const HISTORIC_ASSETS_BY_FILE = {
  'core_render.sys': [
    { name: 'vector_path_v3.glsl', status: 'MODIFIED', statusColor: '#f59e0b' },
    { name: 'kernel_buffer.alloc', status: 'MODIFIED', statusColor: '#f59e0b' }
  ],
  'lighting_engine.glsl': [
    { name: 'light_pass_constants.h', status: 'MODIFIED', statusColor: '#f59e0b' }
  ],
  'viewport_manager.ts': [
    { name: 'display_ratio_scales.ts', status: 'NEW', statusColor: '#22c55e' }
  ],
  'manifest.json': [
    { name: 'package.json', status: 'MODIFIED', statusColor: '#f59e0b' }
  ],
  'assets_index.db': [
    { name: 'texture_map_v4.tar', status: 'DELETED', statusColor: '#ef4444' }
  ]
}

const BRANCHES = ['main', 'dev', 'feature/redesign', 'hotfix/banner']

export default function Commit() {
  // Pulling commitLog and addCommit explicitly from your active context configuration
  const { 
    addToast, 
    stashedCommit, 
    setStashedCommit, 
    addCommit, 
    activeFile, 
    fileCommitCounts, 
    incrementFileCommits,
    commitLog = [] // Fallback to your real state variable name
  } = useApp()

  // 1. Auto-detect file target and preserve it
  const defaultFile = activeFile || 'core_render.sys'
  const [targetFile, setTargetFile] = useState(defaultFile)
  
  const [assets, setAssets] = useState([])
  const [message, setMessage] = useState('')
  const [branch, setBranch] = useState('main')
  const [branchOpen, setBranchOpen] = useState(false)
  const [stashConfirm, setStashConfirm] = useState(false)
  const [committed, setCommitted] = useState(false)

  // 2. Tab-Switch Persistence: Load saved workspace drafts on mount or target shift
  useEffect(() => {
    const savedDraft = localStorage.getItem(`neon_draft_${targetFile}`)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setMessage(parsed.message || '')
        setAssets(parsed.assets || [])
      } catch (e) {
        setMessage('')
        setAssets(HISTORIC_ASSETS_BY_FILE[targetFile] ? [...HISTORIC_ASSETS_BY_FILE[targetFile]] : [])
      }
    } else {
      setMessage('')
      if (HISTORIC_ASSETS_BY_FILE[targetFile]) {
        setAssets([...HISTORIC_ASSETS_BY_FILE[targetFile]])
      } else {
        setAssets([{ name: 'patch_delta.diff', status: 'MODIFIED', statusColor: '#f59e0b' }])
      }
    }
  }, [targetFile])

  // 3. Tab-Switch Persistence: Save work-in-progress layout instantly on any keystroke
  useEffect(() => {
    if (targetFile) {
      localStorage.setItem(`neon_draft_${targetFile}`, JSON.stringify({ message, assets }))
    }
  }, [message, assets, targetFile])

  const charCount = message.length
  const hasChanges = message.trim().length > 0 || (assets && assets.length > 0)

  const handleCommit = () => {
    if (message.trim().length === 0) { 
      addToast('Add a commit message first', 'error')
      return 
    }

    const entry = {
      id: `commit_${Date.now()}`,
      // Dynamically matches your total log database index length
      version: `v2.1.${10 + (commitLog ? commitLog.length : 0)}`,
      message: message.trim(),
      file: targetFile, 
      fileTarget: targetFile,
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      date: new Date().toLocaleDateString('en-GB'),
      assets: assets ? [...assets] : [], 
    }

    // Writes straight to your shared context so it populates both layouts cleanly
    if (addCommit) addCommit(entry)
    
    if (incrementFileCommits) {
      incrementFileCommits(targetFile)
    }

    setCommitted(true)
    setMessage('')
    setAssets([])
    
    // Clear persistent workspace cache for this node file upon a successful production build
    localStorage.removeItem(`neon_draft_${targetFile}`)
    
    addToast(`Changes committed to version history for ${targetFile}`, 'success')
    setTimeout(() => setCommitted(false), 2500)
  }

  // --- How Stash Works ---
  const handleStash = () => {
    if (!hasChanges && message.length === 0) { 
      addToast('Nothing to stash', 'error')
      return 
    }
    
    // 1. Pack up active drafts and save them directly inside the AppContext shelf
    setStashedCommit({ 
      message: message.trim(), 
      fileTarget: targetFile,
      assets: assets ? [...assets] : [] 
    })
    
    // 2. Clear out the workspace states cleanly
    setMessage('')
    setAssets([])
    localStorage.removeItem(`neon_draft_${targetFile}`)

    addToast('Workspace changes shifted to background stash storage', 'info')
    setStashConfirm(false)
  }

  const handlePopStash = () => {
    if (!stashedCommit) return

    // 1. Re-open the saved workbench data back onto your active screen layout panels
    setTargetFile(stashedCommit.fileTarget)
    setMessage(stashedCommit.message || '')
    setAssets(stashedCommit.assets ? [...stashedCommit.assets] : [])

    // 2. Free up the stash shelf memory slot
    setStashedCommit(null)
    addToast('Stashed changes restored to working desk', 'success')
  }

  // Safe variables for array structural loops
  const safeAssets = assets || []
  const safeCommits = commitLog || []
  const currentCommitCount = (fileCommitCounts && fileCommitCounts[targetFile]) ?? 
    (safeCommits.filter(c => c.file === targetFile || c.fileTarget === targetFile).length + 14)

  return (
    <PageLayout footerLeft="© 2026 NEON_STUDIO">
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '36px 48px' }}>

        {/* Header Section Layout */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between', marginBottom: '4px', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a5060', marginBottom: '6px' }}>
              Versioning / Operational Desk
            </p>
            <h1 style={{ fontFamily: SYNE, fontSize: '64px', fontWeight: 600, lineHeight: 1, color: '#f5e8ec', letterSpacing: '-0.01em', textTransform: 'uppercase', margin: 0 }}>
              Commit Changes
            </h1>
          </div>

          {/* Branch Picker Dropdown */}
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <button
              onClick={() => setBranchOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #4a2530', padding: '7px 14px', fontFamily: MONO, fontSize: '11px', color: '#c4909f', background: 'transparent', cursor: 'pointer', transition: 'border-color 0.15s' }}
            >
              <GitBranch size={11} />
              {branch}
              <ChevronDown size={10} style={{ transform: branchOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            {branchOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#1e0d13', border: '1px solid #4a2530', zIndex: 100, minWidth: 170 }}>
                {BRANCHES.map(b => (
                  <div
                    key={b}
                    onClick={() => { setBranch(b); setBranchOpen(false) }}
                    style={{ padding: '9px 14px', fontFamily: MONO, fontSize: '11px', color: b === branch ? '#ff2d78' : '#c4909f', cursor: 'pointer' }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ height: '1px', background: '#3d1f28', margin: '20px 0' }} />

        {/* Live File Context Status Bar Banner */}
        <div style={{ background: '#14060c', border: '1px solid #4a2530', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileCode size={16} color="#ff2d78" />
            <div>
              <p style={{ fontFamily: MONO, fontSize: '9px', textTransform: 'uppercase', color: '#7a5060', margin: 0 }}>Detected Targeting Node</p>
              <span style={{ fontFamily: MONO, fontSize: '14px', color: '#f5e8ec', fontWeight: 700 }}>{targetFile}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: MONO, fontSize: '9px', textTransform: 'uppercase', color: '#7a5060', margin: 0 }}>Real-Time File Commits</p>
              <span style={{ fontFamily: MONO, fontSize: '14px', color: '#ff2d78', fontWeight: 700 }}>
                {currentCommitCount} total checkins
              </span>
            </div>
            
            <select 
              value={targetFile} 
              onChange={(e) => setTargetFile(e.target.value)}
              style={{ background: '#1e0d13', border: '1px solid #3d1f28', color: '#c4909f', padding: '6px 10px', fontFamily: MONO, fontSize: '11px', outline: 'none', cursor: 'pointer' }}
            >
              {Object.keys(HISTORIC_ASSETS_BY_FILE).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Workspace Splitter */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '12px', marginBottom: '16px' }}>

          {/* Commit Message Box */}
          <div style={{ background: '#1e0d13', border: '1px solid #3d1f28', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a5060', marginBottom: '16px' }}>
              Commit Message Description
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 500))}
              placeholder={`Document incremental changes staging inside ${targetFile}...`}
              style={{ flex: 1, minHeight: '160px', background: 'transparent', resize: 'none', border: 'none', outline: 'none', fontFamily: DISPLAY, fontSize: '28px', fontWeight: 400, color: '#f5e8ec', lineHeight: 1.3 }}
              className="placeholder-text-dim"
            />
            <div style={{ borderTop: '1px solid #3d1f28', paddingTop: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasChanges ? '#ff2d78' : '#4a2f38' }} />
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#7a5060' }}>
                  {hasChanges ? `Diff modifications compiled for ${targetFile}` : 'No changes injected'}
                </span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: '10px', color: '#7a5060' }}>{charCount} / 500</span>
            </div>
          </div>

          {/* Staged Assets Panel */}
          <div style={{ background: '#1e0d13', border: '1px solid #3d1f28', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #3d1f28', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a5060' }}>
                Staged Assets ({safeAssets.length})
              </p>
              <button style={{ background: 'none', border: 'none', color: '#7a5060', cursor: 'pointer', display: 'flex' }}>
                <SlidersHorizontal size={13} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {safeAssets.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', opacity: 0.4 }}>
                  <Package size={24} color="#7a5060" />
                  <p style={{ fontFamily: MONO, fontSize: '10px', color: '#7a5060', margin: 0, textAlign: 'center' }}>No asset variances found since last commit snapshot</p>
                </div>
              ) : (
                safeAssets.map((a, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    onMouseEnter={e => { const btn = e.currentTarget.querySelector('.remove-btn'); if (btn) btn.style.opacity = '1' }}
                    onMouseLeave={e => { const btn = e.currentTarget.querySelector('.remove-btn'); if (btn) btn.style.opacity = '0' }}
                  >
                    <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${a.statusColor}22,${a.statusColor}44)`, border: '1px solid rgba(61,31,40,0.5)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#f5e8ec', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{a.name}</p>
                      <p style={{ fontFamily: MONO, fontSize: '10px', color: a.statusColor, marginTop: 2, fontWeight: 700, margin: 0 }}>{a.status}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => setAssets(prev => (prev || []).filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', color: '#7a5060', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s, color 0.15s', display: 'flex', padding: 2 }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid #3d1f28' }}>
              <p style={{ fontFamily: MONO, fontSize: '10px', fontStyle: 'italic', color: '#7a5060' }}>
                Inheriting structural changes from previous checkout state.
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCommit}
            disabled={message.trim().length === 0}
            style={{ fontFamily: DISPLAY, fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '14px 36px', cursor: message.trim().length ? 'pointer' : 'not-allowed', background: committed ? '#2d6a4f' : message.trim().length ? '#2e1820' : '#1c0c11', color: message.trim().length ? '#f5e8ec' : '#4a2f38', border: message.trim().length ? '1px solid #ff2d78' : '1px solid #3d1f28', transition: 'all 0.15s' }}
          >
            {committed ? '✓ Snapshot Saved' : 'Commit Changes'}
          </button>
          
          <button
            onClick={() => hasChanges ? setStashConfirm(true) : addToast('Add text to populate stashed buffer logs', 'error')}
            style={{ fontFamily: DISPLAY, fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '14px 36px', background: 'transparent', cursor: 'pointer', border: '1px solid #4a2530', color: '#c4909f' }}
          >
            Stash Changes
          </button>
          
          {/* Dynamic Pop/Restore Button that activates when a stash layer is available */}
          {stashedCommit && (
            <button
              onClick={handlePopStash}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', background: 'rgba(255,45,120,0.08)', border: '1px solid #ff2d78', padding: '10px 18px', fontFamily: MONO, fontSize: '11px', color: '#f5e8ec', cursor: 'pointer' }}
            >
              <RotateCcw size={12} color="#ff2d78" />
              <span>Pop Stash Container ({stashedCommit.fileTarget})</span>
            </button>
          )}
        </div>

        {/* Live Shared Context Debug Stream Log mapped to commitLog */}
        <div style={{ marginTop: '32px', borderTop: '1px solid #2e1820', paddingTop: '20px' }}>
          <p style={{ fontFamily: MONO, fontSize: '10px', textTransform: 'uppercase', color: '#7a5060', marginBottom: '12px' }}>
            Shared Application Core History Buffer
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {safeCommits.slice(0, 2).map((c, idx) => (
              <div key={idx} style={{ background: '#12070a', border: '1px solid #2e1820', padding: '8px 14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#ff2d78', background: '#2e1820', padding: '2px 6px' }}>{c.file || c.fileTarget}</span>
                <span style={{ fontFamily: BODY, fontSize: '13px', color: '#c4909f' }}>{c.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Modal
        open={stashConfirm}
        onClose={() => setStashConfirm(false)}
        title="Stash Current Target Adjustments?"
        description={`Your message and modifications for "${targetFile}" will be frozen into the temporary storage layer.`}
        confirmLabel="Stash Assets"
        onConfirm={handleStash}
      />

      <style>{`.placeholder-text-dim::placeholder { color: #4a2f38 !important; }`}</style>
    </PageLayout>
  )
}