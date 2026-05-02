import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiFilterLine, RiSearchLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

const columns = [
  { key: 'id',         label: '#',              render: (_, r, i) => `#${r.id || i + 1}` },
  { key: 'amount',     label: 'Amount',         render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
  { key: 'purpose',    label: 'Purpose' },
  { key: 'tenure',     label: 'Tenure',         render: (v) => v ? `${v} months` : '—' },
  { key: 'status',     label: 'Status',         render: (v) => (
    <Badge status={['APPROVED', 'REJECTED'].includes(v) ? v : 'PENDING'} />
  )},
  { key: 'createdAt',  label: 'Applied On',     render: (v) => v ? new Date(v).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—' },
]

const MyApplications = () => {
  const { isDark } = useThemeStore()
  const [apps, setApps]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    api.get('/application/my')
      .then(({ data }) => {
        setApps(Array.isArray(data) ? data : data?.applications || [])
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        toast.error('Failed to load applications')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = apps
    .filter((a) => {
      if (filter === 'ALL') return true
      if (filter === 'PENDING') return !['APPROVED', 'REJECTED'].includes(a.status)
      return a.status === filter
    })
    .filter((a) => !search || a.purpose?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="My Applications" subtitle="All your loan applications in one place" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : isDark
                    ? 'bg-white/06 text-slate-400 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <RiSearchLine size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by purpose…"
            className={`pl-8 pr-4 py-2 rounded-xl text-xs outline-none w-52 transition-all ${
              isDark
                ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60'
                : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
      >
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No applications match your filter"
        />
        {!loading && (
          <div className={`px-4 py-3 text-xs border-t ${
            isDark ? 'text-slate-500 border-white/06' : 'text-slate-400 border-slate-100'
          }`}>
            Showing {filtered.length} of {apps.length} applications
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MyApplications
