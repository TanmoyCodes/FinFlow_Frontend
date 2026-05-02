import { forwardRef } from 'react'
import useThemeStore from '../../store/themeStore'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  const { isDark } = useThemeStore()

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-500/60 focus:border-red-500'
              : isDark
                ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:bg-white/08'
                : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 shadow-sm'
            }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
