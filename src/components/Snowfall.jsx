import { useEffect, useRef, useCallback } from 'react'

const Snowfall = ({ count = 250 }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 })
  const animationRef = useRef(null)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastMouseTime = useRef(Date.now())
  const accumulationRef = useRef([]) // Snow accumulation heights across the bottom
  const maxAccumulation = 90 // Maximum snow pile height in pixels

  // Create a snowflake particle
  const createParticle = useCallback((canvas, existingParticle = null) => {
    const depth = Math.random() // 0 = far, 1 = near
    const size = 1 + depth * 5 // 1-6px based on depth

    return {
      x: existingParticle ? existingParticle.x : Math.random() * canvas.width,
      y: existingParticle ? -10 : Math.random() * canvas.height,
      size,
      depth,
      baseSpeed: 0.5 + depth * 1.5, // Far = slow, near = fast
      speed: 0.3 + depth * 1.5,
      opacity: 0.3 + depth * 0.5, // Far = dim, near = bright
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      windOffset: Math.random() * Math.PI * 2,
      // Turbulence state
      turbulenceX: 0,
      turbulenceY: 0,
    }
  }, [])

  // Initialize particles
  const initParticles = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(canvas)
    )
  }, [count, createParticle])

  // Initialize accumulation array
  const initAccumulation = useCallback((width) => {
    const segments = Math.ceil(width / 3) // One height value per 3 pixels
    accumulationRef.current = new Array(segments).fill(0)
  }, [])

  // Handle mouse movement with velocity tracking
  const handleMouseMove = useCallback((e) => {
    const now = Date.now()
    const dt = Math.max(1, now - lastMouseTime.current)

    const newX = e.clientX
    const newY = e.clientY

    // Calculate mouse velocity
    mouseRef.current.vx = (newX - lastMousePos.current.x) / dt * 16
    mouseRef.current.vy = (newY - lastMousePos.current.y) / dt * 16
    mouseRef.current.x = newX
    mouseRef.current.y = newY

    lastMousePos.current = { x: newX, y: newY }
    lastMouseTime.current = now
  }, [])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -1000
    mouseRef.current.y = -1000
    mouseRef.current.vx = 0
    mouseRef.current.vy = 0
  }, [])

  // Animation loop
  const animate = useCallback((canvas, ctx, time) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Global wind with subtle variation
    const globalWindX = Math.sin(time * 0.0003) * 0.5 + 0.3
    const gustStrength = Math.sin(time * 0.001) * 0.5 + 0.5

    // Decay mouse velocity over time
    mouseRef.current.vx *= 0.95
    mouseRef.current.vy *= 0.95

    particlesRef.current.forEach((particle, i) => {
      // Wobble motion
      const wobble = Math.sin(time * particle.wobbleSpeed + particle.wobbleOffset) * 0.5

      // Wind effect (stronger for particles closer to viewer)
      const windEffect = globalWindX * (0.5 + particle.depth * 0.5) * (1 + gustStrength * 0.3)

      // Mouse turbulence
      const dx = particle.x - mouseRef.current.x
      const dy = particle.y - mouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const turbulenceRadius = 120

      if (distance < turbulenceRadius && distance > 0) {
        const force = (1 - distance / turbulenceRadius) * 0.8
        const mouseSpeed = Math.sqrt(
          mouseRef.current.vx * mouseRef.current.vx +
          mouseRef.current.vy * mouseRef.current.vy
        )

        // Create swirling turbulence based on mouse velocity
        const angle = Math.atan2(dy, dx)
        const perpAngle = angle + Math.PI / 2

        // Swirl effect - particles spiral around cursor path
        particle.turbulenceX += (
          Math.cos(perpAngle) * mouseSpeed * force * 0.3 +
          mouseRef.current.vx * force * 0.2
        )
        particle.turbulenceY += (
          Math.sin(perpAngle) * mouseSpeed * force * 0.3 +
          mouseRef.current.vy * force * 0.2
        )
      }

      // Decay turbulence
      particle.turbulenceX *= 0.96
      particle.turbulenceY *= 0.96

      // Update position
      particle.x += windEffect + wobble + particle.turbulenceX
      particle.y += particle.speed + particle.turbulenceY * 0.5

      // Occasional speed burst (gust)
      if (Math.random() < 0.001) {
        particle.speed = particle.baseSpeed * (1.5 + Math.random())
      } else {
        particle.speed += (particle.baseSpeed - particle.speed) * 0.02
      }

      // Check for accumulation collision or going off screen
      const accIndex = Math.floor(particle.x / 3)
      const accHeight = accumulationRef.current[accIndex] || 0
      const groundLevel = canvas.height - accHeight

      if (particle.y > groundLevel - particle.size) {
        // Add to accumulation (only if not at max)
        if (accHeight < maxAccumulation && particle.x > 0 && particle.x < canvas.width) {
          // Add snow based on particle size
          const addAmount = particle.size * 0.8

          // Spread accumulation to neighboring segments for smoother piles
          for (let offset = -2; offset <= 2; offset++) {
            const idx = accIndex + offset
            if (idx >= 0 && idx < accumulationRef.current.length) {
              const falloff = 1 - Math.abs(offset) * 0.3
              accumulationRef.current[idx] = Math.min(
                maxAccumulation,
                accumulationRef.current[idx] + addAmount * falloff
              )
            }
          }
        }

        // Recycle particle
        const newParticle = createParticle(canvas, { x: Math.random() * canvas.width })
        particlesRef.current[i] = newParticle
        return
      }

      // Reset if off screen horizontally
      if (particle.x < -50 || particle.x > canvas.width + 50) {
        const newParticle = createParticle(canvas, { x: Math.random() * canvas.width })
        particlesRef.current[i] = newParticle
        return
      }

      // Draw snowflake with glow effect for larger particles
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      )

      const alpha = particle.opacity * (0.7 + Math.sin(time * 0.002 + particle.wobbleOffset) * 0.3)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.6})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    })

    // Draw snow accumulation
    if (accumulationRef.current.length > 0) {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      // Draw smooth curve through accumulation points
      for (let i = 0; i < accumulationRef.current.length; i++) {
        const x = i * 3
        const height = accumulationRef.current[i]
        const y = canvas.height - height

        if (i === 0) {
          ctx.lineTo(x, y)
        } else {
          // Smooth curve using quadratic bezier
          const prevX = (i - 1) * 3
          const prevHeight = accumulationRef.current[i - 1]
          const prevY = canvas.height - prevHeight
          const cpX = (prevX + x) / 2
          ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2)
        }
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()

      // Gradient fill for snow pile
      const snowGradient = ctx.createLinearGradient(0, canvas.height - maxAccumulation, 0, canvas.height)
      snowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      snowGradient.addColorStop(0.3, 'rgba(240, 245, 255, 0.85)')
      snowGradient.addColorStop(1, 'rgba(220, 230, 245, 0.8)')
      ctx.fillStyle = snowGradient
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame((t) => animate(canvas, ctx, t))
  }, [createParticle, maxAccumulation])

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Reinitialize particles if needed
      if (particlesRef.current.length === 0) {
        initParticles(canvas)
      }

      // Initialize accumulation array
      initAccumulation(canvas.width)
    }

    handleResize()
    initParticles(canvas)
    initAccumulation(canvas.width)

    // Start animation
    animationRef.current = requestAnimationFrame((t) => animate(canvas, ctx, t))

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Visibility change - pause when tab not visible
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationRef.current)
      } else {
        animationRef.current = requestAnimationFrame((t) => animate(canvas, ctx, t))
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [animate, handleMouseMove, handleMouseLeave, initParticles, initAccumulation])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export default Snowfall
  