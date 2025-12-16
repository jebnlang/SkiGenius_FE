import { useMemo } from 'react'

const Snowfall = ({ count = 60 }) => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 4 + 2 // 2-6px
      const left = Math.random() * 100 // 0-100%
      const animationDuration = Math.random() * 10 + 10 // 10-20s
      const animationDelay = Math.random() * 10 // 0-10s delay
      const opacity = Math.random() * 0.5 + 0.3 // 0.3-0.8
      const drift = (Math.random() - 0.5) * 40 // -20 to 20px horizontal drift

      return {
        id: i,
        size,
        left,
        animationDuration,
        animationDelay,
        opacity,
        drift,
      }
    })
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: `${flake.left}%`,
            top: '-10px',
            background: `radial-gradient(circle, rgba(255,255,255,${flake.opacity}) 0%, rgba(255,255,255,0) 70%)`,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.animationDelay}s`,
            '--drift': `${flake.drift}px`,
          }}
        />
      ))}

      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift, 20px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Snowfall
