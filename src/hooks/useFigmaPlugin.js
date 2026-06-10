import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'

// Detects if the app is running inside a Figma plugin iframe
export function isInsidePlugin() {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

// Hook — call this once in App.jsx to wire up Figma ↔ React communication
export function useFigmaPlugin() {
  const { setActiveFile, addToast } = useApp()

  // Send a message to Figma main thread (code.js)
  const sendToFigma = useCallback((msg) => {
    if (!isInsidePlugin()) return
    window.parent.postMessage(msg, '*')
  }, [])

  // Notify Figma with a toast
  const figmaNotify = useCallback((text, error = false) => {
    sendToFigma({ type: 'NOTIFY', text, error })
  }, [sendToFigma])

  useEffect(() => {
    if (!isInsidePlugin()) return

    const handler = (event) => {
      const msg = event.data
      if (!msg || msg.source !== 'figma-plugin') return

      switch (msg.type) {
        case 'FIGMA_CONTEXT':
        case 'PAGE_CHANGE':
          if (msg.fileName) setActiveFile(msg.fileName)
          break

        case 'SELECTION_CHANGE':
          // Selection changed in Figma canvas — could update active frame
          break
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [setActiveFile])

  return { sendToFigma, figmaNotify, isPlugin: isInsidePlugin() }
}