import { motion } from 'framer-motion'
import useThemeStore from '../../store/themeStore'

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const { isDark } = useThemeStore()

  const colorMap = {
    blue:   { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.2)',  text: '#60a5fa',  icon: '#3b82f6' },
    purple: { bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.2)',  text: '#a78bfa',  icon: '#8b5cf6' },
    green:  { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.2)',   text: '#4ade80',  icon: '#22c55e' },
    amber:  { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.2)',  text: '#fbbf24',  icon: '#f59e0b' },
    red:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.2)',   text: '#f87171',  icon: '#ef4444' },
  }

  const c = colorMap[color] || colorMap.blue

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl p-5 relative overflow-hidden ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
        style={{ background: `radial-gradient(circle, ${c.icon}, transparent)` }} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {value ?? '—'}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>
          )}
          {trend !== undefined && (
            <span className={`inline-flex items-center text-xs font-medium mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </span>
          )}
        </div>

        {Icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            <Icon size={22} style={{ color: c.icon }} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard
