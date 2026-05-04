import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiUploadCloud2Line, RiFileLine, RiCheckLine, RiCloseLine, RiTimeLine, RiShieldCheckLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['UPLOADED', 'UNDER_REVIEW', 'APPROVED']

const TimelineStep = ({ label, done, active, isDark }) => (
  <div className="flex items-center gap-3 flex-1">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${done
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
  const [data, setData] = useState(null)
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


      <div className="max-w-7xl mx-auto">
        <PageHeader title="KYC Status" subtitle="Track your document verification status" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Empty State */}
            {!data && !loading && userId && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`rounded-2xl p-10 text-center ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
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

            {/* Result Card */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/25">
                    <RiFileLine size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Document Verification</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Account: {data.userId || userId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                  {/* Timeline */}
                  <div className="flex-1 space-y-0 relative">
                    {['Document Uploaded', 'Under Review', 'Verification Complete'].map((label, i) => {
                      const step = getStepIndex(data.status)
                      const isDone = i < step || (i === 2 && step === 2)
                      const isActive = i === step

                      return (
                        <div key={i} className="flex gap-5">
                          <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2 ${isDone
                                ? 'bg-green-500 border-green-500'
                                : isActive
                                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/40'
                                  : isDark ? 'bg-dark-600 border-white/10' : 'bg-slate-100 border-slate-200'
                              }`}>
                              {isDone ? <RiCheckLine size={16} className="text-white" /> :
                                isActive ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" /> :
                                  <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />}
                            </div>
                            {i < 2 && (
                              <div className={`w-0.5 h-6 my-1 rounded-full transition-colors duration-500 ${i < step ? 'bg-green-500' : isDark ? 'bg-white/10' : 'bg-slate-200'
                                }`} />
                            )}
                          </div>
                          <div className="pt-1.5 pb-4">
                            <p className={`text-sm font-semibold ${i <= step ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')
                              }`}>{label}</p>
                            <p className={`text-[11px] mt-0.5 leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {i === 0 && 'Files received successfully.'}
                              {i === 1 && (isActive ? 'Review in progress.' : isDone ? 'Review completed.' : 'Pending review.')}
                              {i === 2 && (isDone ? 'KYC Verified.' : 'Final approval.')}
                            </p>
                            {isActive && data.updatedAt && (
                              <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-white/05 text-slate-500' : 'bg-slate-100 text-slate-500'
                                }`}>
                                <RiTimeLine size={11} />
                                {new Date(data.updatedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Right side illustration/badge */}
                  <div className="hidden md:flex flex-1 flex-col items-center justify-center border-l border-inherit pl-10 border-dashed">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-32 h-32 rounded-full border-2 border-dashed border-blue-500/20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl ${
                          getStepIndex(data.status) === 2 ? 'bg-green-500 shadow-green-500/20' : 'bg-blue-600 shadow-blue-600/20'
                        }`}>
                          {getStepIndex(data.status) === 2 ? (
                            <>
                              <RiShieldCheckLine size={32} className="text-white mb-1" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Verified</span>
                            </>
                          ) : (
                            <>
                              <RiTimeLine size={32} className="text-white mb-1 animate-pulse" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Processing</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-6">
                      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Trust Score</p>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className={`h-1 w-6 rounded-full ${
                            s <= (getStepIndex(data.status) + 1) * 1.6 ? 'bg-blue-500' : isDark ? 'bg-white/10' : 'bg-slate-100'
                          }`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {getStepIndex(data.status) === 2 ? 'Maximum security level reached.' : 'Increasing trust as you verify.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rejected state */}
                {data.status === 'REJECTED' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <RiCloseLine size={20} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-red-400">Verification Rejected</p>
                      <p className="text-sm text-red-400/80 mt-1">
                        {data.reason || 'There was an issue with your documents. Please re-upload clear copies.'}
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-4 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => window.location.href = '/upload-documents'}
                      >
                        Re-upload Documents
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column: Support & Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl p-6 border-2 ${isDark ? 'bg-blue-500/08 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}
            >
              <h4 className={`font-bold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Why KYC is needed?</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Identity verification is a mandatory regulatory requirement to prevent fraud and ensure the security of your financial transactions.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Fast Review', desc: 'Usually takes 24-48 hours' },
                  { label: 'Secure Data', desc: 'Encrypted storage' },
                  { label: 'Loan Eligibility', desc: 'Unlocks all loan products' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</p>
                      <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 border-2 flex flex-col items-center text-center ${isDark ? 'bg-white/02 border-white/05' : 'bg-slate-50 border-slate-200'
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <RiShieldCheckLine size={24} className="text-green-500" />
              </div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Data is Encrypted</p>
              <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Your information is protected by industry-standard 256-bit encryption protocols.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusTracking
