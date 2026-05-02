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
    if (!form.fullName.trim()) e.fullName = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.contactNumber.trim()) e.contactNumber = 'Required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Required'
    if (!form.gender) e.gender = 'Required'
    if (!form.occupation.trim()) e.occupation = 'Required'
    if (!form.income) e.income = 'Required'
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
      <div className={`rounded-2xl p-8 transition-all duration-500 ${isDark ? 'glass-card' : 'glass-card-light shadow-xl'} ${step === 2 ? 'max-w-xl -mx-10 md:-mx-20' : ''}`}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {step === 1 ? 'Create account' : 'Complete Profile'}
            </h2>
            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              Step {step} of 2
            </span>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {step === 1 ? 'Join FinFlow and start your loan journey' : 'Provide your details to speed up loan approvals'}
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <Input label="Full Name" icon={RiUserLine} value={form.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="John Doe" />
                <Input label="Email Address" type="email" icon={RiMailLine} value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                    <div className="relative">
                      <RiLockPasswordLine size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${errors.password ? 'border-red-500/60' : isDark ? 'bg-white/05 border border-white/10 text-white' : 'bg-white border border-slate-200'}`} placeholder="••••••••" />
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm</label>
                    <div className="relative">
                      <RiLockPasswordLine size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all ${errors.confirmPassword ? 'border-red-500/60' : isDark ? 'bg-white/05 border border-white/10 text-white' : 'bg-white border border-slate-200'}`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showPass ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}</button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>
                
                <Button onClick={handleNext} className="w-full mt-2" size="lg" icon={RiArrowRightLine}>Next: Profile Details</Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Contact Number" icon={RiPhoneLine} value={form.contactNumber} onChange={set('contactNumber')} error={errors.contactNumber} placeholder="9876543210" />
                  <Input label="Date of Birth" type="date" icon={RiCalendarLine} value={form.dateOfBirth} onChange={set('dateOfBirth')} error={errors.dateOfBirth} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gender</label>
                  <div className="relative">
                    <RiUserHeartLine size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <select value={form.gender} onChange={set('gender')} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${errors.gender ? 'border-red-500/60' : isDark ? 'bg-white/05 border border-white/10 text-white' : 'bg-white border border-slate-200'}`}>
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Current Address" icon={RiMapPinLine} value={form.currentAddress} onChange={set('currentAddress')} error={errors.currentAddress} placeholder="Street, City, State" />
                  <Input label="Permanent Address" icon={RiMapPinLine} value={form.permanentAddress} onChange={set('permanentAddress')} error={errors.permanentAddress} placeholder="Street, City, State" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Occupation" icon={RiBriefcaseLine} value={form.occupation} onChange={set('occupation')} error={errors.occupation} placeholder="Engineer" />
                  <Input label="Employer" icon={RiBriefcaseLine} value={form.employerName} onChange={set('employerName')} error={errors.employerName} placeholder="Google" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Income (₹)" type="number" icon={RiMoneyDollarCircleLine} value={form.income} onChange={set('income')} error={errors.income} placeholder="50000" />
                  <Input label="Experience (yrs)" type="number" icon={RiTimeLine} value={form.workExperience} onChange={set('workExperience')} error={errors.workExperience} placeholder="3" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={() => setStep(1)} variant="secondary" className="flex-1" icon={RiArrowLeftLine}>Back</Button>
                  <Button onClick={handleSubmit} loading={loading} className="flex-[2]" icon={RiArrowRightLine}>Create Account</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className={`text-sm text-center mt-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Signup
