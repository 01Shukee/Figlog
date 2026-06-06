figma.showUI(__html__, {
  width:  380,
  height: 640,
  title:  'Figlog',
  themeColors: false,
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function getFileContext() {
  return {
    fileKey:  figma.fileKey  || 'local',
    fileName: figma.root.name,
    pageName: figma.currentPage.name,
    frames:   figma.currentPage.children
      .filter(n => ['FRAME','COMPONENT','COMPONENT_SET'].includes(n.type))
      .map(n => ({ id: n.id, name: n.name, type: n.type }))
  }
}

function getSelectedFrame() {
  const sel = figma.currentPage.selection
  if (!sel.length) return null
  let node = sel[0]
  while (node.parent && node.parent.type !== 'PAGE') node = node.parent
  return { id: node.id, name: node.name, type: node.type }
}

function getPluginUser() {
  const u = figma.currentUser
  if (!u) return null
  return { name: u.name, photoUrl: u.photoUrl, color: u.color }
}

// ── Bootstrap — send everything the UI needs on open ─────────────────────────

function sendContext() {
  figma.ui.postMessage({
    type:         'INIT',
    fileContext:  getFileContext(),
    selectedFrame:getSelectedFrame(),
    figmaUser:    getPluginUser(),
  })
}

sendContext()

// ── Live updates ──────────────────────────────────────────────────────────────

figma.on('selectionchange', () => {
  figma.ui.postMessage({ type: 'SELECTION_CHANGE', selectedFrame: getSelectedFrame() })
})

figma.on('currentpagechange', () => {
  figma.ui.postMessage({
    type:         'PAGE_CHANGE',
    fileContext:  getFileContext(),
    selectedFrame:getSelectedFrame(),
  })
})

// ── Messages from UI ──────────────────────────────────────────────────────────

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case 'NOTIFY':
      figma.notify(msg.text, { timeout: msg.timeout || 3000, error: msg.error || false })
      break
    case 'CLOSE':
      figma.closePlugin()
      break
  }
}