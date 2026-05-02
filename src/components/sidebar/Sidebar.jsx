import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiFileAddLine, RiFileListLine,
  RiUploadCloud2Line, RiTimeLine, RiShieldCheckLine,
  RiFileTextLine, RiBarChartLine, RiLogoutBoxLine,
  RiCloseLine, RiCheckboxCircleLine, RiUserLine
} from 'react-icons/ri'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import toast from 'react-hot-toast'

const userLinks = [
  { to: '/dashboard',         icon: RiDashboardLine,    label: 'Dashboard' },
  { to: '/apply-loan',        icon: RiFileAddLine,      label: 'Apply for Loan' },
  { to: '/my-applications',   icon: RiFileListLine,     label: 'My Applications' },
  { to: '/upload-documents',  icon: RiUploadCloud2Line, label: 'Upload Documents' },
  { to: '/status',            icon: RiTimeLine,         label: 'Status Tracking' },
]

const adminLinks = [
  { to: '/admin/dashboard',    icon: RiDashboardLine,   label: 'Dashboard' },
  { to: '/admin/applications', icon: RiFileListLine,    label: 'Applications' },
  { to: '/admin/documents',    icon: RiCheckboxCircleLine, label: 'Documents' },
  { to: '/admin/users',        icon: RiUserLine,        label: 'Users' },
  { to: '/admin/stats',        icon: RiBarChartLine,    label: 'Analytics' },
]

const Sidebar = ({ open, onClose }) => {
  const { role, logout, user } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const links = role === 'ADMIN' ? adminLinks : userLinks

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full z-40 flex flex-col"
          style={{
            width: 'var(--sidebar-width)',
            background: isDark
              ? 'linear-gradient(180deg, #0f1629 0%, #0a0e1a 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo and other content remains the same */}
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={`text-xl font-bold font-display gradient-text`}>FinFlow</span>
            </div>
            <button onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <RiCloseLine size={18} />
            </button>
          </div>

          <div className="px-5 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
              role === 'ADMIN'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/25'
                : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {role === 'ADMIN' ? 'Administrator' : 'User Account'}
            </span>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            <p className={`text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {role === 'ADMIN' ? 'Admin Panel' : 'Navigation'}
            </p>
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/08'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-white' : ''} />
                    <span>{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout and User Info */}
          <div className="p-4 mt-auto">
            <div className={`rounded-xl p-3 mb-3 ${isDark ? 'bg-white/04' : 'bg-slate-100'}`}>
              <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {user?.name || (role === 'ADMIN' ? 'Admin User' : 'Valued User')}
              </p>
              <p className={`text-[10px] mt-0.5 truncate uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {user?.email || role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <RiLogoutBoxLine size={18} />
              Sign Out
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
