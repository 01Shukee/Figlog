import { NavLink, useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
// Import the logo asset (adjust the path if your assets folder is located elsewhere)
import FiglogLogo from '../../assets/logo.png'

export default function Navbar() {
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard',       label: 'Dashboard' },
    { to: '/activity',        label: 'Activity' },
    { to: '/version-history', label: 'Version History' },
    { to: '/commit',          label: 'Commit' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-bg-base border-b border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center no-underline">
          <img 
            src={FiglogLogo} 
            alt="FIGLOG" 
            style={{ 
              height: '24px', 
              width: 'auto', 
              display: 'block',
              imageRendering: 'pixelated' // Keeps the blocky logo razor-sharp
            }} 
          />
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Settings — clickable, routes to /settings */}
        <button
          onClick={() => navigate('/settings')}
          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings size={17} strokeWidth={1.5} />
        </button>

      </div>
    </header>
  )
}