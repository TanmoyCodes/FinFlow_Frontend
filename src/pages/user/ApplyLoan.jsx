import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCheckLine, RiArrowRightLine, RiArrowLeftLine, RiCloseLine, RiInformationLine } from 'react-icons/ri'
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/

    // Generic check for all visible fields in current step
    STEPS[step].fields.forEach((f) => {
      if (!form[f]?.toString().trim()) {
        e[f] = 'This field is required'
      }
    })

    // Step specific overrides
    if (step === 0) {
      if (form.email && !emailRegex.test(form.email)) e.email = 'Enter a valid email'
      if (form.contactNumber && !phoneRegex.test(form.contactNumber)) e.contactNumber = 'Enter a valid 10-digit number'
      if (form.dateOfBirth) {
        const age = new Date().getFullYear() - new Date(form.dateOfBirth).getFullYear()
        if (age < 18) e.dateOfBirth = 'Must be at least 18 years old'
      }
    }

    if (step === 4) {
      const amt = Number(form.amount)
      if (amt < 10000) e.amount = 'Minimum loan amount is ₹10,000'
      if (amt > 5000000) e.amount = 'Maximum loan amount is ₹50,00,000'
      
      const tnr = Number(form.tenure)
      if (tnr < 6) e.tenure = 'Minimum tenure is 6 months'
      if (tnr > 360) e.tenure = 'Maximum tenure is 360 months'
    }

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

  const handleDisabledClick = () => {
    toast('Profile data is read-only here. Update it in your Profile section if needed.', {
      icon: 'ℹ️',
      style: {
        borderRadius: '12px',
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#1e293b',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
      },
    })
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
  const isProfileStep = [0, 2, 3].includes(step)

  return (
    <div>
      <PageHeader title="Apply for Loan" subtitle="Complete the form to submit your loan request" />

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-4">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 min-w-[120px]">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: i < step ? 'linear-gradient(135deg,#22c55e,#16a34a)' :
                              i === step ? 'linear-gradient(135deg,#2563eb,#7c3aed)' :
                              isDark ? '#1e2d42' : '#e2e8f0',
                  scale: i === step ? 1.1 : 1,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-black/10"
              >
                {i < step ? <RiCheckLine size={16} /> : i + 1}
              </motion.div>
              <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider whitespace-nowrap ${
                i === step ? 'text-blue-400' : isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>{s.label}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-6 rounded"
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
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {STEPS[step].label}
          </h3>
          {isProfileStep && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-medium ${
                isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}
            >
              <RiInformationLine size={14} />
              Synced with Profile
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {step === 1 ? (
              <div className="md:col-span-2 py-4">
                {checkingDocs ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verifying document status...</p>
                  </div>
                ) : (
                  <div className={`rounded-2xl p-8 border-2 ${
                    docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? (
                          <RiCheckLine size={28} className="text-green-500" />
                        ) : (
                          <RiCloseLine size={28} className="text-red-500" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED' ? 'Identity Verified' : 'Action Required'}
                        </h4>
                        <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED'
                            ? 'Your identity documents have been successfully verified. You are now eligible to proceed.'
                            : 'To maintain platform security, you must verify your identity before submitting a loan application.'}
                        </p>
                      </div>
                    </div>
                    {!(docStatus?.status === 'APPROVED' || docStatus?.status === 'VERIFIED') && (
                      <div className="mt-8 flex gap-4">
                        <Button className="h-11 px-6 shadow-lg shadow-primary-500/20" onClick={() => navigate('/upload-documents')}>
                          Verify Identity Now
                        </Button>
                        <Button variant="secondary" className="h-11 px-6" onClick={checkDocs}>
                          Refresh Status
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : currentFields.map((f) => {
              const cfg = FIELD_CONFIG[f]
              const isProfileField = step < 4 && step !== 1

              if (cfg.type === 'select') return (
                <div key={f} className="flex flex-col gap-2" onClick={isProfileField ? handleDisabledClick : undefined}>
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cfg.label}</label>
                  <select
                    value={form[f] || ''}
                    onChange={set(f)}
                    disabled={isProfileField}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                      ${errors[f] ? 'border-red-500/60' : isDark
                        ? 'bg-white/05 border border-white/10 text-white focus:border-blue-500/60'
                        : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm'
                      } ${isProfileField ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
                  >
                    <option value="">Select...</option>
                    {cfg.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors[f] && <p className="text-xs text-red-400 font-medium ml-1">{errors[f]}</p>}
                </div>
              )
              if (cfg.type === 'textarea') return (
                <div key={f} className="flex flex-col gap-2 md:col-span-2" onClick={isProfileField ? handleDisabledClick : undefined}>
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cfg.label}</label>
                  <textarea
                    rows={3}
                    value={form[f] || ''}
                    onChange={set(f)}
                    readOnly={isProfileField}
                    placeholder={cfg.placeholder}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none
                      ${errors[f] ? 'border-red-500/60' : isDark
                        ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60'
                        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 shadow-sm'
                      } ${isProfileField ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  {errors[f] && <p className="text-xs text-red-400 font-medium ml-1">{errors[f]}</p>}
                </div>
              )
              return (
                <div key={f} onClick={isProfileField ? handleDisabledClick : undefined}>
                  <Input label={cfg.label} type={cfg.type}
                    placeholder={cfg.placeholder} value={form[f] || ''}
                    readOnly={isProfileField}
                    className={isProfileField ? 'opacity-60 cursor-not-allowed' : ''}
                    onChange={set(f)} error={errors[f]} />
                </div>
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
