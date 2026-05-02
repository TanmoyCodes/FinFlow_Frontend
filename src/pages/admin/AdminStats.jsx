import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import { CardSkeleton } from '../../components/common/LoadingSkeleton'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6']

const AdminStats = () => {
  const { isDark } = useThemeStore()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/application/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load statistics'))
      .finally(() => setLoading(false))
  }, [])

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = isDark ? '#64748b' : '#94a3b8'
  const tooltipStyle = {
    backgroundColor: isDark ? '#162032' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#e2e8f0' : '#334155',
    fontSize: '12px',
  }

  const monthlyData = stats?.monthlyData || []

  const pieData = stats ? [
    { name: 'Approved', value: stats.approvedCount ?? stats.approvedApplications ?? stats.approved ?? 0 },
    { name: 'Pending',  value: stats.pendingCount  ?? stats.pendingApplications  ?? stats.pending  ?? 0 },
    { name: 'Rejected', value: stats.rejectedCount ?? stats.rejectedApplications ?? stats.rejected ?? 0 },
  ] : []

  const loanPurposeData = stats?.loanByPurpose || []

  return (
    <div>
      <PageHeader title="Analytics & Stats" subtitle="Detailed platform performance metrics" />

      {loading ? <CardSkeleton count={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {[
            { label: 'Total Applications', value: stats?.totalApplications ?? 0, color: '#3b82f6' },
            { label: 'Approval Rate',      value: `${(stats?.approvalRate ?? 0).toFixed(2)}%`, color: '#22c55e' },
            { label: 'Avg Loan Amount',    value: `₹${(stats?.avgLoanAmount || 0).toLocaleString('en-IN')}`, color: '#8b5cf6' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</p>
              <p className="text-3xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Application Trend</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Monthly application volume</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: textColor, fontSize: 12 }} />
              <Area type="monotone" dataKey="applications" name="Applications" stroke="#3b82f6" fill="url(#colorApps)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="approved"     name="Approved"     stroke="#22c55e" fill="url(#colorApproved)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Loan purpose bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Loan by Purpose</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Distribution by loan type</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={loanPurposeData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Applications" radius={[0, 6, 6, 0]}>
                {loanPurposeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Status donut */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Status Distribution</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 flex-1">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-32 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/08' : 'bg-slate-100'}`}>
                    <div className="h-full rounded-full" style={{
                      background: COLORS[i],
                      width: `${pieData.reduce((a,b)=>a+b.value,0) ? (d.value / pieData.reduce((a,b)=>a+b.value,0)) * 100 : 0}%`
                    }} />
                  </div>
                  <span className={`text-sm font-medium w-6 text-right ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminStats
