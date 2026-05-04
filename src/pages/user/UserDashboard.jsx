import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiFileListLine, RiCheckboxCircleLine, RiTimeLine,
  RiCloseCircleLine, RiArrowRightLine, RiFileAddLine
} from 'react-icons/ri'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { CardSkeleton } from '../../components/common/LoadingSkeleton'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const UserDashboard = () => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [docStatus, setDocStatus] = useState(null)

  useEffect(() => {
    const userId = user?.email || ''
    // Fetch applications
    api.get('/application/my')
      .then(({ data }) => setApps(Array.isArray(data) ? data : data?.applications || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))

    // Fetch doc status
    if (userId) {
      api.get(`/documents/status/${userId}`)
        .then(({ data }) => setDocStatus(data.status))
        .catch(() => setDocStatus('NOT_UPLOADED'))
    }
  }, [user?.email])

  const total    = apps.length
  const approved = apps.filter((a) => a.status === 'APPROVED').length
  const rejected = apps.filter((a) => a.status === 'REJECTED').length
  const pending  = total - approved - rejected
  const recent   = apps.slice(0, 5)

  const stats = [
    { title: 'Total Applications', value: total,    icon: RiFileListLine,       color: 'blue' },
    { title: 'Approved',           value: approved, icon: RiCheckboxCircleLine, color: 'green' },
    { title: 'Pending',            value: pending,  icon: RiTimeLine,           color: 'amber' },
    { title: 'Rejected',           value: rejected, icon: RiCloseCircleLine,    color: 'red' },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good Morning'
    if (hour >= 12 && hour < 17) return 'Good Afternoon'
    if (hour >= 17 && hour < 22) return 'Good Evening'
    return 'Good Night'
  }

  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${firstName}! 👋`}
        subtitle="Track your loan applications at a glance"
        action={
          <Button icon={RiFileAddLine} onClick={() => navigate('/apply-loan')}>
            Apply for Loan
          </Button>
        }
      />
      
      {/* Document Alert */}
      {!loading && docStatus === 'NOT_UPLOADED' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <RiFileAddLine size={20} className="text-amber-500" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Documents Required</p>
              <p className={`text-xs ${isDark ? 'text-amber-600/70' : 'text-amber-600'}`}>In order to apply for a new loan, you must first upload your documents for verification.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/upload-documents')}>Upload Now</Button>
        </motion.div>
      )}

      {/* Stats */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((s) => (
            <motion.div key={s.title} variants={item}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className={`rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/06">
          <div>
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Applications</h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your latest loan requests</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-applications')}
            icon={RiArrowRightLine}>
            View All
          </Button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className={`h-16 rounded-xl skeleton ${isDark ? 'bg-white/05' : 'bg-slate-100'}`} />
              ))}
            </div>
          ) : !recent.length ? (
            <div className="text-center py-12">
              <RiFileListLine size={48} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No applications yet</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Start by applying for a loan</p>
              <Button className="mt-4" onClick={() => navigate('/apply-loan')} icon={RiFileAddLine}>
                Apply Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((app, i) => (
                <motion.div
                  key={app.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                    isDark ? 'bg-white/04 hover:bg-white/07' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                      <RiFileListLine size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        ₹{Number(app.amount || app.loanAmount || 0).toLocaleString('en-IN')}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {app.purpose || 'Personal Loan'} · {app.tenure || '—'} months
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                    </p>
                    <Badge status={['APPROVED', 'REJECTED'].includes(app.status) ? app.status : 'PENDING'} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default UserDashboard
