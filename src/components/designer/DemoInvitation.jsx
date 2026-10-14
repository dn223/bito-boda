import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check } from 'lucide-react'
import { resolveTheme } from '../../designer/catalog'
import { useGoogleFonts } from '../../hooks/useGoogleFonts'

// Invitación de muestra que se pinta entera desde la configuración del
// diseñador. Vive dentro de su propio contenedor con scroll, así sirve igual
// dentro del marco de celular que a pantalla completa.

const EASE = [0.22, 1, 0.36, 1]
const LABEL = 'text-[11px] font-medium uppercase tracking-[0.38em]'

const wax = (color) =>
  `radial-gradient(circle at 34% 30%, color-mix(in srgb, ${color} 45%, white), ${color} 48%, color-mix(in srgb, ${color} 62%, black))`
const tint = (color, amount, base = 'transparent') => `color-mix(in srgb, ${color} ${amount}%, ${base})`

export function DemoInvitation({ config, uploadedPhoto, className = '' }) {
  const t = resolveTheme(config, uploadedPhoto)
  const [opened, setOpened] = useState(config.splash === 'ninguno')
  useGoogleFonts([t.fontGoogle])

  const display = { fontFamily: t.fontCss }
  const props = { t, config, display }
  const Hero = { arco: ArchHero, editorial: EditorialHero }[config.hero] || FullHero

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: t.ground, color: t.ink }}>
      <div className="h-full overflow-y-auto overscroll-contain">
        <Hero {...props} />
        <SaveTheDate {...props} />
        <RsvpSample {...props} />
        <footer className="px-6 py-12 text-center" style={{ backgroundColor: t.primary, color: t.ground }}>
          <p className="text-4xl" style={display}>
            {config.nameA} &amp; {config.nameB}
          </p>
          <div className="mx-auto my-4 h-px w-20" style={{ backgroundColor: t.line }} />
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-85">{config.place}</p>
        </footer>
      </div>

      <AnimatePresence>
        {!opened && <Splash key="splash" {...props} onOpen={() => setOpened(true)} />}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Aperturas ---------- */

function Splash({ config, ...props }) {
  if (config.splash === 'cortina') return <CurtainSplash config={config} {...props} />
  if (config.splash === 'monograma') return <MonogramSplash config={config} {...props} />
  return <EnvelopeSplash config={config} {...props} />
}

function Initials({ t, big = 'text-3xl', small = 'text-base' }) {
  return (
    <>
      <span className={`${big} italic leading-none`}>{t.initials[0]}</span>
      <span className={`${small} mx-0.5 italic leading-none`}>&amp;</span>
      <span className={`${big} italic leading-none`}>{t.initials[1]}</span>
    </>
  )
}

function EnvelopeSplash({ t, config, display, onOpen }) {
  const [opening, setOpening] = useState(false)
  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 1300)
  }
  const fold = tint(t.ground, 86, t.ink)

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ backgroundColor: t.ground, perspective: 1400 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: fold, clipPath: 'polygon(0 0, 52% 58%, 0 100%)' }} />
      <div aria-hidden className="absolute inset-0" style={{ background: fold, clipPath: 'polygon(100% 0, 48% 58%, 100% 100%)' }} />
      <div aria-hidden className="absolute inset-0" style={{ background: tint(t.ground, 93, t.ink), clipPath: 'polygon(0 100%, 50% 51%, 100% 100%)' }} />

      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[58.4%] origin-top"
        style={{ filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.28))' }}
        animate={{ rotateX: opening ? -172 : 0 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute inset-0" style={{ background: t.line, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <div className="absolute inset-0" style={{ background: t.primary, clipPath: 'polygon(0 0, 100% 0, 50% 98%)' }} />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-[10%] flex flex-col items-center px-6 text-center"
        style={{ color: t.ground }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className={`${LABEL} opacity-85`}>La boda de</p>
        <p className="mt-3 text-5xl italic leading-none" style={display}>
          {config.nameA} <span style={{ color: t.line }}>&amp;</span> {config.nameB}
        </p>
      </motion.div>

      <div className="absolute left-1/2 top-[58.4%] z-10 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          type="button"
          onClick={open}
          aria-label="Abrir la invitación"
          className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full"
          style={{
            background: wax(t.seal),
            boxShadow: '0 10px 20px rgba(30,25,10,0.38), inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.25)',
          }}
          animate={opening ? { scale: 0.7, opacity: 0, rotate: -15 } : { scale: 1, opacity: 1, rotate: 0 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.45 }}
        >
          <span
            className="flex h-[74px] w-[74px] items-center justify-center rounded-full border"
            style={{ ...display, borderColor: 'rgba(0,0,0,0.22)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)', color: tint(t.seal, 35, 'black') }}
          >
            <Initials t={t} />
          </span>
        </motion.button>
      </div>

      <motion.p
        className={`absolute inset-x-0 bottom-[9%] text-center ${LABEL}`}
        style={{ color: t.primary }}
        animate={opening ? { opacity: 0 } : { opacity: [0.5, 1, 0.5] }}
        transition={opening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity }}
      >
        Toca el sello para abrir
      </motion.p>
    </motion.div>
  )
}

