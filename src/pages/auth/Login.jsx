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
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
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
      <div className={`rounded-2xl p-8 ${isDark ? 'glass-card' : 'glass-card-light shadow-xl'}`}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Welcome back
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Sign in to your FinFlow account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={RiMailLine}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />

          <div className="flex flex-col gap-1.5">
            <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <RiLockPasswordLine size={16}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
                  ${errors.password
                    ? 'border-red-500/60 focus:border-red-500'
                    : isDark
                      ? 'bg-white/05 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:bg-white/08'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 shadow-sm'
                  }`}
              />
              <button type="button" onClick={() => setShowPass((p) => !p)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                {showPass ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2" size="lg"
            icon={!loading ? RiArrowRightLine : undefined}>
            Sign In
          </Button>
        </form>

        <p className={`text-sm text-center mt-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
