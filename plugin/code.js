figma.showUI(__html__, {
  width:  1280,
  height: 800,
  title:  'Figlog',
  themeColors: false,
})

// ── Send Figma context to the web app ─────────────────────────────────────────

function getContext() {
  const user = figma.currentUser
  return {
    type:      'FIGMA_CONTEXT',
    fileKey:   figma.fileKey  || 'local',
    fileName:  figma.root.name,
    pageName:  figma.currentPage.name,
    frames:    figma.currentPage.children
      .filter(n => ['FRAME','COMPONENT','COMPONENT_SET'].includes(n.type))
      .map(n => ({ id: n.id, name: n.name, type: n.type })),
    figmaUser: user
      ? { name: user.name, photoUrl: user.photoUrl, color: user.color }
      : null,
    selectedFrame: getSelected(),
  }
}

function getSelected() {
  const sel = figma.currentPage.selection
  if (!sel.length) return null
  let node = sel[0]
  while (node.parent && node.parent.type !== 'PAGE') node = node.parent
  return { id: node.id, name: node.name, type: node.type }
}

// Send context once on open, then on every change
figma.ui.postMessage(getContext())

figma.on('selectionchange', () => {
  figma.ui.postMessage({ type: 'SELECTION_CHANGE', selectedFrame: getSelected() })
})

figma.on('currentpagechange', () => {
  figma.ui.postMessage(getContext())
})

// ── Messages from the web app ─────────────────────────────────────────────────
figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case 'NOTIFY':
      figma.notify(msg.text, { timeout: msg.timeout || 3000, error: msg.error || false })
      break
    case 'RESIZE':
      figma.ui.resize(msg.width || 1280, msg.height || 800)
      break
    case 'CLOSE':
      figma.closePlugin()
      break
  }
}