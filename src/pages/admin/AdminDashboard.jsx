import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiUserLine, RiFileListLine, RiTimeLine,
  RiCheckboxCircleLine, RiCloseCircleLine, RiBarChartLine
} from 'react-icons/ri'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import { CardSkeleton } from '../../components/common/LoadingSkeleton'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6']

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const AdminDashboard = () => {
  const { isDark } = useThemeStore()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/application/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { title: 'Total Users',       value: stats.totalUsers       ?? 0, icon: RiUserLine,            color: 'blue' },
    { title: 'Total Loans',       value: stats.totalApplications ?? 0, icon: RiFileListLine, color: 'purple' },
    { title: 'Pending Approvals', value: stats.pending           ?? 0, icon: RiTimeLine, color: 'amber' },
    { title: 'Approved',          value: stats.approved          ?? 0, icon: RiCheckboxCircleLine, color: 'green' },
  ] : []

  // Build chart data from stats
  const pieData = stats ? [
    { name: 'Approved', value: stats.approved ?? 0 },
    { name: 'Pending',  value: stats.pending  ?? 0 },
    { name: 'Rejected', value: stats.rejected ?? 0 },
  ] : []

  const barData = stats?.monthlyData || []

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = isDark ? '#64748b' : '#94a3b8'

  const tooltipStyle = {
    backgroundColor: isDark ? '#162032' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#e2e8f0' : '#334155',
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics" />

      {loading ? <CardSkeleton count={4} /> : (
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <motion.div key={s.title} variants={item}><StatCard {...s} /></motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`lg:col-span-2 rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Monthly Applications</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Applications vs Approvals</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: textColor, fontSize: 12 }} />
              <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="approved"     name="Approved"     fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Approval Rate</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Distribution by status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{d.name}</span>
                </div>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Doc stats */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Document Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Verified Docs',  value: stats.docVerified ?? 0, color: '#22c55e' },
              { label: 'Pending Review',      value: stats.docPending  ?? 0, color: '#f59e0b' },
            ].map((d) => (
              <div key={d.label} className={`p-4 rounded-xl ${isDark ? 'bg-white/04' : 'bg-slate-50'}`}>
                <p className="text-2xl font-bold font-display" style={{ color: d.color }}>{d.value}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{d.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboard
