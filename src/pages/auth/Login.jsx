import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import api from '../../api/axios'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { isDark } = useThemeStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      e.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.role, data.user)
      toast.success(`Welcome back, ${data.user?.name || 'User'}! 👋`)
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-10 py-2">
        <div>
          <h2 className={`text-4xl font-bold font-display tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back
          </h2>
          <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Please enter your details to sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={RiMailLine}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <Link to="/forgot-password" size="xs" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              icon={RiLockPasswordLine}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              suffix={
                <button 
                  type="button" 
                  onClick={() => setShowPass((p) => !p)}
                  className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              }
            />
          </div>

          <Button type="submit" loading={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary-500/20 mt-4"
            icon={!loading ? RiArrowRightLine : undefined}>
            Sign In
          </Button>
        </form>

        <p className={`text-sm text-center mt-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
