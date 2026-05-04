import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RiUserLine, RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, 
  RiArrowRightLine, RiArrowLeftLine, RiPhoneLine, RiMapPinLine, 
  RiBriefcaseLine, RiCalendarLine, RiUserHeartLine, RiMoneyDollarCircleLine,
  RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'

const Signup = () => {
  const navigate = useNavigate()
  const { isDark } = useThemeStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ 
    fullName: '', email: '', password: '', confirmPassword: '',
    contactNumber: '', dateOfBirth: '', gender: '', currentAddress: '',
    permanentAddress: '', occupation: '', employerName: '', income: '', workExperience: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const validateStep1 = () => {
    const e = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.fullName.trim()) e.fullName = 'Full Name is required'
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      e.email = 'Enter a valid email address'
    }

    if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) {
      e.password = 'Must include uppercase, lowercase & number'
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    const phoneRegex = /^[0-9]{10}$/

    if (!phoneRegex.test(form.contactNumber)) e.contactNumber = 'Enter a valid 10-digit number'
    
    if (!form.dateOfBirth) {
      e.dateOfBirth = 'Date of birth is required'
    } else {
      const birthDate = new Date(form.dateOfBirth)
      const age = new Date().getFullYear() - birthDate.getFullYear()
      if (age < 18) e.dateOfBirth = 'Must be at least 18 years old'
    }

    if (!form.gender) e.gender = 'Gender is required'
    if (!form.occupation.trim()) e.occupation = 'Occupation is required'
    if (!form.income || form.income <= 0) e.income = 'Enter a valid monthly income'
    
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    try {
      await api.post('/auth/signup', form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-8 py-2">
        <div className="flex justify-between items-end">
          <div>
            <h2 className={`text-4xl font-bold font-display tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {step === 1 ? 'Create account' : 'Complete Profile'}
            </h2>
            <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {step === 1 ? 'Join FinFlow and start your loan journey' : 'Provide your details to speed up loan approvals'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 mb-1">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
             <div className="flex gap-1.5">
                <div className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200 dark:bg-dark-700'}`} />
                <div className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200 dark:bg-dark-700'}`} />
             </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Input label="Full Name" icon={RiUserLine} value={form.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="John Doe" />
                <Input label="Email Address" type="email" icon={RiMailLine} value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Password" 
                    type={showPass ? 'text' : 'password'} 
                    icon={RiLockPasswordLine}
                    value={form.password} 
                    onChange={set('password')} 
                    error={errors.password} 
                    placeholder="••••••••" 
                  />
                  <Input 
                    label="Confirm" 
                    type={showPass ? 'text' : 'password'} 
                    icon={RiLockPasswordLine}
                    value={form.confirmPassword} 
                    onChange={set('confirmPassword')} 
                    error={errors.confirmPassword} 
                    placeholder="••••••••" 
                    suffix={
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)} 
                        className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                      </button>
                    }
                  />
                </div>
                
                <Button onClick={handleNext} className="w-full h-12 text-base font-bold shadow-lg shadow-primary-500/20 mt-2" icon={RiArrowRightLine}>Next: Profile Details</Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Contact Number" icon={RiPhoneLine} value={form.contactNumber} onChange={set('contactNumber')} error={errors.contactNumber} placeholder="9876543210" />
                  <Input label="Date of Birth" type="date" icon={RiCalendarLine} value={form.dateOfBirth} onChange={set('dateOfBirth')} error={errors.dateOfBirth} />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gender</label>
                  <div className="relative">
                    <RiUserHeartLine size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <select value={form.gender} onChange={set('gender')} className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer ${errors.gender ? 'border-red-500/60' : isDark ? 'bg-white/05 border border-white/10 text-white focus:border-primary-500/60' : 'bg-white border border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'}`}>
                      <option value="" disabled className={isDark ? 'bg-dark-800' : 'bg-white'}>Select Gender</option>
                      <option value="Male" className={isDark ? 'bg-dark-800' : 'bg-white'}>Male</option>
                      <option value="Female" className={isDark ? 'bg-dark-800' : 'bg-white'}>Female</option>
                      <option value="Other" className={isDark ? 'bg-dark-800' : 'bg-white'}>Other</option>
                    </select>
                  </div>
                  {errors.gender && <p className="text-xs text-red-400">{errors.gender}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Current Address" icon={RiMapPinLine} value={form.currentAddress} onChange={set('currentAddress')} error={errors.currentAddress} placeholder="Street, City" />
                  <Input label="Permanent Address" icon={RiMapPinLine} value={form.permanentAddress} onChange={set('permanentAddress')} error={errors.permanentAddress} placeholder="Street, City" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Occupation" icon={RiBriefcaseLine} value={form.occupation} onChange={set('occupation')} error={errors.occupation} placeholder="Engineer" />
                  <Input label="Employer" icon={RiBriefcaseLine} value={form.employerName} onChange={set('employerName')} error={errors.employerName} placeholder="Google" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Monthly Income (₹)" type="number" icon={RiMoneyDollarCircleLine} value={form.income} onChange={set('income')} error={errors.income} placeholder="50000" />
                  <Input label="Experience (yrs)" type="number" icon={RiTimeLine} value={form.workExperience} onChange={set('workExperience')} error={errors.workExperience} placeholder="3" />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={() => setStep(1)} variant="secondary" className="flex-1 h-12 text-base font-bold" icon={RiArrowLeftLine}>Back</Button>
                  <Button onClick={handleSubmit} loading={loading} className="flex-[2] h-12 text-base font-bold shadow-lg shadow-primary-500/20" icon={RiArrowRightLine}>Create Account</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className={`text-sm text-center mt-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Signup
