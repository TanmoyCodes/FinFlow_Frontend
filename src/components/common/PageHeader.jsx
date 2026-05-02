import useThemeStore from '../../store/themeStore'

const PageHeader = ({ title, subtitle, action }) => {
  const { isDark } = useThemeStore()
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default PageHeader
