import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabase    = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const FIGMA_TOKEN = process.env.VITE_FIGMA_TOKEN

if (!FIGMA_TOKEN)                          { console.error('Missing VITE_FIGMA_TOKEN');          process.exit(1) }
if (!process.env.SUPABASE_URL)             { console.error('Missing SUPABASE_URL');               process.exit(1) }
if (!process.env.SUPABASE_SERVICE_ROLE_KEY){ console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

async function figmaGet(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Figma API ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

async function syncFigmaData() {
  console.log('── Figlog Sync Starting ──')

  // ── 1. Get current Figma user ────────────────────────────────────────────
  let me
  try {
    me = await figmaGet('/me')
    console.log(`Figma user: ${me.handle} (${me.email})`)
  } catch (err) {
    console.error('Failed to fetch Figma user:', err.message)
    process.exit(1)
  }

  // ── 2. Get recent file versions ──────────────────────────────────────────
  // Figma doesn't have a /me/files endpoint in all plans.
  // We use /me/files for Professional+ or fall back gracefully.
  let files = []
  try {
    const data = await figmaGet('/me/files?page_size=100')
    files = data.files || data.projects || []
    console.log(`Fetched ${files.length} files`)
  } catch (err) {
    console.warn('Could not fetch files (may need Professional plan):', err.message)
    // Continue — we can still sync the user record
  }

  // ── 3. Build activity map (date → commit count) ──────────────────────────
  const activityMap = {}
  files.forEach(file => {
    if (!file.last_modified) return
    const date = new Date(file.last_modified).toISOString().split('T')[0]
    activityMap[date] = (activityMap[date] || 0) + 1
  })

  console.log(`Activity dates found: ${Object.keys(activityMap).length}`)

  // ── 4. Upsert activity into Supabase ─────────────────────────────────────
  for (const [date, count] of Object.entries(activityMap)) {
    const { error } = await supabase
      .from('figma_activity')
      .upsert(
        { activity_date: date, commit_count: count, figma_handle: me.handle },
        { onConflict: 'activity_date' }
      )
    if (error) console.error(`Error syncing ${date}:`, error.message)
    else        console.log(`✓ Synced ${date}: ${count} file updates`)
  }

  // ── 5. Upsert Figma user info into profiles ──────────────────────────────
  // Match by figma_id so we can link Figma identity to Figlog account
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      figma_id:    me.id,
      avatar_url:  me.img_url || null,
      display_name: me.handle || me.email,
    })
    .eq('email', me.email)

  if (profileError) {
    console.warn('Profile update skipped (user may not exist yet):', profileError.message)
  } else {
    console.log(`✓ Profile synced for ${me.email}`)
  }

  console.log('── Figlog Sync Complete ──')
}

syncFigmaData().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})