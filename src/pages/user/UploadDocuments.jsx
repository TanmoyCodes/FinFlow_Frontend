import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RiUploadCloud2Line, RiFileLine, RiCheckLine, 
  RiCloseLine, RiInformationLine, RiCheckboxCircleLine,
  RiAlertLine, RiShieldCheckLine, RiLockPasswordLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
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
  const [serverStatus, setServerStatus] = useState('NOT_UPLOADED') // NOT_UPLOADED | PENDING | VERIFIED | REJECTED
  const [error, setError]       = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (userId) {
      api.get(`/documents/status/${userId}`)
        .then(({ data }) => setServerStatus(data.status))
        .catch(() => setServerStatus('NOT_UPLOADED'))
    }
  }, [userId])

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { 
      setFile(accepted[0])
      setStatus('idle')
      setProgress(0)
      if (serverStatus === 'VERIFIED') {
        setShowConfirm(true)
      }
    }
  }, [serverStatus])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file')
    setStatus('uploading')
    setProgress(0)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    if (user?.name) formData.append('userName', user.name)

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      setStatus('success')
      setServerStatus('PENDING')
      setShowConfirm(false)
      toast.success('Document uploaded successfully!')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
      toast.error('Upload failed')
    }
  }

  const reset = () => { 
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setError('')
    setShowConfirm(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Upload Documents" subtitle="Submit your supporting documents for verification" />

      <div className="space-y-6">
        {/* Verification Status Banner */}
        {serverStatus === 'VERIFIED' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl border-2 flex items-center justify-between gap-4 ${
              isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <RiCheckboxCircleLine size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Documents Verified</h3>
                <p className={`text-sm ${isDark ? 'text-green-600/70' : 'text-green-600'}`}>Your identity verification is complete. You are eligible for all loan products.</p>
              </div>
            </div>
            <Badge status="VERIFIED" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}
            >
              {/* Re-upload Confirmation Warning */}
              <AnimatePresence>
                {showConfirm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`mb-5 p-4 rounded-xl border flex items-start gap-3 overflow-hidden ${
                      isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <RiAlertLine size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>Confirm Re-upload</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-red-600/80' : 'text-red-600'}`}>
                        Your documents are already <strong>VERIFIED</strong>. Re-uploading will void your current status and require a new review. Do you really want to proceed?
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${
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
                      <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                        <RiFileLine size={32} className="text-green-400" />
                      </div>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{file.name}</p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {(file.size / 1024).toFixed(1)} KB · Click to change
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <RiUploadCloud2Line size={32} className="text-blue-400" />
                      </div>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {isDragActive ? 'Drop it here!' : 'Click or Drag document to upload'}
                      </p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Support for single PDF or Image (up to 10MB)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* Progress bar / Status messages */}
              <AnimatePresence>
                {status === 'uploading' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Uploading your file…</span>
                      <span className="text-blue-400 font-bold">{progress}%</span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
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
                    className="mb-6 p-5 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-green-400 text-base">Upload Complete!</p>
                      <p className="text-sm text-green-400/70">Our team will verify your document shortly.</p>
                    </div>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center gap-4">
                    <RiCloseLine size={24} className="text-red-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4">
                {status === 'success' ? (
                  <Button className="flex-1 h-12 text-base font-bold" variant="secondary" onClick={reset}>Upload Another</Button>
                ) : (
                  <>
                    <Button
                      className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary-500/20"
                      loading={status === 'uploading'}
                      onClick={handleUpload}
                      icon={RiUploadCloud2Line}
                      disabled={!file || status === 'uploading'}
                    >
                      {showConfirm ? 'Confirm & Replace' : 'Upload Document'}
                    </Button>
                    {file && <Button variant="secondary" className="h-12 w-12" onClick={reset} icon={RiCloseLine} />}
                  </>
                )}
              </div>
            </motion.div>

            {/* Security Assurance - Minimal line style */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-2 py-1"
            >
              <div className="flex -space-x-1.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-sm">
                  <RiShieldCheckLine className="text-white" size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white shadow-sm">
                  <RiLockPasswordLine className="text-white" size={14} />
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <strong>Secure & Encrypted:</strong> Your data is protected by AES-256 encryption and is only accessible to authorized officers.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Info & Warnings */}
          <div className="space-y-6">
            {/* Warning card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 border-2 flex flex-col items-start gap-4 ${
                isDark ? 'bg-amber-500/08 border-amber-500/20' : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="p-2 rounded-xl bg-amber-500/10">
                <RiInformationLine size={24} className="text-amber-500" />
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Single Document</p>
                <p className={`text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Please upload <strong>only one document</strong> containing all necessary information. Multiple files must be merged into a single PDF.
                </p>
              </div>
            </motion.div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className={`rounded-2xl p-6 ${isDark ? 'bg-blue-500/08 border-2 border-blue-500/20' : 'bg-blue-50 border-2 border-blue-200'}`}
            >
              <p className={`text-sm font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>What to include?</p>
              <ul className={`text-[13px] space-y-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {[
                  'Government Issued ID (Aadhar/Passport)',
                  'Current Address Proof',
                  'Recent Income Documents',
                  'Ensure high legibility'
                ].map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine size={12} className="text-blue-500" />
                    </div>
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadDocuments
