import { motion } from 'framer-motion'

// Pétalos variados: distintos tamaños, tonos, formas y velocidades.
const TONES = [
  'bg-marshmallow/75',
  'bg-strawberry/50',
  'bg-lily/60',
  'bg-gold/40',
  'bg-olive/25',
  'bg-white/60',
]

const SHAPES = ['60% 40% 55% 45%', '50% 50% 40% 60%', '70% 30% 60% 40%', '45% 55% 50% 50%']

const petals = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${2 + ((i * 3.4) % 96)}%`,
  size: 6 + (i % 7) * 2.1,
  delay: (i % 11) * 1.4,
  duration: 14 + (i % 9) * 2.6,
  drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 9),
  spin: i % 3 === 0 ? 420 : 260,
  tone: TONES[i % TONES.length],
  shape: SHAPES[i % SHAPES.length],
  peak: 0.4 + (i % 4) * 0.13,
}))

export function FallingPetals() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className={`absolute top-[-12%] ${petal.tone}`}
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.45,
            borderRadius: petal.shape,
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [0, petal.drift, petal.drift * -0.5, 0],
            rotate: [0, petal.spin / 2, petal.spin],
            opacity: [0, petal.peak, petal.peak * 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
