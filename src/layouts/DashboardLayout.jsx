import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import Topbar from '../components/sidebar/Topbar'
import useThemeStore from '../store/themeStore'

const DashboardLayout = () => {
  const { isDark } = useThemeStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-dark-900' : 'bg-slate-50'}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '0' }}
      >
        <Topbar onMenuClick={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
