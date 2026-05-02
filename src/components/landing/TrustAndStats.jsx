import { motion } from 'framer-motion'
import { 
  FiShield, 
  FiLock, 
  FiKey, 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart,
  FiCheckCircle 
} from 'react-icons/fi'

export const Security = () => (
  <section id="security" className="py-32 px-6">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="relative glass-card rounded-[3rem] p-12 aspect-square flex items-center justify-center border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>
          <FiShield className="w-64 h-64 text-primary-500/20 absolute" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-2 border-dashed border-white/5 rounded-full absolute"
          />
          <div className="z-10 space-y-6 text-center">
            <div className="w-20 h-20 bg-primary-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary-500/50">
              <FiLock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Encrypted End-to-End</h3>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <div className="text-primary-500 font-bold tracking-widest uppercase text-xs">Security</div>
        <h2 className="text-4xl md:text-5xl font-display font-bold">Your Data, <span className="gradient-text">Fortified</span></h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          We employ state-of-the-art security protocols to ensure your financial information is protected at every layer.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 pt-4">
          {[
            { icon: <FiKey />, title: "JWT Auth", desc: "Stateless security tokens." },
            { icon: <FiShield />, title: "API Gateway", desc: "Protected entry points." },
            { icon: <FiLock />, title: "Encryption", desc: "AES-256 standard." },
            { icon: <FiCheckCircle />, title: "Compliance", desc: "SOC2 & GDPR ready." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all">
              <div className="text-primary-400 mt-1">{item.icon}</div>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export const Analytics = () => (
  <section id="analytics" className="py-32 px-6 bg-dark-900/40">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-8 order-2 lg:order-1">
        <div className="text-primary-500 font-bold tracking-widest uppercase text-xs">Analytics</div>
        <h2 className="text-4xl md:text-5xl font-display font-bold">Actionable <span className="gradient-text">Insights</span></h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Monitor your platform's performance with deep metrics and real-time visualization.
        </p>
        <div className="space-y-6 pt-4">
          {[
            { icon: <FiTrendingUp />, title: "Live Approval Rates", val: "94.2%" },
            { icon: <FiBarChart2 />, title: "Monthly Loan Volume", val: "₹24.5M" },
            { icon: <FiPieChart />, title: "Risk Distribution", val: "Low Risk" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 glass-card rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400">{item.icon}</div>
                <span className="font-bold">{item.title}</span>
              </div>
              <span className="text-xl font-display font-bold gradient-text">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="order-1 lg:order-2"
      >
        <div className="relative glass-card rounded-[2.5rem] border border-white/10 p-4 shadow-3xl">
           <img src="/finflow_app_mockup.png" alt="Analytics View" className="rounded-2xl" />
        </div>
      </motion.div>
    </div>
  </section>
)

export const Testimonials = () => (
  <section className="py-32 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl font-display font-bold">Trusted by <span className="gradient-text">Industry Leaders</span></h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {[
          { text: "FinFlow reduced our processing time by 60% in the first quarter alone.", author: "Siddharth Verma", role: "CTO, IndusBank", img: "https://i.pravatar.cc/150?u=10" },
          { text: "The security features and API Gateway integration are world-class.", author: "Anjali Gupta", role: "Head of Risk, LendIt India", img: "https://i.pravatar.cc/150?u=11" }
        ].map((t, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-10 glass-card rounded-[2.5rem] border border-white/5 italic text-slate-300 relative"
          >
            <span className="text-6xl text-primary-500/20 absolute top-4 left-6 font-serif">"</span>
            <p className="text-xl leading-relaxed mb-8 relative z-10">{t.text}</p>
            <div className="flex items-center gap-4 not-italic">
              <div className="w-12 h-12 rounded-full bg-dark-700 overflow-hidden">
                 <img src={t.img} alt={t.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">{t.author}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)
