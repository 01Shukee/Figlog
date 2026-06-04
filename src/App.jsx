import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider }       from './context/AppContext'
import ToastContainer        from './components/ui/Toast'
import Dashboard             from './pages/Dashboard'
import Activity              from './pages/Activity'
import VersionHistory        from './pages/VersionHistory'
import Commit                from './pages/Commit'
import Configuration         from './pages/Configuration'
import PublicProfile         from './pages/web/PublicProfile'
import AnalyticsDashboard    from './pages/web/AnalyticsDashboard'
import SharingMilestones     from './pages/plugin/SharingMilestones'
import AuthSettings          from './pages/plugin/AuthSettings'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                  element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/activity"          element={<Activity />} />
          <Route path="/version-history"   element={<VersionHistory />} />
          <Route path="/commit"            element={<Commit />} />
          <Route path="/settings"          element={<Configuration />} />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/analytics"         element={<AnalyticsDashboard />} />
          <Route path="/milestones"        element={<SharingMilestones />} />
          <Route path="/onboarding"        element={<AuthSettings />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  )
}