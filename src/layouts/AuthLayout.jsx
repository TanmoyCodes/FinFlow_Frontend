import { motion } from 'framer-motion'
import useThemeStore from '../store/themeStore'

const AuthLayout = ({ children }) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-mesh' : 'bg-mesh-light'}`}>
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-[15%] w-60 h-60 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 mb-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold font-display gradient-text">FinFlow</span>
          </motion.div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Smart Loan Processing Platform
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  )
}

export default AuthLayout
