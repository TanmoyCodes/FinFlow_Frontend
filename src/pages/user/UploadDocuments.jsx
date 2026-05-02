import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { RiUploadCloud2Line, RiFileLine, RiCheckLine, RiCloseLine, RiInformationLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'

const UploadDocuments = () => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const [file, setFile]         = useState(null)
  const userId = user?.email || ''
  const [progress, setProgress] = useState(0)
  const [status, setStatus]     = useState('idle') // idle | uploading | success | error
  const [error, setError]       = useState('')

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setStatus('idle'); setProgress(0) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file')
    if (!userId.trim()) return toast.error('User ID / email is required')
    setStatus('uploading')
    setProgress(0)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    if (user?.name) {
      formData.append('userName', user.name)
    }

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      setStatus('success')
      toast.success('Document uploaded successfully!')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
      toast.error('Upload failed')
    }
  }

  const reset = () => { setFile(null); setStatus('idle'); setProgress(0); setError('') }

  return (
    <div>
      <PageHeader title="Upload Documents" subtitle="Submit your supporting documents for verification" />

      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
        >
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 mb-5 ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : file
                  ? 'border-green-500/50 bg-green-500/05'
                  : isDark
                    ? 'border-white/15 hover:border-blue-500/50 hover:bg-blue-500/05'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-14 h-14 rounded-xl bg-green-500/15 flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                    <RiFileLine size={28} className="text-green-400" />
                  </div>
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{file.name}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                    <RiUploadCloud2Line size={28} className="text-blue-400" />
                  </div>
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {isDragActive ? 'Drop it here!' : 'Drag & drop or click to browse'}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    PDF, JPG, PNG up to 10MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Progress bar */}
          <AnimatePresence>
            {status === 'uploading' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Uploading…</span>
                  <span className="text-blue-400 font-medium">{progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#2563eb,#7c3aed)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <RiCheckLine size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">Uploaded Successfully</p>
                  <p className="text-xs text-green-400/70 mt-0.5">Your document is under review</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3">
                <RiCloseLine size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            {status === 'success' ? (
              <Button className="flex-1" variant="secondary" onClick={reset}>Upload Another</Button>
            ) : (
              <>
                <Button
                  className="flex-1"
                  loading={status === 'uploading'}
                  onClick={handleUpload}
                  icon={RiUploadCloud2Line}
                  disabled={!file || status === 'uploading'}
                >
                  Upload Document
                </Button>
                {file && <Button variant="secondary" onClick={reset} icon={RiCloseLine} />}
              </>
            )}
          </div>
        </motion.div>

        {/* Warning card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`mt-4 rounded-xl p-4 border flex items-start gap-3 ${
            isDark ? 'bg-amber-500/08 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <RiInformationLine size={16} className="text-amber-500" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Important Note</p>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Uploading a new document will <strong>replace your existing one</strong>. Any previously verified status will be reset, and your new document will require a fresh round of Admin verification.
            </p>
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`mt-4 rounded-xl p-4 ${isDark ? 'bg-blue-500/08 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}
        >
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Accepted Documents</p>
          <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {['Aadhar Card / Passport / Driver\'s License','PAN Card','Bank Statements (last 3 months)','Salary Slips','Income Tax Returns'].map((d) => (
              <li key={d} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default UploadDocuments
