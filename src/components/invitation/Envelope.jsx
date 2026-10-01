import { useState } from 'react'
import { motion } from 'framer-motion'
import { WEDDING } from '../../mockData/guests'

// Portada: un sobre cerrado que se abre al tocar el sello.
export function Envelope({ onOpen }) {
  const [opening, setOpening] = useState(false)

  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 1750)
  }

  return (
    <motion.div
      className="mantel fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6, delay: opening ? 1.1 : 0 }}
    >
      <motion.button
        type="button"
        onClick={open}
        aria-label="Abrir invitación"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={
          opening
            ? { scale: 1.12, y: -10, opacity: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: opening ? 1.1 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[340px] cursor-pointer"
        style={{ perspective: 1400 }}
      >
        <div className="relative aspect-[5/7] w-full rounded-[3px] bg-olive shadow-[0_30px_60px_-12px_rgba(0,0,0,0.55)]">
          {/* pliegues laterales e inferior */}
          <div
            className="absolute inset-0 bg-olive-deep/25"
            style={{ clipPath: 'polygon(0 45%, 50% 100%, 0 100%)' }}
          />
          <div
            className="absolute inset-0 bg-olive-deep/25"
            style={{ clipPath: 'polygon(100% 45%, 100% 100%, 50% 100%)' }}
          />
          <div
            className="absolute inset-0 bg-black/5"
            style={{ clipPath: 'polygon(0 100%, 50% 58%, 100% 100%)' }}
          />

          {/* solapa superior: gira sobre su borde de arriba */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[58%] origin-top"
            style={{ transformStyle: 'preserve-3d' }}
            animate={opening ? { rotateX: -172 } : { rotateX: 0 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.25 }}
          >
            <div
              className="h-full w-full bg-olive shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45)]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />
          </motion.div>

          {/* sello de cera */}
          <motion.div
            className="absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2"
            animate={opening ? { scale: 0.75, opacity: 0, rotate: -18, y: 24 } : {}}
            transition={{ duration: 0.45, ease: 'easeIn' }}
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#e6d29a,#c9ab63_45%,#9c8442)] shadow-[0_6px_14px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.45)]">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#8d7539]/40 bg-[radial-gradient(circle_at_35%_30%,#dcc68f,#b99c56)]">
                <span className="font-serif text-lg italic text-[#4a3d1c]">Abrir</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          animate={opening ? { opacity: 0 } : { opacity: [0.45, 1, 0.45] }}
          transition={opening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity }}
          className="mt-7 text-center text-[11px] uppercase tracking-[0.35em] text-olive/70"
        >
          Toca para abrir
        </motion.p>
      </motion.button>


      <span className="sr-only">Invitación de {WEDDING.coupleLabel}</span>
    </motion.div>
  )
}
