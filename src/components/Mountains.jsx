import { motion, useScroll, useTransform } from 'framer-motion'

const Mountains = () => {
  const { scrollY } = useScroll()

  // Parallax effect
  const y1 = useTransform(scrollY, [0, 500], [0, 60])
  const y2 = useTransform(scrollY, [0, 500], [0, 40])
  const y3 = useTransform(scrollY, [0, 500], [0, 20])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Ambient moonlight glow */}
      <div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[140%] h-[70%] blur-3xl"
        style={{
          background: 'radial-gradient(ellipse 50% 35% at 50% 90%, rgba(56, 189, 248, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Layer 3 - Distant mountains */}
      <motion.svg
        style={{ y: y3 }}
        className="absolute bottom-0 w-full h-[75%]"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="distant" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M0 700 L0 500
             C80 480 120 420 180 450
             C250 380 320 320 400 360
             C480 280 560 220 650 260
             C740 180 830 140 920 180
             C1010 120 1120 100 1220 140
             C1320 80 1400 120 1440 100
             L1440 700 Z"
          fill="url(#distant)"
        />
      </motion.svg>

      {/* Layer 2 - Mid mountains */}
      <motion.svg
        style={{ y: y2 }}
        className="absolute bottom-0 w-full h-[65%]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M0 600 L0 450
             C60 420 100 360 160 400
             C230 320 300 260 380 300
             C460 220 540 160 630 200
             C720 120 810 80 900 120
             C990 60 1100 40 1200 80
             C1300 30 1380 60 1440 50
             L1440 600 Z"
          fill="url(#mid)"
        />
      </motion.svg>

      {/* Layer 1 - Foreground mountains with snow */}
      <motion.svg
        style={{ y: y1 }}
        className="absolute bottom-0 w-full h-[55%]"
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base mountain */}
          <linearGradient id="frontBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="30%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          {/* Snow-capped peak gradient */}
          <linearGradient id="snowPeak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="60%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Main mountain silhouette */}
        <path
          d="M-50 500 L-50 380
             C20 350 60 300 120 340
             C180 280 240 220 320 260
             C400 180 480 120 580 160
             C680 80 780 40 880 80
             C980 20 1100 0 1200 40
             C1300 -20 1400 20 1500 10
             L1500 500 Z"
          fill="url(#frontBase)"
        />

        {/* Snow-capped peaks - drawn as part of the mountain, not separate */}
        {/* Peak 1 - around x=320 */}
        <path
          d="M280 300
             C300 270 310 240 320 260
             C330 240 340 270 360 295
             C340 290 320 280 300 290 Z"
          fill="url(#snowPeak)"
        />

        {/* Peak 2 - around x=580 */}
        <path
          d="M530 200
             C555 165 570 140 580 160
             C590 140 605 165 630 195
             C605 190 580 175 555 188 Z"
          fill="url(#snowPeak)"
        />

        {/* Peak 3 - Major peak around x=880 */}
        <path
          d="M820 130
             C850 90 870 60 880 80
             C890 60 910 90 940 125
             C910 118 880 100 850 115 Z"
          fill="url(#snowPeak)"
        />

        {/* Peak 4 - Tallest around x=1200 */}
        <path
          d="M1130 90
             C1165 50 1185 20 1200 40
             C1215 20 1235 50 1270 85
             C1235 78 1200 58 1165 75 Z"
          fill="url(#snowPeak)"
        />
      </motion.svg>

      {/* Atmospheric mist at base */}
      <div
        className="absolute bottom-0 left-0 w-full h-[20%]"
        style={{
          background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.6) 60%, transparent 100%)',
        }}
      />

      {/* Subtle animated mist wisps */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[8%] left-[-10%] w-[130%] h-[15%] blur-2xl"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(51, 65, 85, 0.25) 20%, rgba(71, 85, 105, 0.15) 50%, rgba(51, 65, 85, 0.25) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}

export default Mountains
