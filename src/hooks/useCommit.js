import { useState, useCallback } from 'react'

const DEFAULT_ASSETS = [
  { name:'hero_banner_v2.png', status:'MODIFIED', statusColor:'#f59e0b' },
  { name:'color_palette.json', status:'NEW',      statusColor:'#22c55e' },
]

export function useCommit() {
  const [message,    setMessage]    = useState('')
  const [assets,     setAssets]     = useState(DEFAULT_ASSETS)
  const [committed,  setCommitted]  = useState(false)
  const [commitLog,  setCommitLog]  = useState([])

  const removeAsset = useCallback((i) => {
    setAssets(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  const commit = useCallback(() => {
    if (!message.trim() || assets.length === 0) return false
    const entry = {
      id:      `v${(commitLog.length + 1).toString().padStart(2,'0')}`,
      message: message.trim(),
      assets:  [...assets],
      time:    new Date().toLocaleTimeString('en-GB', { hour12:false }),
      date:    new Date().toLocaleDateString('en-GB'),
    }
    setCommitLog(prev => [entry, ...prev])
    setCommitted(true)
    setMessage('')
    setAssets(DEFAULT_ASSETS)
    setTimeout(() => setCommitted(false), 3000)
    return true
  }, [message, assets, commitLog])

  const stash = useCallback((stashFn) => {
    if (!message.trim()) return false
    stashFn({ message, assets: [...assets] })
    setMessage('')
    setAssets(DEFAULT_ASSETS)
    return true
  }, [message, assets])

  return {
    message, setMessage,
    assets,  removeAsset,
    committed,
    commitLog,
    commit,
    stash,
    hasChanges: message.trim().length > 0,
    charCount:  message.length,
  }
}