import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlay, FiTrendingUp, FiClock, FiShield } from 'react-icons/fi'

const Hero = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  const avatars = [
    'https://i.pravatar.cc/150?u=1',
    'https://i.pravatar.cc/150?u=2',
    'https://i.pravatar.cc/150?u=3',
    'https://i.pravatar.cc/150?u=4',
  ]

  return (
    <section className="relative pt-24 pb-12 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
            <FiShield className="w-4 h-4" />
            The Future of Intelligent Financing
          </div>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight">
            Streamline Loan <br />
            <span className="gradient-text">Processing</span> with <br />
            Automation.
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Experience lightning-fast approvals and bank-grade security. Our platform automates the entire loan lifecycle for modern institutions.
          </p>

          <div className="flex flex-wrap gap-5 pt-2">
            <Link to="/signup" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300"></div>
              <button className="relative px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-3 group transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
                Apply for Loan
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login" className="px-8 py-4 glass-card rounded-2xl font-bold flex items-center gap-3 border border-slate-200 dark:border-white/10 hover:bg-white/5 transition-all text-slate-800 dark:text-slate-200">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <FiPlay className="ml-1 w-3 h-3" />
              </div>
              View Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-3">
              {avatars.map((url, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-dark-900 bg-slate-100 dark:bg-dark-700 overflow-hidden">
                  <img src={url} alt="avatar" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-base font-bold">1,200+ Institutions</p>
              <p className="text-xs text-slate-500 font-medium">Trust FinFlow for their operations</p>
            </div>
          </div>
        </motion.div>

        {/* Right Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative origin-center max-w-3xl mx-auto"
          style={{ y: y1 }}
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-2xl"></div>
          
          <div className="relative glass-card-light dark:glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-3xl">
            <img 
              src="/finflow_app_mockup.png" 
              alt="Platform Dashboard" 
              className="w-full h-auto max-h-[65vh] object-top object-cover"
            />
          </div>

          {/* Floating Card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 glass-card rounded-2xl border border-white/10 shadow-2xl z-10 hidden xl:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-success-500/10 dark:bg-success-500/20 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-success-600 dark:text-success-500 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg. Approval</p>
                <p className="text-xl font-bold text-success-700 dark:text-white">98.4%</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 p-4 glass-card rounded-2xl border border-white/10 shadow-2xl z-10 hidden xl:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <FiClock className="text-primary-600 dark:text-primary-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Process Time</p>
                <p className="text-xl font-bold text-primary-700 dark:text-white">4.2 min</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
