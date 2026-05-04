import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'

const Pricing = () => {
  const plans = [
    {
      name: "Personal",
      price: "Free",
      desc: "For individual borrowers",
      features: ["Basic Loan Tracking", "Document Upload", "Standard Support", "Mobile App Access"]
    },
    {
      name: "Borrower Pro",
      price: "₹999",
      period: "/mo",
      desc: "For serious applicants",
      features: ["Priority Processing", "Advanced Analytics", "24/7 Priority Support", "Interest Rate Simulator", "Credit Repair Tools"],
      popular: true
    },
    {
      name: "Institution",
      price: "Custom",
      desc: "For banks and lenders",
      features: ["Unlimited Applications", "White-label Branding", "API Gateway Integration", "Custom Risk Models", "SLA Guarantee"]
    }
  ]

  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <div className="text-primary-500 font-bold tracking-widest uppercase text-xs">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Simple, <span className="gradient-text">Transparent</span> Plans</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your financial journey. No hidden fees, ever.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-10 rounded-[2.5rem] border transition-all duration-300 ${
                plan.popular 
                  ? 'bg-primary-50 dark:bg-primary-600/5 border-primary-500 scale-105 shadow-2xl z-10' 
                  : 'glass-card border-slate-200 dark:border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{plan.desc}</p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 flex-shrink-0">
                      <FiCheck className="w-3 h-3" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup" className="block w-full">
                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-600/20' 
                    : 'bg-primary-600 dark:bg-white/5 text-white dark:text-white hover:bg-primary-700 dark:hover:bg-white/10 border border-transparent dark:border-white/10'
                }`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
