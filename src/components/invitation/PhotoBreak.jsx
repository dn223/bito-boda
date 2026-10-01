import { motion } from 'framer-motion'

export function PhotoBreak({
  src,
  alt = 'Bito & Coni',
  caption,
  overlay,
  tall = false,
  objectPosition = 'center',
  softFade = false,
  darkOverlayText = false,
}) {
  return (
    <section className="relative px-0 py-6 sm:py-10">
      <motion.figure
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto overflow-hidden"
      >
        <div
          className={`relative w-full overflow-hidden ${
            tall ? 'h-[72svh] sm:h-[78svh]' : 'h-[58svh] sm:h-[68svh]'
          }`}
        >
          <motion.img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            style={{ objectPosition }}
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-linen to-transparent ${
              softFade ? 'h-10' : 'h-24'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-linen to-transparent ${
              softFade ? 'h-12' : 'h-28'
            }`}
          />

          {overlay && darkOverlayText && (
            // velo claro solo detrás del texto, para que el negro se lea sobre la foto
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white/85 via-white/45 to-transparent" />
          )}

          {overlay && (
            <div className="absolute inset-0 flex items-end justify-center px-6 pb-16 sm:pb-20">
              <p
                className={`max-w-md text-center font-serif text-lg leading-relaxed sm:text-xl ${
                  darkOverlayText
                    ? 'font-medium text-ink'
                    : 'text-baby-powder drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]'
                }`}
              >
                {overlay}
              </p>
            </div>
          )}
        </div>

        {caption && !overlay && (
          <figcaption className="mt-5 px-6 text-center font-serif text-lg italic text-slate-600 sm:text-xl">
            {caption}
          </figcaption>
        )}
      </motion.figure>
    </section>
  )
}
