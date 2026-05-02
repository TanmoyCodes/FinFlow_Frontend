import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCheckLine, RiArrowRightLine, RiArrowLeftLine, RiCloseLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import useThemeStore from '../../store/themeStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'

const STEPS = [
  { label: 'Personal Info',  fields: ['fullName','dateOfBirth','gender','contactNumber','email'] },
  { label: 'Verification',   fields: [] },
  { label: 'Address',        fields: ['currentAddress','permanentAddress'] },
  { label: 'Employment',     fields: ['occupation','employerName','income','workExperience'] },
  { label: 'Loan Details',   fields: ['amount','purpose','tenure'] },
]

const FIELD_CONFIG = {
  fullName:         { label: 'Full Name',           type: 'text',   placeholder: 'John Doe' },
  dateOfBirth:      { label: 'Date of Birth',        type: 'date',   placeholder: '' },
  gender:           { label: 'Gender',               type: 'select', options: ['Male','Female','Other'] },
  contactNumber:    { label: 'Contact Number',       type: 'tel',    placeholder: '9876543210' },
  email:            { label: 'Email Address',        type: 'email',  placeholder: 'you@example.com' },
  currentAddress:   { label: 'Current Address',      type: 'textarea', placeholder: 'Street, City, State, ZIP' },
  permanentAddress: { label: 'Permanent Address',    type: 'textarea', placeholder: 'Street, City, State, ZIP' },
  occupation:       { label: 'Occupation',           type: 'text',   placeholder: 'Software Engineer' },
  employerName:     { label: 'Employer Name',        type: 'text',   placeholder: 'Company Ltd.' },
  income:           { label: 'Monthly Income (₹)',   type: 'number', placeholder: '50000' },
  workExperience:   { label: 'Work Experience (yrs)',type: 'number', placeholder: '3' },
  amount:           { label: 'Loan Amount (₹)',      type: 'number', placeholder: '500000' },
  purpose:          { label: 'Loan Purpose',         type: 'select', options: ['Home Loan','Car Loan','Education Loan','Personal Loan','Business Loan','Medical Loan'] },
  tenure:           { label: 'Tenure (months)',      type: 'number', placeholder: '36' },
}

