import { motion } from 'framer-motion'
import Snowfall from './components/Snowfall'
import Logo from './components/Logo'
import EmailCapture from './components/EmailCapture'

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0f1a]">
      {/* Dramatic mountain photo background - responsive */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <picture>
          {/* Mobile: smaller image, cropped to show peaks */}
          <source
            media="(max-width: 640px)"
            srcSet="https://images.unsplash.com/photo-1544133390-ba8e263ae79f?w=800&h=1200&q=80&auto=format&fit=crop&crop=top"
          />
          {/* Tablet */}
          <source
            media="(max-width: 1024px)"
            srcSet="https://images.unsplash.com/photo-1544133390-ba8e263ae79f?w=1200&q=80&auto=format&fit=crop"
          />
          {/* Desktop */}
          <img
            src="https://images.unsplash.com/photo-1544133390-ba8e263ae79f?w=1920&q=80&auto=format&fit=crop"
            alt="Snow-covered mountains under starry night"
            className="w-full h-full object-cover object-top sm:object-center"
            loading="eager"
          />
        </picture>
      </motion.div>

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(10, 15, 26, 0.7) 0%,
            rgba(10, 15, 26, 0.4) 30%,
            rgba(10, 15, 26, 0.3) 50%,
            rgba(10, 15, 26, 0.6) 80%,
            rgba(10, 15, 26, 0.95) 100%)`,
        }}
      />

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 15, 26, 0.5) 100%)',
        }}
      />

      {/* Snowfall */}
      <Snowfall count={50} />

      {/* Main content */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto">

          {/* Logo - Easy to swap: just pass logoSrc="/your-logo.svg" */}
          <Logo
            // logoSrc="/logo.svg"  // Uncomment when you have a logo file
            // logoAlt="SkiGenius"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-6 text-sm md:text-base text-ski-sky font-medium tracking-[0.2em] uppercase"
          >
            Coming Winter 2025
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mt-6 text-center"
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ski-snow leading-tight">
              Your Mountain.
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ski-snow/80 leading-tight mt-1">
              Your Conditions.
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-ski-ice/60 leading-tight mt-1">
              Your Edge.
            </span>
          </motion.h1>

          {/* Value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="mt-8 max-w-xl text-center text-base md:text-lg text-ski-ice/70 font-body leading-relaxed"
          >
            Real-time snow reports. Insider tips from locals. Gear insights that matter.
            <span className="text-ski-snow"> The definitive hub for those who live for the mountain.</span>
          </motion.p>

          {/* Email capture */}
          <div className="mt-10 w-full">
            <EmailCapture />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-auto pt-8 text-center"
        >
          <p className="text-ski-ice/30 text-sm font-body">
            &copy; 2025 SkiGenius
          </p>
        </motion.footer>
      </main>
    </div>
  )
}

export default App
