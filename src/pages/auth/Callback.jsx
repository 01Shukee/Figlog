import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'

const MONO = "'JetBrains Mono', monospace"
const SYNE = "'Syne', sans-serif"

export default function AuthCallback() {
  const navigate             = useNavigate()
  const { loginWithProfile } = useApp()
  const [status, setStatus]  = useState('Verifying session…')

  useEffect(() => {
    const run = async () => {
      try {
        setStatus('Verifying session…')

        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          setStatus('Authentication failed. Redirecting…')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        setStatus('Loading your profile…')

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profile?.handle) {
          setStatus('Setting up your workspace…')
          setTimeout(() => navigate('/onboarding'), 800)
          return
        }

        if (loginWithProfile) loginWithProfile(profile)
        setStatus('Welcome back!')
        setTimeout(() => navigate('/dashboard'), 600)

      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('Something went wrong. Redirecting…')
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    run()
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#120609', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ position:'relative', width:28, height:28 }}>
        <div style={{ position:'absolute', top:0, left:0, width:14, height:14, background:'#ff2d78', animation:'pulse 1.2s infinite' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, background:'#ff2d78', opacity:0.6, animation:'pulse 1.2s infinite 0.6s' }} />
      </div>
      <p style={{ fontFamily:MONO, fontSize:'11px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#7a5060' }}>
        {status}
      </p>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  )
}