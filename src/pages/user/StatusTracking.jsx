import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiUploadCloud2Line, RiFileLine, RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['UPLOADED', 'UNDER_REVIEW', 'APPROVED']

const TimelineStep = ({ label, done, active, isDark }) => (
  <div className="flex items-center gap-3 flex-1">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
      done
        ? 'bg-green-500 border-green-500'
        : active
          ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/40'
          : isDark ? 'bg-dark-700 border-white/15' : 'bg-slate-100 border-slate-200'
    }`}>
      {done ? <RiCheckLine size={18} className="text-white" /> :
        active ? <div className="w-3 h-3 bg-white rounded-full animate-pulse" /> :
        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />}
    </div>
    <div>
      <p className={`text-sm font-medium ${done || active ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
        {label}
      </p>
    </div>
  </div>
)

const StatusTracking = () => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const userId = user?.email || ''
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStatus = async (id = userId) => {
    if (!id?.trim()) return
    setLoading(true)
    try {
      const { data: res } = await api.get(`/documents/status/${id}`)
      setData(res)
    } catch (err) {
      // Only toast if it's not a 404 (meaning no document yet)
      if (err.response?.status !== 404) {
        toast.error(err.response?.data?.message || 'Failed to fetch status')
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) fetchStatus(user.email)
  }, [user?.email])

  const getStepIndex = (status) => {
    if (status === 'APPROVED' || status === 'VERIFIED' || status === 'DOCS_VERIFIED') return 2
    if (status === 'UNDER_REVIEW' || status === 'PENDING') return 1
    return 0
  }

  return (
    <div>
      <PageHeader title="Status Tracking" subtitle="Track your document verification status" />

      <div className="max-w-2xl space-y-5">

        {/* Empty State */}
        {!data && !loading && userId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`rounded-2xl p-8 text-center ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
          >
            <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto mb-4">
              <RiUploadCloud2Line size={32} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
            </div>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Documents Found</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              We couldn't find any uploaded documents for <strong>{userId}</strong>.
            </p>
            <Button className="mt-6" onClick={() => window.location.href = '/upload-documents'}>
              Upload Now
            </Button>
          </motion.div>
        )}

        {/* Result */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/25">
                <RiFileLine size={20} className="text-blue-400" />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Document Status</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  User: {data.userId || userId}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {['Document Uploaded', 'Under Review', 'Verification Complete'].map((label, i) => {
                const step = getStepIndex(data.status)
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        i < step || (i === 2 && step === 2) ? 'bg-green-500' : i === step ? 'bg-blue-600 shadow-lg shadow-blue-600/40' : isDark ? 'bg-dark-600' : 'bg-slate-100'
                      }`}>
                        {i < step || (i === 2 && step === 2) ? <RiCheckLine size={14} className="text-white" /> :
                          i === step ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" /> :
                          <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />}
                      </div>
                      {i < 2 && (
                        <div className={`w-0.5 h-8 mt-1 rounded ${
                          i < step ? 'bg-green-500' : isDark ? 'bg-white/10' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${
                        i <= step ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')
                      }`}>{label}</p>
                      {i === step && data.updatedAt && (
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(data.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Rejected state */}
            {(data.status === 'REJECTED') && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3">
                <RiCloseLine size={18} className="text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-400">Document Rejected</p>
                  {data.reason && <p className="text-xs text-red-400/70 mt-0.5">Reason: {data.reason}</p>}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default StatusTracking
