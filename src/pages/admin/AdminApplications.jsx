import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiCheckLine, RiCloseLine, RiSearchLine, RiFilterLine, RiEyeLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

const AdminApplications = () => {
  const { isDark } = useThemeStore()
  const [apps, setApps]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')
  const [actionId, setActionId] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    // Fetch all users once to avoid individual lookup issues
    api.get('/auth/admin/users')
      .then(({ data }) => setAllUsers(data))
      .catch(err => console.error("Failed to fetch users list:", err))
  }, [])

  useEffect(() => {
    if (selectedApp && allUsers.length > 0) {
      const profile = allUsers.find(u => u.email === selectedApp.email)
      setUserProfile(profile)
    } else {
      setUserProfile(null)
    }
  }, [selectedApp, allUsers])

  const fetchAll = () => {
    setLoading(true)
    api.get('/application/admin/all')
      .then(({ data }) => setApps(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const handleAction = async (id, action) => {
    setActionId(`${id}-${action}`)
    try {
      await api.post(`/application/admin/${id}/${action}`)
      toast.success(`Application ${action}d successfully`)
      fetchAll()
      if (selectedApp?.id === id) {
        setSelectedApp(null)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} application`)
    } finally {
      setActionId(null)
    }
  }

  const filtered = apps
    .filter((a) => filter === 'ALL' || a.status === filter)
    .filter((a) => !search || `${a.fullName} ${a.email} ${a.purpose}`.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'id',       label: '#',       render: (v) => `#${v}` },
    { key: 'fullName', label: 'Applicant' },
    { key: 'email',    label: 'Email' },
    { key: 'amount',   label: 'Amount',  render: (v) => `₹${Number(v||0).toLocaleString('en-IN')}` },
    { key: 'purpose',  label: 'Purpose' },
    { key: 'tenure',   label: 'Tenure',  render: (v) => v ? `${v}mo` : '—' },
    { key: 'status',   label: 'Status',  render: (v) => <Badge status={v === 'DOCS_VERIFIED' ? 'PENDING' : v} /> },
    { key: 'createdAt',label: 'Date',    render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
    { key: 'actions',  label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setSelectedApp(row)}
          className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
          title="View Details"
        >
          <RiEyeLine size={18} />
        </button>
        
        {row.status !== 'APPROVED' && row.status !== 'REJECTED' && (
          <>
            <button 
              onClick={() => handleAction(row.id, 'approve')}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-green-500/20 text-green-400' : 'hover:bg-green-50 text-green-600'}`}
              title="Approve"
            >
              <RiCheckLine size={18} />
            </button>
            <button 
              onClick={() => handleAction(row.id, 'reject')}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              title="Reject"
            >
              <RiCloseLine size={18} />
            </button>
          </>
        )}
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="All Applications" subtitle="Review and manage loan applications" />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : isDark ? 'bg-white/06 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}>
            {s}
          </button>
        ))}
        <div className="relative ml-auto">
          <RiSearchLine size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant, purpose…"
            className={`pl-8 pr-4 py-2 rounded-xl text-xs outline-none w-56 transition-all ${
              isDark
                ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60'
                : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
            }`}
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No applications found" />
        {!loading && (
          <div className={`px-4 py-3 text-xs border-t ${isDark ? 'text-slate-500 border-white/06' : 'text-slate-400 border-slate-100'}`}>
            Showing {filtered.length} of {apps.length} applications
          </div>
        )}
      </motion.div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 ${
              isDark ? 'bg-slate-900 border border-white/10 shadow-2xl' : 'bg-white shadow-xl'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Application #{selectedApp.id}
              </h3>
              <button onClick={() => setSelectedApp(null)} className="p-2 rounded-full hover:bg-slate-500/10 transition-colors">
                <RiCloseLine size={24} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Applicant Details</p>
                <div className={`p-4 rounded-xl space-y-2 ${isDark ? 'bg-white/05' : 'bg-slate-50'}`}>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Name:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedApp.fullName}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Email:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedApp.email || '—'}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Phone:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{userProfile?.contactNumber || selectedApp.contactNumber || '—'}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">DOB:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{userProfile?.dateOfBirth || selectedApp.dateOfBirth || '—'}</span></p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Loan Request</p>
                <div className={`p-4 rounded-xl space-y-2 ${isDark ? 'bg-white/05' : 'bg-slate-50'}`}>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Amount:</span> <span className={`text-sm font-bold text-blue-500`}>₹{Number(selectedApp.amount || 0).toLocaleString('en-IN')}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Purpose:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedApp.purpose || '—'}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Tenure:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedApp.tenure ? `${selectedApp.tenure} months` : '—'}</span></p>
                  <p><span className="text-xs text-slate-400 w-24 inline-block">Status:</span> <Badge status={selectedApp.status === 'DOCS_VERIFIED' ? 'PENDING' : selectedApp.status} /></p>
                </div>
              </div>

              <div className="col-span-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employment Info</p>
                <div className={`p-4 rounded-xl grid grid-cols-2 gap-4 ${isDark ? 'bg-white/05' : 'bg-slate-50'}`}>
                  <p><span className="text-xs text-slate-400 block mb-0.5">Occupation:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{userProfile?.occupation || selectedApp.occupation || '—'}</span></p>
                  <p><span className="text-xs text-slate-400 block mb-0.5">Employer:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{userProfile?.employerName || selectedApp.employerName || '—'}</span></p>
                  <p><span className="text-xs text-slate-400 block mb-0.5">Income:</span> <span className={`text-sm font-medium text-green-500`}>{(userProfile?.income || selectedApp.income) ? `₹${Number(userProfile?.income || selectedApp.income).toLocaleString('en-IN')}` : '—'}</span></p>
                  <p><span className="text-xs text-slate-400 block mb-0.5">Experience:</span> <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{userProfile?.workExperience || selectedApp.workExperience ? `${userProfile?.workExperience || selectedApp.workExperience} years` : '—'}</span></p>
                </div>
              </div>
            </div>

            {(selectedApp.status === 'PENDING' || selectedApp.status === 'DOCS_VERIFIED') && (
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                <Button 
                  onClick={() => handleAction(selectedApp.id, 'approve')}
                  disabled={actionId === `${selectedApp.id}-approve`}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  icon={RiCheckLine}
                >
                  Approve Application
                </Button>
                <Button 
                  onClick={() => handleAction(selectedApp.id, 'reject')}
                  disabled={actionId === `${selectedApp.id}-reject`}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  icon={RiCloseLine}
                >
                  Reject Application
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminApplications
