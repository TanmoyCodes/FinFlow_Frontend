import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  RiShieldCheckLine, RiCloseCircleLine, RiFileLine, RiSearchLine, 
  RiEyeLine, RiCloseLine, RiHashtag, RiMailLine, RiCalendarLine 
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'
import DataTable from '../../components/common/DataTable'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const AdminDocuments = () => {
  const { isDark } = useThemeStore()
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [actionId, setActionId] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const fetchAll = () => {
    setLoading(true)
    api.get('/documents/admin/all')
      .then(({ data }) => setDocs(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (selectedDoc) {
      setPdfLoading(true)
      api.get(`/documents/admin/download/${selectedDoc.userId}`, { responseType: 'blob' })
        .then(response => {
          const url = URL.createObjectURL(response.data)
          setPdfUrl(url)
        })
        .catch(err => {
          console.error("Failed to load PDF", err)
        })
        .finally(() => setPdfLoading(false))
    } else {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }, [selectedDoc])

  const handleAction = async (userId, action) => {
    setActionId(`${userId}-${action}`)
    try {
      const method = action === 'verify' ? 'put' : (action === 'reject' ? 'put' : 'put')
      await api[method](`/documents/admin/${action}/${userId}`)
      toast.success(`Document ${action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'put on hold'} successfully`)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || `Action failed`)
    } finally {
      setActionId(null)
    }
  }

  const filtered = docs.filter((d) =>
    !search || `${d.userId} ${d.userName} ${d.fileName} ${d.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'id',        label: '#',         render: (v, row, i) => `#${i + 1}` },
    { key: 'userName',  label: 'User Name', render: (v, row) => row.userName || row.userId },
    { key: 'email',     label: 'Email',     render: (v, row) => row.userId },
    {
      key: 'fileName',
      label: 'File',
      render: (v) => (
        <div className="flex items-center gap-2">
          <RiFileLine size={14} className="text-blue-400 flex-shrink-0" />
          <span className="truncate max-w-[140px]" title={v}>{v || 'Document'}</span>
        </div>
      )
    },
    { key: 'status',   label: 'Status' },
    { key: 'uploadedAt', label: 'Uploaded', render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => setSelectedDoc(row)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-500 border border-blue-500/25 hover:bg-blue-500/25 transition-all"
        >
          <RiEyeLine size={14} />
          Review Document
        </button>
      )
    },
  ]

  return (
    <div>
      <PageHeader title="Document Verification" subtitle="Review and verify user submitted documents" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {docs.length} total documents
          </span>
        </div>
        <div className="relative">
          <RiSearchLine size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user, file…"
            className={`pl-8 pr-4 py-2 rounded-xl text-xs outline-none w-52 transition-all ${
              isDark
                ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60'
                : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
            }`}
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No documents found" />
        {!loading && (
          <div className={`px-4 py-3 text-xs border-t ${isDark ? 'text-slate-500 border-white/06' : 'text-slate-400 border-slate-100'}`}>
            Showing {filtered.length} of {docs.length} documents
          </div>
        )}
      </motion.div>

      {/* Document Review Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 md:p-8"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden ${
                isDark ? 'bg-dark-800 border border-white/10' : 'bg-white border border-slate-200'
              }`}
            >
              {/* Sidebar Details */}
              <div className={`w-full md:w-80 p-6 flex flex-col border-b md:border-b-0 md:border-r ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Review Document</h2>
                  <button onClick={() => setSelectedDoc(null)} className={`md:hidden p-1.5 rounded-lg ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                    <RiCloseLine size={20} />
                  </button>
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto pr-2">
                  <DetailItem icon={RiHashtag} label="User Name" value={selectedDoc.userName || selectedDoc.userId} isDark={isDark} />
                  <DetailItem icon={RiMailLine} label="Email Address" value={selectedDoc.userId} isDark={isDark} />
                  <DetailItem icon={RiFileLine} label="File Name" value={selectedDoc.fileName} isDark={isDark} />
                  <DetailItem icon={RiCalendarLine} label="Uploaded" value={selectedDoc.uploadedAt ? new Date(selectedDoc.uploadedAt).toLocaleDateString('en-IN') : '—'} isDark={isDark} />
                  <div className="pt-2">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Current Status</p>
                    <Badge status={selectedDoc.status} />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-4 space-y-3">
                  <button
                    onClick={() => { handleAction(selectedDoc.userId, 'verify'); setSelectedDoc(null) }}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-green-500/15 text-green-500 border border-green-500/25 hover:bg-green-500/25 transition-all"
                  >
                    <RiShieldCheckLine size={16} /> Approve Document
                  </button>
                  <button
                    onClick={() => { handleAction(selectedDoc.userId, 'reject'); setSelectedDoc(null) }}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-500 border border-red-500/25 hover:bg-red-500/25 transition-all"
                  >
                    <RiCloseCircleLine size={16} /> Reject Document
                  </button>
                  <button
                    onClick={() => { handleAction(selectedDoc.userId, 'hold'); setSelectedDoc(null) }}
                    className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-yellow-500/15 text-yellow-500 border border-yellow-500/25 hover:bg-yellow-500/25 transition-all"
                  >
                     Put on Hold
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className={`flex-1 flex flex-col relative ${isDark ? 'bg-dark-900' : 'bg-slate-50'}`}>
                <div className="absolute top-4 right-4 z-10 hidden md:block">
                   <button onClick={() => setSelectedDoc(null)} className={`p-2 rounded-lg bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all shadow-lg`}>
                    <RiCloseLine size={24} />
                  </button>
                </div>
                <div className="flex-1 w-full h-full p-0 md:p-4">
                   {pdfLoading ? (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                       <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                       <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading document preview...</p>
                     </div>
                   ) : pdfUrl ? (
                     <iframe src={pdfUrl} className="w-full h-full rounded-xl shadow-inner bg-white border-0" title="Document Preview" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <div className={`p-6 rounded-2xl border flex flex-col items-center text-center ${isDark ? 'border-white/10 bg-white/05' : 'border-slate-200 bg-white shadow-sm'}`}>
                          <RiFileLine size={48} className={`mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                          <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Preview Not Available</p>
                          <p className={`text-sm max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>The document could not be loaded for preview. It may not exist or the preview endpoint is unavailable.</p>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const DetailItem = ({ icon: Icon, label, value, isDark }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg mt-0.5 ${isDark ? 'bg-white/05' : 'bg-slate-50'}`}>
      <Icon size={16} className="text-blue-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{value || '—'}</p>
    </div>
  </div>
)

export default AdminDocuments