function CurtainSplash({ t, config, display, onOpen }) {
  const [opening, setOpening] = useState(false)
  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 1050)
  }
  const panel = { backgroundColor: t.primary }

  return (
    <motion.div className="absolute inset-0 z-30 overflow-hidden" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ ...panel, boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.14)' }}
        animate={{ x: opening ? '-100%' : '0%' }}
        transition={{ duration: 1, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ ...panel, boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.12)' }}
        animate={{ x: opening ? '100%' : '0%' }}
        transition={{ duration: 1, ease: EASE }}
      />
      <motion.button
        type="button"
        onClick={open}
        aria-label="Abrir la invitación"
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center px-6 text-center"
        style={{ color: t.ground }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className={`${LABEL} opacity-85`}>Nos casamos</span>
        <span
          className="mt-8 flex h-36 w-36 items-center justify-center rounded-full border"
          style={{ ...display, borderColor: t.line, backgroundColor: t.primary, boxShadow: `0 0 0 8px ${t.primary}, 0 0 0 9px ${tint(t.line, 60)}` }}
        >
          <Initials t={t} big="text-5xl" small="text-2xl" />
        </span>
        <span className="mt-9 text-4xl leading-tight" style={display}>
          {config.nameA} &amp; {config.nameB}
        </span>
        <span className="mt-3 text-xs uppercase tracking-[0.3em] opacity-85">{config.date}</span>
        <span className={`${LABEL} mt-14 animate-pulse opacity-85`}>Toca para abrir</span>
      </motion.button>
    </motion.div>
  )
}

function MonogramSplash({ t, config, display, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Entrar a la invitación"
      className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center px-8 text-center"
      style={{ backgroundColor: t.ground, color: t.ink }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="relative flex h-48 w-48 items-center justify-center rounded-full border" style={{ borderColor: t.line }}>
        <span aria-hidden className="absolute inset-2 rounded-full border opacity-50" style={{ borderColor: t.line }} />
        <span className="flex items-center" style={{ ...display, color: t.primary }}>
          <Initials t={t} big="text-6xl" small="text-3xl" />
        </span>
      </span>
      <span className="mt-10 text-4xl leading-tight" style={display}>
        {config.nameA} &amp; {config.nameB}
      </span>
      <span className="mt-3 text-xs uppercase tracking-[0.3em] opacity-75">{config.date}</span>
      <span className={`${LABEL} mt-14 animate-pulse`} style={{ color: t.primary }}>
        Toca para entrar
      </span>
    </motion.button>
  )
}

/* ---------- Portadas ---------- */

function Names({ t, config, display, className = '', style }) {
  return (
    <h1 className={`text-6xl leading-none ${className}`} style={{ ...display, ...style }}>
      {config.nameA}
      <span className="mx-3 text-4xl italic" style={{ color: t.accent }}>
        &amp;
      </span>
      {config.nameB}
    </h1>
  )
}

function CtaButtons({ t }) {
  return (
    <div className="flex w-full max-w-xs gap-2.5">
      <a
        href="#demo-rsvp"
        className="flex h-12 flex-[3] items-center justify-center rounded-full text-sm font-medium shadow-lg"
        style={{ backgroundColor: t.primary, color: t.ground }}
      >
        Confirmar asistencia
      </a>
      <a
        href="#demo-fecha"
        className="flex h-12 flex-[2] items-center justify-center rounded-full border text-sm font-medium"
        style={{ color: t.ink, borderColor: tint(t.ink, 22), backgroundColor: tint(t.ground, 70) }}
      >
        Detalles
      </a>
    </div>
  )
}

function Photo({ t, config, className = '' }) {
  return (
    <img
      src={t.photo.src}
      alt={`${config.nameA} y ${config.nameB}`}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: t.photo.position }}
    />
  )
}

// La misma idea que la portada de Bito & Coni: la foto ocupa todo el inicio.
function FullHero(props) {
  const { t, config } = props
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden">
      <Photo {...props} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: `linear-gradient(to top, ${t.ground}, ${tint(t.ground, 55)} 55%, transparent)` }}
      />
      <p className={`absolute inset-x-4 top-[9%] text-center text-white ${LABEL}`} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}>
        {config.date}
      </p>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-10 text-center">
        <Names {...props} style={{ textShadow: `0 2px 16px ${t.ground}` }} />
        <div className="mb-7 mt-5 h-px w-40" style={{ background: `linear-gradient(to right, transparent, ${t.line}, transparent)` }} />
        <CtaButtons t={t} />
      </div>
    </section>
  )
}

