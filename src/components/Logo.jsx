import { motion } from 'framer-motion'

/**
 * Logo Component
 *
 * EASY LOGO SWAP:
 * When you have a logo file, just:
 * 1. Add your logo to /public/logo.svg (or .png)
 * 2. Pass logoSrc="/logo.svg" to this component
 *
 * Example: <Logo logoSrc="/logo.svg" logoAlt="SkiGenius" />
 */

const Logo = ({ logoSrc, logoAlt = 'SkiGenius' }) => {
  // If logo image is provided, use it
  if (logoSrc) {
    return (
      <div className="relative">
        {/* Snowflake icon above */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
          className="text-4xl md:text-5xl mb-6 text-center"
        >
          <span className="text-ski-sky opacity-80">&#10052;</span>
        </motion.div>

        {/* Logo image */}
        <motion.img
          src={logoSrc}
          alt={logoAlt}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring', damping: 15 }}
          className="h-16 md:h-24 lg:h-32 w-auto mx-auto"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(14, 165, 233, 0.3))',
          }}
        />

        {/* Subtle glow behind logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="absolute inset-0 -z-10 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    )
  }

  // Default: Text-based logo
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  }

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const letters = 'SKIGENIUS'.split('')

  return (
    <div className="relative">
      {/* Snowflake icon above */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
        className="text-4xl md:text-5xl mb-6 text-center"
      >
        <span className="text-ski-sky opacity-80">&#10052;</span>
      </motion.div>

      {/* Main logo text */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-display font-bold tracking-wider text-center"
        style={{
          fontSize: 'clamp(2.5rem, 12vw, 7rem)',
          perspective: '1000px',
        }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 50%, #0EA5E9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(14, 165, 233, 0.3)',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtle glow behind logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute inset-0 -z-10 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export default Logo
