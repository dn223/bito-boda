import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import couplePhoto from '../../assets/couple.png'
import { WEDDING } from '../../mockData/guests'

export function Hero() {
  const bandRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start start', 'end start'],
  })

  const blurPx = useTransform(scrollYProgress, [0, 0.55], [0, 14])
  const imageFilter = useMotionTemplate`blur(${blurPx}px)`
  const imageY = useTransform(scrollYProgress, [0, 0.55], ['0%', '10%'])
  const veilOpacity = useTransform(scrollYProgress, [0, 0.55], [0.06, 0.5])

  return (
    <section ref={bandRef} className="relative">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <motion.img
            src={couplePhoto}
            alt={`${WEDDING.groom} y ${WEDDING.bride}`}
            className="absolute inset-x-0 -top-16 h-[calc(100%+4rem)] w-full scale-105 object-cover object-[center_22%] will-change-transform"
            style={{ filter: imageFilter, y: imageY }}
          />
          <motion.div
            className="absolute inset-0 bg-linen"
            style={{ opacity: veilOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-linen/95 via-linen/45 to-transparent sm:h-[40%]" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-8 pt-40 text-center sm:pb-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute left-3 right-3 top-[10%] text-[11px] font-semibold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_2px_12px_rgba(0,0,0,0.55)] sm:left-6 sm:right-6 sm:top-[12%] sm:text-sm sm:tracking-[0.28em]"
          >
            {WEDDING.dateLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="font-serif text-6xl leading-none text-ink [text-shadow:0_2px_16px_rgba(240,232,217,0.92)] sm:text-7xl md:text-8xl"
          >
            {WEDDING.groom}
            <span className="mx-3 inline-block font-serif text-4xl italic text-strawberry sm:text-5xl">
              &
            </span>
            {WEDDING.bride}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mx-auto mb-7 mt-5 h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#rsvp"
              className="inline-flex rounded-2xl bg-dusty-deep px-6 py-3 text-sm font-medium text-white shadow-lg shadow-strawberry/40 transition hover:bg-strawberry"
            >
              Confirmar asistencia
            </a>
            <a
              href="#info"
              className="inline-flex rounded-2xl border border-ink/15 bg-baby-powder/80 px-6 py-3 text-sm font-medium text-ink shadow-md backdrop-blur-sm transition hover:bg-white"
            >
              Más información
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
