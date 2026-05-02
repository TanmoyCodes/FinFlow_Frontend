import { motion } from 'framer-motion'
import { 
  FiShield, 
  FiZap, 
  FiTrendingUp, 
  FiCpu, 
  FiFileText, 
  FiRefreshCw 
} from 'react-icons/fi'

const Features = () => {
  const features = [
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Bank-grade Security",
      benefit: "Enterprise JWT & Gateway protection."
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Fast Processing",
      benefit: "Sub-second verification via Redis."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Real-time Analytics",
      benefit: "Live tracking of loan lifecycles."
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "AI Risk Scoring",
      benefit: "Intelligent applicant risk assessment."
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Document Automation",
      benefit: "Seamless OCR and verification."
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Workflow Engine",
      benefit: "Automated multi-stage approvals."
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-500 font-bold tracking-widest uppercase text-xs"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold"
          >
            Engineered for <span className="gradient-text">Excellence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            A robust suite of financial microservices designed to handle the most demanding loan processing requirements.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group p-10 glass-card rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 transition-all cursor-default"
            >
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-primary-500/40">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mt-8 mb-4 group-hover:text-primary-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 font-medium text-lg">
                {feature.benefit}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
