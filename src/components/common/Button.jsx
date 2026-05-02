import { motion } from 'framer-motion'
import useThemeStore from '../../store/themeStore'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight,
  className = '',
  ...props
}) => {
  const { isDark } = useThemeStore()

  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
    xl: 'px-8 py-3.5 text-base',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40',
    secondary: isDark
      ? 'bg-white/08 hover:bg-white/12 text-slate-200 border border-white/10'
      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/25',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-600/25',
    ghost: isDark
      ? 'text-slate-400 hover:text-white hover:bg-white/08'
      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon && (
        <Icon size={16} />
      )}
      {children}
      {iconRight && !loading && <iconRight size={16} />}
    </motion.button>
  )
}

export default Button
