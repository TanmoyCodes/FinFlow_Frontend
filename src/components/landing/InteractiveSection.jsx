import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiCalendar, FiActivity } from 'react-icons/fi'

const InteractiveSection = () => {
  const [income, setIncome] = useState(50000)
  const [amount, setAmount] = useState(25000)
  const [tenure, setTenure] = useState(24)
  const [approval, setApproval] = useState(0)
  const [emi, setEmi] = useState(0)

  useEffect(() => {
    // Basic logic for simulation
    const ratio = amount / (income * (tenure / 12))
    let chance = 100 - (ratio * 100)
    if (chance < 0) chance = 5
    if (chance > 98) chance = 98
    
    setApproval(Math.round(chance))
    
    // Simple EMI calc (interest ignored for demo)
    const monthly = (amount * 1.1) / tenure
    setEmi(Math.round(monthly))
  }, [income, amount, tenure])

  return (
    <section className="py-32 px-6 bg-primary-50/50 dark:bg-dark-900/40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="text-primary-500 font-bold tracking-widest uppercase text-xs">Simulator</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Check Your <span className="gradient-text">Eligibility</span> in Seconds
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Our intelligent risk-scoring engine evaluates your application in real-time. Use the simulator to see your potential approval odds.
          </p>

            <div className="space-y-10 pt-4">
            {/* Income Slider */}
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><FiDollarSign className="text-primary-700 dark:text-primary-400" /> Annual Income</span>
                <span className="text-primary-700 dark:text-primary-400">₹{income.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="100000" max="5000000" step="50000" value={income}
                onChange={(e) => setIncome(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-700 dark:accent-primary-500"
              />
            </div>

            {/* Loan Amount Slider */}
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><FiActivity className="text-primary-700 dark:text-primary-400" /> Loan Amount</span>
                <span className="text-primary-700 dark:text-primary-400">₹{amount.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="10000" max="2500000" step="10000" value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-700 dark:accent-primary-500"
              />
            </div>

            {/* Tenure Slider */}
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><FiCalendar className="text-primary-700 dark:text-primary-400" /> Tenure (Months)</span>
                <span className="text-primary-700 dark:text-primary-400">{tenure} Months</span>
              </div>
              <input 
                type="range" min="6" max="60" step="6" value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-700 dark:accent-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary-500/10 rounded-[3rem] blur-3xl"></div>
          <div className="relative glass-card rounded-[3rem] p-12 border border-white/10 text-center space-y-10 shadow-2xl">
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Estimated Approval</p>
              <div className="text-7xl font-display font-bold gradient-text">{approval}%</div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/10 mx-auto w-1/2"></div>

            <div className="grid grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold">₹{emi.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Risk Score</p>
                <p className={`text-2xl font-bold ${approval > 70 ? 'text-success-500' : 'text-warning-500'}`}>
                  {approval > 80 ? 'Low' : approval > 50 ? 'Medium' : 'High'}
                </p>
              </div>
            </div>

            <button className="w-full py-5 bg-primary-600 dark:bg-white text-white dark:text-dark-900 rounded-2xl font-bold text-lg hover:shadow-xl active:scale-95 transition-all">
              Confirm Eligibility & Apply
            </button>
            <p className="text-xs text-slate-500">
              *Simulation results are estimates and do not guarantee final approval.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default InteractiveSection
