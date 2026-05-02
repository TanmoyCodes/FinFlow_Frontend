import useThemeStore from '../../store/themeStore'
import Badge from './Badge'

const DataTable = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  const { isDark } = useThemeStore()

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-12 rounded-xl skeleton ${isDark ? 'bg-white/05' : 'bg-slate-100'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={`border-b ${isDark ? 'border-white/06' : 'border-slate-100'}`}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/04">
          {!data?.length ? (
            <tr>
              <td colSpan={columns.length} className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="flex flex-col items-center gap-2">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="opacity-40">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={`transition-colors ${isDark ? 'hover:bg-white/03' : 'hover:bg-slate-50'}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {col.render ? col.render(row[col.key], row) : (
                      col.key === 'status' ? <Badge status={row[col.key]} /> : (row[col.key] ?? '—')
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
