import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi'
import useThemeStore from '../../store/themeStore'

const Navbar = () => {
  const { isDark } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Pricing', href: '#pricing' },
  ]

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled 
        ? (isDark ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4')
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">Fin<span className="gradient-text">Flow</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-dark-900'
          }`}>
            Sign In
          </Link>
          <Link to="/signup" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <button className="relative px-7 py-3 bg-white text-dark-900 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
              Get Started
              <FiArrowRight />
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden ${
              isDark ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200'
            }`}
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <Link to="/login" className="text-center font-bold">Sign In</Link>
                <Link to="/signup" className="py-4 bg-primary-600 text-white rounded-2xl text-center font-bold">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
