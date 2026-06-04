import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef           = useRef(null)
  const startTimeRef          = useRef(null)

  const start = useCallback(() => {
    if (running) return
    startTimeRef.current = Date.now() - elapsed * 1000
    intervalRef.current  = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    setRunning(true)
  }, [running, elapsed])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setElapsed(0)
  }, [])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60

  const display = h > 0
    ? `${h}h ${String(m).padStart(2,'0')}m`
    : `${m}m ${String(s).padStart(2,'0')}s`

  return { running, elapsed, start, stop, reset, display }
}