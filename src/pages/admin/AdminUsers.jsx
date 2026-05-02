import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RiUserLine, RiMailLine, RiShieldUserLine, RiTimeLine, 
  RiSearchLine, RiCloseLine, RiCalendarLine, RiHashtag 
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const mockUsers = [
  { id: 1, name: 'Tanmoy Debnath', email: 'tanmoy@gmail.com', role: 'USER' },
  { id: 2, name: 'Admin User', email: 'admin@gmail.com', role: 'ADMIN' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'USER' },
  { id: 4, name: 'Sarah Smith', email: 'sarah@example.com', role: 'USER' },
]

const AdminUsers = () => {
  const { isDark } = useThemeStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/auth/admin/users')
      setUsers(Array.isArray(data) ? data : data?.users || [])
    } catch (err) {
      console.error('Fetch users error:', err)
      const status = err.response?.status
      
      if (status === 404) {
        // Fallback to mock data for demonstration
        setUsers(mockUsers)
        toast('Using demo data (API not found)', { icon: 'ℹ️' })
      } else {
        const msg = err.response?.data?.message || 'Failed to load users list'
        toast.error(`${msg} (${status || 'Network Error'})`)
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toString().includes(search)
  )

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (val, row) => (
      <button 
        onClick={() => setSelectedUser(row)}
        className="font-semibold text-blue-500 hover:underline text-left"
      >
        {val || 'N/A'}
      </button>
    )},
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => (
      <Badge status={val || 'USER'} />
    )},
  ]

  return (
    <div>
      <PageHeader title="User Management" subtitle="View and manage platform users" />

      <div className={`mb-6 rounded-2xl p-4 flex items-center gap-4 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <div className="relative flex-1">
          <RiSearchLine className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
              isDark 
                ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60' 
                : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
      />

      {/* User Details Slide-over */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md z-50 shadow-2xl p-8 flex flex-col ${
                isDark ? 'bg-dark-800 border-l border-white/10' : 'bg-white border-l border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>User Details</h2>
                <button onClick={() => setSelectedUser(null)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <RiCloseLine size={24} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  {selectedUser.name?.[0] || 'U'}
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedUser.name}</h3>
                <Badge status={selectedUser.role} className="mt-1" />
              </div>

              <div className="space-y-6 overflow-y-auto pr-2">
                <DetailItem icon={RiHashtag} label="User ID" value={selectedUser.id} isDark={isDark} />
                <DetailItem icon={RiMailLine} label="Email Address" value={selectedUser.email} isDark={isDark} />
                <DetailItem icon={RiShieldUserLine} label="Role Permission" value={selectedUser.role} isDark={isDark} />
                <DetailItem icon={RiCalendarLine} label="Registered On" value="April 2024 (Placeholder)" isDark={isDark} />
              </div>

              <div className="mt-auto pt-6 grid grid-cols-2 gap-4">
                <button className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isDark ? 'bg-white/05 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}>
                  Edit User
                </button>
                <button className="py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                  Deactivate
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const DetailItem = ({ icon: Icon, label, value, isDark }) => (
  <div className="flex items-start gap-4">
    <div className={`p-2 rounded-lg ${isDark ? 'bg-white/05' : 'bg-slate-50'}`}>
      <Icon size={18} className="text-blue-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{value || 'N/A'}</p>
    </div>
  </div>
)

export default AdminUsers
