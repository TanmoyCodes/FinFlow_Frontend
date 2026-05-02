import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import useThemeStore from '../../store/themeStore'

// Components
import Navbar from '../../components/landing/Navbar'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import InteractiveSection from '../../components/landing/InteractiveSection'
import Pricing from '../../components/landing/Pricing'
import { Security, Analytics, Testimonials } from '../../components/landing/TrustAndStats'
import { CTA, Footer } from '../../components/landing/ConversionAndFooter'

const LandingPage = () => {
  const { isDark } = useThemeStore()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  }, [])

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-mesh text-slate-200' : 'bg-mesh-light text-slate-800'} font-sans selection:bg-primary-500/30`}>
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[9999]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 z-[200] origin-[0%]"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        
        <div id="features">
           <Features />
        </div>

        <InteractiveSection />
        
        <div id="security">
           <Security />
        </div>

        <div id="analytics">
           <Analytics />
        </div>

        <Testimonials />

        <div id="pricing">
           <Pricing />
        </div>

        <CTA />
      </main>

      <Footer />

      {/* Floating Blobs (Background) */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
    </div>
  )
}

export default LandingPage
