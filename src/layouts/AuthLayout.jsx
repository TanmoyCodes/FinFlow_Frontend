import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { RiCheckLine, RiShieldLine, RiFlashlightLine, RiCustomerService2Line } from 'react-icons/ri'
import useThemeStore from '../store/themeStore'

const taglines = [
  {
    icon: <RiShieldLine className="text-blue-500" />,
    title: "Bank-Grade Security",
    desc: "Your financial data is protected with 256-bit encryption."
  },
  {
    icon: <RiFlashlightLine className="text-amber-500" />,
    title: "Lightning Fast Approvals",
    desc: "Get your loan processed in minutes, not days."
  },
  {
    icon: <RiCustomerService2Line className="text-green-500" />,
    title: "24/7 Expert Support",
    desc: "Our financial experts are always here to help you."
  }
]

const AuthLayout = ({ children }) => {
  const { isDark } = useThemeStore()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % taglines.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row relative overflow-hidden ${isDark ? 'bg-dark-950' : 'bg-slate-50'}`}>
      {/* Brand Sidebar - Desktop Only */}
      <div className={`hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-12 overflow-hidden ${isDark ? 'bg-dark-900' : 'bg-white'} border-r ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]" />

        {/* Logo */}
        <motion.div
          className="relative z-10 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`text-3xl font-bold font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Fin<span className="gradient-text">Flow</span>
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className={`text-4xl xl:text-5xl font-bold font-display leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              The future of <br />
              <span className="gradient-text">loan processing</span> <br />
              is here.
            </h1>
            <p className={`mt-6 text-lg max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Join 50,000+ users who trust FinFlow for their financial growth and lightning-fast loan approvals.
            </p>
          </motion.div>
        </div>

        {/* Rotating Taglines */}
        <div className="relative z-10 h-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 items-start"
            >
              <div className={`mt-1 p-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                {taglines[index].icon}
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{taglines[index].title}</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{taglines[index].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Form Content */}
      <div className={`flex-1 flex flex-col relative overflow-y-auto ${isDark ? 'bg-dark-950' : 'bg-white'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Fin<span className="gradient-text">Flow</span>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer info or copyright */}
        <div className={`p-8 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          &copy; {new Date().getFullYear()} FinFlow. All rights reserved.
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
