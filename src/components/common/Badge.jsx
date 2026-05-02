import useThemeStore from '../../store/themeStore'

const Badge = ({ status, className = '' }) => {
  const { isDark } = useThemeStore()
  const s = status?.toUpperCase()

  const map = {
    PENDING:     { cls: 'badge-pending',  label: 'Pending' },
    APPROVED:    { cls: 'badge-approved', label: 'Approved' },
    REJECTED:    { cls: 'badge-rejected', label: 'Rejected' },
    UNDER_REVIEW:{ cls: 'badge-review',   label: 'Under Review' },
    VERIFIED:    { cls: 'badge-approved', label: 'Verified' },
    UPLOADED:    { cls: 'badge-review',   label: 'Uploaded' },
    ADMIN:       { cls: 'bg-purple-500/10 text-purple-500 border border-purple-500/20', label: 'Admin' },
    USER:        { cls: 'bg-blue-500/10 text-blue-500 border border-blue-500/20', label: 'User' },
  }

  const config = map[s] || { cls: 'badge-pending', label: status || 'Unknown' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.cls} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}

export default Badge
