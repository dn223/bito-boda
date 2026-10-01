import { motion } from 'framer-motion'

// Tarjeta base del dashboard: blanca, con borde fino y sombra en capas.
// Separada del Card floral de la invitación para que cada parte evolucione aparte.
export function Panel({ children, className = '', index = 0, hover = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`rounded-2xl border border-linen-deep/70 bg-white shadow-[0_1px_2px_rgba(63,58,54,0.04),0_8px_24px_-12px_rgba(63,58,54,0.18)] ${className}`}
    >
      {children}
    </motion.div>
  )
}
