import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { CalendarDays, Check } from 'lucide-react'
import { resolveTheme } from '../../designer/catalog'
import { LABEL, prefersReducedMotion, tint } from '../../designer/style'
import { useGoogleFonts } from '../../hooks/useGoogleFonts'
import { Splash } from './Splashes'

gsap.registerPlugin(SplitText)

// Invitación de muestra que se pinta entera desde la configuración del
// diseñador. Vive dentro de su propio contenedor con scroll, así sirve igual
// dentro del marco de celular que a pantalla completa. Las aperturas están en
// Splashes.jsx y se animan con GSAP.

export function DemoInvitation({ config, uploadedPhoto, className = '' }) {
  const t = resolveTheme(config, uploadedPhoto)
  const [opened, setOpened] = useState(config.splash === 'ninguno')
  const [revealed, setRevealed] = useState(opened)
  const heroRef = useRef(null)
  useGoogleFonts([t.fontGoogle])

  // Entrada de la portada cuando la apertura la deja ver: la foto se enfoca
  // y los nombres aparecen letra por letra.
  useLayoutEffect(() => {
    if (!revealed || prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(heroRef)
      const names = new SplitText(q('[data-a=hero-names]'), { type: 'words,chars' })
      gsap
        .timeline()
        .from(q('[data-a=hero-photo]'), { scale: 1.15, filter: 'blur(6px)', duration: 2.2, ease: 'expo.out' })
        .from(names.chars, { autoAlpha: 0, yPercent: 70, rotation: 6, filter: 'blur(6px)', stagger: 0.04, duration: 0.9, ease: 'power3.out' }, 0.25)
        .from(q('[data-a=hero-cta]'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' }, 0.9)
    }, heroRef)
    return () => ctx.revert()
  }, [revealed])

  const display = { fontFamily: t.fontCss }
  const props = { t, config, display }
  const Hero = { arco: ArchHero, editorial: EditorialHero }[config.hero] || FullHero

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: t.ground, color: t.ink }}>
      <div className="h-full overflow-y-auto overscroll-contain">
        <div ref={heroRef} className="h-full">
          <Hero {...props} />
        </div>
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

      {!opened && <Splash {...props} onReveal={() => setRevealed(true)} onDone={() => setOpened(true)} />}
    </div>
  )
}

/* ---------- Portadas ---------- */

function Names({ t, config, display, className = '', style }) {
  return (
    <h1 data-a="hero-names" className={`text-6xl leading-none ${className}`} style={{ ...display, ...style }}>
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
    <div data-a="hero-cta" className="flex w-full max-w-xs gap-2.5">
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
      data-a="hero-photo"
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
        <div className="absolute inset-0 overflow-hidden rounded-t-full">
          <Photo {...props} className="absolute inset-0" />
        </div>
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
        <h1 data-a="hero-names" className="text-[64px] leading-[0.9]" style={display}>
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
