import useThemeStore from '../../store/themeStore'

const LoadingSkeleton = ({ rows = 5, cols = 4 }) => {
  const { isDark } = useThemeStore()
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={`h-10 rounded-lg flex-1 skeleton ${isDark ? 'bg-white/06' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export const CardSkeleton = ({ count = 4 }) => {
  const { isDark } = useThemeStore()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`h-32 rounded-2xl skeleton ${isDark ? 'bg-white/06' : 'bg-slate-200'}`} />
      ))}
    </div>
  )
}

export default LoadingSkeleton
