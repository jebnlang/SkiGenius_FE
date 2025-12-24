import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const EmailCapture = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email: email.toLowerCase().trim() }])

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - email already exists
          setErrorMessage('You\'re already on the list!')
          setStatus('error')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setEmail('')
      }
    } catch (err) {
      console.error('Error saving email:', err)
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setStatus('idle')
      setErrorMessage('')
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.8, type: 'spring', damping: 20 }}
      className="w-full max-w-md mx-auto"
    >
      {/* CTA text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        className="text-center text-ski-ice/50 text-sm mb-4 font-body"
      >
        Be the first to know when we drop.
      </motion.p>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-4xl mb-3"
            >
              &#10052;
            </motion.div>
            <p className="text-ski-snow font-medium">You're in.</p>
            <p className="text-ski-ice/60 text-sm mt-1">We'll hit your inbox when it's go time.</p>
          </motion.div>
        ) : status === 'error' ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-4xl mb-3"
            >
              {errorMessage.includes('already') ? '✓' : '✗'}
            </motion.div>
            <p className="text-ski-snow font-medium">{errorMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className={`
              relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl
              glass-strong transition-all duration-300
              ${focused ? 'glow-strong' : 'glow'}
            `}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="
                flex-1 px-5 py-3.5 rounded-xl
                bg-white/5 border border-white/10
                text-ski-snow placeholder:text-ski-ice/40
                font-body text-base
                focus:outline-none focus:border-ski-sky/50
                transition-all duration-300
                disabled:opacity-50
              "
            />

            <motion.button
              type="submit"
              disabled={status === 'loading' || !email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                px-6 py-3.5 rounded-xl
                bg-ski-sky text-white font-medium
                flex items-center justify-center gap-2
                transition-all duration-300
                hover:bg-sky-400
                disabled:opacity-50 disabled:cursor-not-allowed
                btn-glow
              "
            >
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <span>Get First Tracks</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default EmailCapture
