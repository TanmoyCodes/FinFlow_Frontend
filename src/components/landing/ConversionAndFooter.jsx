import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'

export const CTA = () => (
  <section className="py-32 px-6">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 rounded-[3rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-gradient-x"></div>
      <div className="relative glass-card rounded-[3rem] p-12 md:p-24 text-center space-y-10 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>
        
        <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight">
          Ready to simplify your <br />
          <span className="gradient-text">loan journey?</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Join 1,200+ financial institutions transforming their operations with FinFlow's intelligent microservices.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 relative z-10">
          <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-white text-dark-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            Create Free Account
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-10 py-5 glass-card rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Sign In to Dashboard
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
)

export const Footer = () => (
  <footer className="py-20 border-t border-white/5 px-6 relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px]"></div>
    
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-display font-bold">FinFlow</span>
          </Link>
          <p className="text-slate-500 max-w-xs leading-relaxed">
            The next generation of financial microservices. Secure, fast, and intelligent automation for modern institutions.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"><FiGithub /></a>
            <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"><FiLinkedin /></a>
            <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"><FiTwitter /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-300">Product</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#features" className="hover:text-primary-400">Features</a></li>
            <li><a href="#security" className="hover:text-primary-400">Security</a></li>
            <li><a href="#analytics" className="hover:text-primary-400">Analytics</a></li>
            <li><a href="#pricing" className="hover:text-primary-400">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-300">Company</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-primary-400">About Us</a></li>
            <li><a href="#" className="hover:text-primary-400">Careers</a></li>
            <li><a href="#" className="hover:text-primary-400">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-300">Legal</h4>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-primary-400">Privacy</a></li>
            <li><a href="#" className="hover:text-primary-400">Terms</a></li>
            <li><a href="#" className="hover:text-primary-400">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-slate-600 text-sm">
        <p>© 2026 FinFlow Financial Systems. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">System Status</a>
          <a href="#" className="hover:text-white">API Documentation</a>
        </div>
      </div>
    </div>
  </footer>
)
