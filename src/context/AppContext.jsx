import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

// Helper function to seed realistic random contribution heat (0-4) so the grid looks full on boot
const generateInitialMatrix = () => {
  const initialData = {}
  for (let m = 0; m < 12; m++) { // 12 Months
    for (let d = 0; d < 4; d++) { // 4 Display Days
      for (let w = 0; w < 4; w++) { // 4 Weeks
        // Gives a random heat intensity weighted toward lower values for realism
        const rand = Math.random()
        let heat = 0
        if (rand > 0.85) heat = 4
        else if (rand > 0.65) heat = 3
        else if (rand > 0.45) heat = 2
        else if (rand > 0.25) heat = 1
        initialData[`${m}-${d}-${w}`] = heat
      }
    }
  }
  return initialData
}

// Helper to find the current grid cell coordinate based on the calendar date right now
const getCurrentGridCoordinate = () => {
  const now = new Date()
  const mIndex = now.getMonth() // 0 - 11
  const wIndex = Math.min(Math.floor((now.getDate() - 1) / 7), 3) // 0 - 3
  
  // Map today's standard day index to your specific matrix rows ['MON','TUE','WED','FRI']
  const dayMap = { 1: 0, 2: 1, 3: 2, 5: 3 }
  const dIndex = dayMap[now.getDay()] !== undefined ? dayMap[now.getDay()] : 0 // Fallback to 0 (MON)
  
  return `${mIndex}-${dIndex}-${wIndex}`
}

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const [activeSession,    setActiveSession]    = useState(null)
  const [stashedCommit,    setStashedCommit]    = useState(null)
  const [archivedVersions, setArchivedVersions] = useState([])
  const [commitLog,        setCommitLog]        = useState([])
  const [activeFile,       setActiveFile]       = useState('core_render.sys')

  // ── Real Live Data States ──
  const [stats, setStats] = useState({
    currentStreak: 42,
    longestStreak: 128,
    baseCommitsCount: 2481
  })

  const [matrixHistory, setMatrixHistory] = useState(generateInitialMatrix())

  // Modified to update metrics instantly when Commit.jsx calls it
  const addCommit = useCallback((entry) => {
    // 1. Log the text event (Ensure frame defaults to 'General' if missing)
    const entryWithDefaults = { frame: 'General', ...entry }
    setCommitLog(prev => [entryWithDefaults, ...prev])

    // 2. Light up the matrix square for today (increase color intensity up to max index 4)
    const currentCoords = getCurrentGridCoordinate()
    setMatrixHistory(prev => {
      const currentHeat = prev[currentCoords] || 0
      return {
        ...prev,
        [currentCoords]: Math.min(currentHeat + 1, 4)
      }
    })
  }, [])

  const toggleArchive = useCallback((version) => {
    setArchivedVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
    )
  }, [])

  return (
    <AppContext.Provider value={{
      toasts, addToast,
      activeSession, setActiveSession,
      stashedCommit, setStashedCommit,
      archivedVersions, toggleArchive,
      commitLog, addCommit,
      activeFile, setActiveFile,
      stats,             // Consumed by Dashboard
      matrixHistory,     // Consumed by Dashboard
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}