function ArchHero(props) {
  const { t, config } = props
  return (
    <section className="flex h-full min-h-[600px] flex-col px-6 pb-8 pt-7">
      <p className={`text-center ${LABEL}`} style={{ color: t.primary }}>
        Nos casamos
      </p>
      <div className="relative mx-2.5 mt-6 min-h-0 flex-1">
        <div aria-hidden className="absolute -inset-2.5 bottom-0 rounded-t-full border border-b-0" style={{ borderColor: t.line }} />
        <Photo {...props} className="absolute inset-0 rounded-t-full" />
      </div>
      <Names {...props} className="mt-6 text-center" />
      <p className="mt-4 text-center text-xs uppercase tracking-[0.28em] opacity-75">{config.date}</p>
      <div className="mt-6 flex justify-center">
        <CtaButtons t={t} />
      </div>
    </section>
  )
}

function EditorialHero(props) {
  const { t, config, display } = props
  return (
    <section className="flex h-full min-h-[600px] flex-col">
      <div className="relative min-h-0 flex-[1.4] overflow-hidden rounded-b-[40px]">
        <Photo {...props} className="absolute inset-0" />
        <p className={`absolute left-6 top-6 text-white ${LABEL}`} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}>
          Nos casamos
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-center px-7 py-6">
        <h1 className="text-[64px] leading-[0.9]" style={display}>
          {config.nameA}
          <br />
          <span className="text-4xl italic" style={{ color: t.accent }}>
            &amp;
          </span>{' '}
          {config.nameB}
        </h1>
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1" style={{ backgroundColor: t.line }} />
          <span className="text-[11px] uppercase tracking-[0.26em]">{config.date}</span>
        </div>
        <div className="mt-6">
          <CtaButtons t={t} />
        </div>
      </div>
    </section>
  )
}

/* ---------- Secciones de muestra ---------- */

function SaveTheDate({ t, config, display }) {
  return (
    <section id="demo-fecha" className="px-6 py-16 text-center">
      <p className={LABEL} style={{ color: t.primary }}>
        Guarda la fecha
      </p>
      <p className="mt-4 text-4xl leading-tight" style={display}>
        {config.date}
      </p>
      <div className="mx-auto my-7 h-px w-24" style={{ backgroundColor: t.line }} />
      <p className="text-xs uppercase tracking-[0.3em] opacity-70">El lugar</p>
      <p className="mt-2 text-3xl" style={display}>
        {config.place}
      </p>
      <span
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-medium"
        style={{ borderColor: tint(t.ink, 22) }}
      >
        <CalendarDays className="h-4 w-4" />
        Agregar al calendario
      </span>
    </section>
  )
}

function RsvpSample({ t, display }) {
  const [going, setGoing] = useState({ 'Invitado 1': true, 'Invitado 2': false })
  const count = Object.values(going).filter(Boolean).length

  return (
    <section id="demo-rsvp" className="px-5 pb-16">
      <div
        className="mx-auto max-w-sm rounded-3xl border p-7 text-center"
        style={{ borderColor: tint(t.ink, 12), backgroundColor: tint(t.ground, 40, 'white') }}
      >
        <p className={LABEL} style={{ color: t.primary }}>
          R.S.V.P.
        </p>
        <p className="mt-3 text-4xl" style={display}>
          ¿Nos acompañas?
        </p>
        <ul className="mt-6 space-y-2 text-left">
          {Object.keys(going).map((name) => (
            <li key={name}>
              <button
                type="button"
                aria-pressed={going[name]}
                onClick={() => setGoing((prev) => ({ ...prev, [name]: !prev[name] }))}
                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3"
                style={{ borderColor: going[name] ? tint(t.primary, 45) : tint(t.ink, 12) }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px]"
                  style={{ borderColor: t.primary, backgroundColor: going[name] ? t.primary : 'transparent' }}
                >
                  {going[name] && <Check className="h-3.5 w-3.5" style={{ color: t.ground }} strokeWidth={3} />}
                </span>
                <span className="text-xl" style={display}>
                  {name}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <span
          className="mt-6 flex h-12 items-center justify-center rounded-full text-sm font-medium"
          style={{ backgroundColor: count ? t.primary : 'transparent', color: count ? t.ground : t.primary, border: `1px solid ${t.primary}` }}
        >
          {count ? `Confirmar ${count} ${count === 1 ? 'asistente' : 'asistentes'}` : 'No podremos asistir'}
        </span>
      </div>
    </section>
  )
}
