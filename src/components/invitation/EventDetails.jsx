import { motion } from 'framer-motion'
import { Clock, MapPin, Navigation } from 'lucide-react'
import fincaPhoto from '../../assets/finca.jpg'
import { WEDDING } from '../../mockData/guests'
import { Reveal } from '../ui/Reveal'

export function EventDetails() {
  const event = WEDDING.ceremony

  return (
    <section className="py-10">
      <Reveal className="mb-8 px-4 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-olive">El lugar</p>
        <h2 className="font-serif text-4xl text-ink sm:text-5xl">Ceremonia religiosa</h2>
      </Reveal>

      {/* Foto de la finca a todo el ancho, sin blur y con el degradado del mantel en los bordes */}
      <motion.figure
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        className="relative h-[62svh] w-full overflow-hidden sm:h-[70svh]"
      >
        <motion.img
          src={fincaPhoto}
          loading="lazy"
          decoding="async"
          alt={event.place}
          className="h-full w-full object-cover"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-linen via-linen/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-linen via-linen/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />

        <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-12 text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
            {event.title}
          </p>
          <h3 className="mt-2 font-serif text-4xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
            {event.place}
          </h3>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white">
            <Clock className="h-4 w-4" />
            {event.time}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/95">
            {event.address}
          </p>
        </figcaption>
      </motion.figure>

      {/* Los botones quedan fuera de la foto: hacen de puente con la siguiente sección */}
      <Reveal className="px-6 py-10 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
          Dirección
        </p>
        <div className="flex items-center justify-center gap-3">
        <a
          href={event.wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-dusty-deep px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-strawberry/30 transition hover:-translate-y-0.5 hover:bg-strawberry sm:flex-none sm:px-8"
        >
          <Navigation className="h-4 w-4" />
          Ver en Waze
        </a>
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-dusty-deep px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-strawberry/30 transition hover:-translate-y-0.5 hover:bg-strawberry sm:flex-none sm:px-8"
        >
          <MapPin className="h-4 w-4" />
          Ver en Maps
          </a>
        </div>
      </Reveal>
    </section>
  )
}
