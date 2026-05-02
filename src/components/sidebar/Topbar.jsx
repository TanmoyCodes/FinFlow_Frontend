import { useState, useRef, useEffect } from 'react'
import api from '../../api/axios'
import { RiMenuLine, RiSunLine, RiMoonLine, RiBellLine, RiUserLine, RiSettings4Line, RiQuestionLine, RiLogoutBoxLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Topbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useThemeStore()
  const { role, logout, user } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notificationRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const fetchNotifications = () => {
    if (role === 'ADMIN') return
    api.get('/application/my-alerts')
      .then(({ data }) => setNotifications(data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowProfile(false)
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = () => {
    if (notifications.some(n => !n.read)) {
      api.put('/application/my-alerts/mark-read').then(() => fetchNotifications())
    }
    setShowNotifications(!showNotifications)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const menuItems = [
    { label: 'My Profile', icon: RiUserLine, onClick: () => navigate(role === 'ADMIN' ? '/admin/profile' : '/profile') },
    { label: 'Settings', icon: RiSettings4Line, onClick: () => toast.success('Settings coming soon!') },
    { label: 'Help & Support', icon: RiQuestionLine, onClick: () => toast.success('Support center coming soon!') },
  ]

  return (
    <header
      className={`h-16 flex items-center justify-between px-6 border-b flex-shrink-0 z-30 ${
        isDark
          ? 'bg-dark-800/80 border-white/06 backdrop-blur-xl'
          : 'bg-white/80 border-slate-200 backdrop-blur-xl'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-white/08 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <RiMenuLine size={20} />
        </button>

        <div>
          <h1 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {role === 'ADMIN' ? 'Admin Portal' : 'My Portal'}
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={markAsRead}
            className={`relative p-2 rounded-lg transition-all duration-200 active:scale-95 ${
              isDark ? 'hover:bg-white/08 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <RiBellLine size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-800 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute right-0 mt-2 w-80 rounded-2xl p-1.5 shadow-2xl border z-50 ${
                  isDark ? 'bg-dark-700 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="px-3 py-2 border-b border-inherit mb-1 flex justify-between items-center">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Notifications</span>
                  {notifications.some(n => !n.read) && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">New</span>}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <RiBellLine size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs text-slate-500">No notifications yet</p>
                    </div>
                  ) : notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-xl mb-1 flex gap-3 transition-colors ${
                        n.read ? 'opacity-60' : (isDark ? 'bg-white/05' : 'bg-blue-50/50')
                      }`}
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        n.type === 'SUCCESS' ? 'bg-green-500' : (n.type === 'WARNING' ? 'bg-red-500' : 'bg-blue-500')
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 active:scale-90 ${
            isDark ? 'hover:bg-white/08 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 0 : 360 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {isDark ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </motion.div>
        </button>

        {/* Avatar / Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ml-1 transition-all active:scale-95 hover:shadow-lg hover:shadow-blue-500/20"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            {user?.name?.[0] || role?.[0] || 'U'}
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`absolute right-0 mt-2 w-56 rounded-2xl p-1.5 shadow-2xl border ${
                  isDark
                    ? 'bg-dark-700 border-white/10 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="px-3 py-2.5 mb-1.5 border-b border-inherit">
                  <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {user?.name || 'Valued User'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate uppercase tracking-tight">
                    {user?.email || role}
                  </p>
                </div>

                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { item.onClick(); setShowProfile(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isDark ? 'hover:bg-white/05 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={16} className="opacity-70" />
                    {item.label}
                  </button>
                ))}

                <div className="mt-1.5 pt-1.5 border-t border-inherit">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <RiLogoutBoxLine size={16} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Topbar
