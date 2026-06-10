import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  }
})

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success:false, error: error.message }
  return { success:true, session: data.session, user: data.user }
}

export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { success:false, error: error.message }
  return { success:true, session: data.session, user: data.user }
}

export async function signInWithFigma() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'figma',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'file_read',
    }
  })
  if (error) return { success:false, error: error.message }
  return { success:true, url: data.url }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { success: !error, error: error?.message }
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  })
  return { success: !error, error: error?.message }
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function checkHandleAvailable(handle) {
  const { data } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', handle)
    .maybeSingle()
  return !data
}

export async function insertCommit(userId, entry) {
  const { data, error } = await supabase
    .from('commits')
    .insert({
      user_id: userId,
      message: entry.message,
      file:    entry.file    || null,
      frame:   entry.frame   || 'General',
      version: entry.version || null,
      branch:  entry.branch  || 'main',
      assets:  entry.assets  || [],
    })
    .select()
    .single()
  if (!error) {
    await supabase.rpc('increment_commits', { uid: userId })
  }
  return { data, error }
}

export async function fetchCommits(userId, limit = 50) {
  const { data, error } = await supabase
    .from('commits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data || [], error }
}

export async function insertSession(userId, session) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id:      userId,
      project:      session.project,
      file_target:  session.fileTarget || null,
      duration_min: session.durationMin,
      started_at:   session.startedAt,
      ended_at:     session.endedAt,
    })
    .select()
    .single()
  return { data, error }
}

export async function fetchSessions(userId, limit = 20) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data || [], error }
}

export async function fetchMatrix(userId) {
  const { data, error } = await supabase
    .from('matrix_history')
    .select('data')
    .eq('user_id', userId)
    .single()
  return { data: data?.data || {}, error }
}

export async function updateMatrixCell(userId, coordinate, newHeat) {
  const { data: current } = await fetchMatrix(userId)
  const updated = { ...current, [coordinate]: Math.min(newHeat, 4) }
  const { error } = await supabase
    .from('matrix_history')
    .update({ data: updated, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  return { error }
}