const Success = ({ onAnother }) => {
  const { isDark } = useThemeStore()
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center mb-6 border border-green-500/30"
      >
        <RiCheckLine size={48} className="text-green-400" />
      </motion.div>
      <h2 className={`text-2xl font-bold font-display mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Application Submitted!
      </h2>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Your loan application has been received. We'll review it shortly.
      </p>
      <div className="flex gap-3 mt-8">
        <Button variant="secondary" onClick={() => window.location.href = '/my-applications'}>
          View Applications
        </Button>
        <Button onClick={onAnother}>Apply Again</Button>
      </div>
    </motion.div>
  )
}

const ApplyLoan = () => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    contactNumber: user?.contactNumber || '',
    currentAddress: user?.currentAddress || '',
    permanentAddress: user?.permanentAddress || '',
    occupation: user?.occupation || '',
    employerName: user?.employerName || '',
    income: user?.income || '',
    workExperience: user?.workExperience || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [docStatus, setDocStatus] = useState(null)
  const [checkingDocs, setCheckingDocs] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    // Fetch full profile to pre-fill form
    api.get('/auth/me')
      .then(({ data }) => {
        setForm(p => ({
          ...p,
          fullName: data.name || '',
          email: data.email || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          contactNumber: data.contactNumber || '',
          currentAddress: data.currentAddress || '',
          permanentAddress: data.permanentAddress || '',
          occupation: data.occupation || '',
          employerName: data.employerName || '',
          income: data.income || '',
          workExperience: data.workExperience || '',
        }))
      })
      .catch(err => console.error("Failed to pre-fill profile:", err))
  }, [])

  const checkDocs = async () => {
    setCheckingDocs(true)
    try {
      const { data: res } = await api.get(`/documents/status/${user.email}`)
      setDocStatus(res)
    } catch (err) {
      setDocStatus({ status: 'NOT_FOUND' })
    } finally {
      setCheckingDocs(false)
    }
  }

  const validateStep = () => {
    const e = {}
    STEPS[step].fields.forEach((f) => {
      if (!form[f]?.toString().trim()) e[f] = 'This field is required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => {
    if (!validateStep()) return
    if (step === 0) {
      setStep(1)
      checkDocs()
      return
    }
    if (step === 1) {
      if (docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED') {
        setStep(2)
      } else {
        toast.error('Please verify your documents to continue')
      }
      return
    }
    setStep((s) => s + 1)
  }
  const back = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    try {
      await api.post('/application/apply', form)
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div>
      <PageHeader title="Apply for Loan" />
      <div className={`rounded-2xl p-8 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <Success onAnother={() => { setSuccess(false); setStep(0); setForm({}) }} />
      </div>
    </div>
  )

  const currentFields = STEPS[step].fields

  return (
    <div>
      <PageHeader title="Apply for Loan" subtitle="Complete the form to submit your loan request" />

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: i < step ? 'linear-gradient(135deg,#22c55e,#16a34a)' :
                              i === step ? 'linear-gradient(135deg,#2563eb,#7c3aed)' :
                              isDark ? '#1e2d42' : '#e2e8f0',
                  scale: i === step ? 1.1 : 1,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              >
                {i < step ? <RiCheckLine size={16} /> : i + 1}
              </motion.div>
              <p className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                i === step ? 'text-blue-400' : isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>{s.label}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-4 rounded"
                style={{
                  background: i < step
                    ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                    : isDark ? '#1e2d42' : '#e2e8f0'
                }} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className={`rounded-2xl p-6 ${isDark ? 'glass-card' : 'glass-card-light shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {STEPS[step].label}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {step === 1 ? (
              <div className="md:col-span-2 py-4">
                {checkingDocs ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verifying document status...</p>
                  </div>
                ) : (
                  <div className={`rounded-xl p-6 border ${
                    docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? (
                          <RiCheckLine size={24} className="text-green-500" />
                        ) : (
                          <RiCloseLine size={24} className="text-red-500" />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? 'Documents Verified' : 'Documents Not Verified'}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED'
                            ? 'Your documents have been successfully verified. You can proceed with the application.'
                            : 'You must have verified documents before applying for a loan.'}
                        </p>
                      </div>
                    </div>
                    {!(docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED') && (
                      <div className="mt-6 flex gap-3">
                        <Button size="sm" onClick={() => navigate('/upload-documents')}>
                          Upload Documents
                        </Button>
                        <Button size="sm" variant="secondary" onClick={checkDocs}>
                          Retry Check
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : currentFields.map((f) => {
              const cfg = FIELD_CONFIG[f]
              const isProfileField = step < 4 && step !== 1
              const hoverMsg = isProfileField ? "Edit these details in your profile section" : ""

              if (cfg.type === 'select') return (
                <div key={f} className="flex flex-col gap-1.5" title={hoverMsg}>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cfg.label}</label>
                  <select
                    value={form[f] || ''}
                    onChange={set(f)}
                    disabled={isProfileField}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all
                      ${errors[f] ? 'border-red-500/60' : isDark
                        ? 'bg-white/05 border border-white/10 text-white focus:border-blue-500/60'
                        : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
                      } ${isProfileField ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select...</option>
                    {cfg.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors[f] && <p className="text-xs text-red-400">{errors[f]}</p>}
                </div>
              )
              if (cfg.type === 'textarea') return (
                <div key={f} className="flex flex-col gap-1.5 md:col-span-2" title={hoverMsg}>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cfg.label}</label>
                  <textarea
                    rows={3}
                    value={form[f] || ''}
                    onChange={set(f)}
                    readOnly={isProfileField}
                    placeholder={cfg.placeholder}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all resize-none
                      ${errors[f] ? 'border-red-500/60' : isDark
                        ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60'
                        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 shadow-sm'
                      } ${isProfileField ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                  {errors[f] && <p className="text-xs text-red-400">{errors[f]}</p>}
                </div>
              )
              return (
                <Input key={f} label={cfg.label} type={cfg.type}
                  placeholder={cfg.placeholder} value={form[f] || ''}
                  readOnly={isProfileField}
                  title={hoverMsg}
                  className={isProfileField ? 'opacity-70 cursor-not-allowed' : ''}
                  onChange={set(f)} error={errors[f]} />
              )
            })}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" icon={RiArrowLeftLine} onClick={back} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button icon={RiArrowRightLine} onClick={next} disabled={checkingDocs}>
              {step === 1 && docStatus?.status !== 'APPROVED' && docStatus?.status !== 'VERIFIED' ? 'Verification Required' : 'Next'}
            </Button>
          ) : (
            <Button loading={loading} onClick={handleSubmit} icon={RiCheckLine}>
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplyLoan
