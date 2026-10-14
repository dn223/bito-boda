import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'
import { LABEL, prefersReducedMotion, tint, wax } from '../../designer/style'

gsap.registerPlugin(DrawSVGPlugin, SplitText)

// Aperturas de la invitación de muestra, animadas con GSAP. Cada una tiene una
// entrada en reposo y una secuencia al tocar. `onReveal` avisa cuando la
// portada ya puede empezar su entrada; `onDone` cuando la apertura terminó.

export function Splash(props) {
  if (props.config.splash === 'cortina') return <CurtainSplash {...props} />
  if (props.config.splash === 'monograma') return <MonogramSplash {...props} />
  return <EnvelopeSplash {...props} />
}

// Monta una escena GSAP acotada al contenedor y la deshace al desmontar.
function useScene(root, build) {
  const scene = useRef({})
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      scene.current = build(gsap.utils.selector(root)) || {}
    }, root)
    return () => ctx.revert()
    // La escena se arma una vez por montaje; el diseñador remonta al cambiar de apertura.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return scene
}

// Primera vez que se toca: corre la secuencia, o salta directo si el
// dispositivo pide menos movimiento.
function once(run, { onReveal, onDone }) {
  let started = false
  return () => {
    if (started) return
    started = true
    if (prefersReducedMotion()) {
      onReveal()
      onDone()
      return
    }
    run()
  }
}

const revealChars = () => ({
  autoAlpha: 0,
  yPercent: 60,
  filter: 'blur(8px)',
  stagger: 0.035,
  duration: 0.9,
  ease: 'power3.out',
})

function OpenButton({ scene, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => scene.current.open?.()}
      className="absolute inset-0 z-40 cursor-pointer focus-visible:outline-none"
    />
  )
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

/* ---------- Pétalos ---------- */

const PETALS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 9 + ((i * 7) % 9),
  tone: i % 4,
}))

function Petals({ t }) {
  const tones = [t.accent, t.line, tint(t.accent, 55, 'white'), tint(t.primary, 35, 'white')]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          data-a="petal"
          className="absolute -top-6 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.35,
            backgroundColor: tones[p.tone],
            borderRadius: '80% 0 80% 0',
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

// Lluvia de pétalos que caen girando; dura unos 3 segundos.
function fallPetals(q, height) {
  const tl = gsap.timeline()
  q('[data-a=petal]').forEach((el, i) => {
    const at = i * 0.05
    tl.set(el, { opacity: 0.95, rotation: gsap.utils.random(0, 360) }, at).to(
      el,
      {
        y: height + 60,
        x: gsap.utils.random(-80, 80),
        rotation: `+=${gsap.utils.random(200, 600)}`,
        rotationX: gsap.utils.random(-180, 180),
        duration: gsap.utils.random(2.2, 3.4),
        ease: 'sine.in',
      },
      at,
    )
  })
  return tl
}

/* ---------- Sobre con lacre ---------- */

const SEAL_HALVES = {
  l: 'polygon(0 0, 54% 0, 46% 35%, 56% 62%, 48% 100%, 0 100%)',
  r: 'polygon(54% 0, 100% 0, 100% 100%, 48% 100%, 56% 62%, 46% 35%)',
}

function EnvelopeSplash({ t, config, display, onReveal, onDone }) {
  const root = useRef(null)
  const scene = useScene(root, (q) => {
    const names = new SplitText(q('[data-a=names]'), { type: 'words,chars' })

    gsap
      .timeline({ delay: 0.15 })
      .from(q('[data-a=env]'), { y: 60, rotation: -4, autoAlpha: 0, duration: 1.2, ease: 'expo.out' })
      .from(q('[data-a=kicker]'), { autoAlpha: 0, y: 10, duration: 0.6 }, 0.3)
      .from(names.chars, revealChars(), 0.45)
      .from(q('[data-a=flourish-path]'), { drawSVG: '50% 50%', duration: 1.3, ease: 'power2.inOut' }, 0.9)
      .from(q('[data-a=hint]'), { autoAlpha: 0, duration: 0.6 }, 1.5)

    const idle = gsap.to(q('[data-a=seal]'), { scale: 1.06, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    const pulse = gsap.to(q('[data-a=hint]'), { opacity: 0.45, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.1 })

    const open = once(
      () => {
        idle.kill()
        pulse.kill()
        gsap.set(root.current, { pointerEvents: 'none' })
        const height = root.current.offsetHeight
        const card = q('[data-a=card]')[0]
        let from
        let to

        gsap
          .timeline({ onComplete: onDone })
          .to(q('[data-a=hint],[data-a=kicker],[data-a=names],[data-a=flourish]'), { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power1.in' })
          .to(q('[data-a=seal]'), { scale: 1.12, duration: 0.18, ease: 'power1.out' }, 0)
          .to(q('[data-a=seal-l]'), { x: -34, y: 70, rotation: -40, autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, 0.18)
          .to(q('[data-a=seal-r]'), { x: 34, y: 70, rotation: 40, autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, 0.18)
          .to(q('[data-a=flap]'), { rotationX: 180, duration: 0.95, ease: 'power2.inOut' }, 0.45)
          .set(q('[data-a=flap]'), { zIndex: 1 }, 0.92)
          .to(card, { yPercent: -62, duration: 1.05, ease: 'power3.out' }, 1.3)
          .add(fallPetals(q, height), 1.35)
          .to(q('[data-a=env-back],[data-a=env-body],[data-a=flap]'), { y: height * 0.7, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 2.35)
          .to(q('[data-a=card-content]'), { autoAlpha: 0, duration: 0.35 }, 2.45)
          .add(() => {
            from = card.getBoundingClientRect()
            to = root.current.getBoundingClientRect()
          }, 2.5)
          // La tarjeta crece hasta cubrir la pantalla y se convierte en la invitación.
          .to(
            card,
            {
              x: () => to.left + to.width / 2 - (from.left + from.width / 2),
              y: () => to.top + to.height / 2 - (from.top + from.height / 2),
              scaleX: () => to.width / from.width + 0.04,
              scaleY: () => to.height / from.height + 0.04,
              borderRadius: 0,
              duration: 1,
              ease: 'expo.inOut',
            },
            2.5,
          )
          .add(onReveal, 3.3)
          .to(q('[data-a=stage]'), { autoAlpha: 0, duration: 0.7, ease: 'power1.inOut' }, 3.35)
      },
      { onReveal, onDone },
    )
    return { open }
  })

  const paper = tint(t.ground, 55, 'white')

  return (
    <div ref={root} className="absolute inset-0 z-30 overflow-hidden">
      <div data-a="stage" className="absolute inset-0" style={{ backgroundColor: t.ground }}>
        <div className="absolute inset-x-0 top-[9%] flex flex-col items-center px-6 text-center">
          <p data-a="kicker" className={LABEL} style={{ color: t.primary }}>
            La boda de
          </p>
          <p data-a="names" className="mt-3 text-5xl leading-none" style={{ ...display, color: t.ink }}>
            {config.nameA} <span style={{ color: t.accent }}>&amp;</span> {config.nameB}
          </p>
          <svg data-a="flourish" aria-hidden viewBox="0 0 220 24" className="mt-4 h-6 w-48" fill="none">
            <path
              data-a="flourish-path"
              d="M4 12 C 40 2, 70 22, 110 12 S 180 2, 216 12"
              stroke={t.line}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div data-a="env" className="absolute left-[7%] right-[7%] top-[40%] aspect-[10/7]" style={{ perspective: 1200 }}>
          <div data-a="env-back" className="absolute inset-0 rounded-md" style={{ backgroundColor: tint(t.primary, 72, 'black') }} />

          <div
            data-a="card"
            className="absolute left-[6%] right-[6%] top-[8%] z-[2] h-[84%] rounded-md"
            style={{ backgroundColor: paper, boxShadow: `inset 0 0 0 1px ${tint(t.line, 60)}` }}
          >
            <div data-a="card-content" className="flex h-full flex-col items-center justify-start pt-[8%] text-center">
              <span className="text-[9px] font-medium uppercase tracking-[0.35em]" style={{ color: t.primary }}>
                Nos casamos
              </span>
              <span className="mt-2 flex items-center" style={{ ...display, color: t.primary }}>
                <Initials t={t} big="text-4xl" small="text-xl" />
              </span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.22em]" style={{ color: t.ink }}>
                {config.date}
              </span>
            </div>
          </div>

          <div data-a="env-body" className="absolute inset-0 z-[3]" style={{ filter: 'drop-shadow(0 -2px 6px rgba(0,0,0,0.18))' }}>
            <div className="absolute inset-0 rounded-md" style={{ backgroundColor: t.primary, clipPath: 'polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)' }} />
            <div className="absolute inset-0" style={{ backgroundColor: tint(t.primary, 88, 'black'), clipPath: 'polygon(0 0, 50% 52%, 0 100%)' }} />
            <div className="absolute inset-0" style={{ backgroundColor: tint(t.primary, 88, 'black'), clipPath: 'polygon(100% 0, 50% 52%, 100% 100%)' }} />
            <div className="absolute inset-0" style={{ backgroundColor: tint(t.primary, 92, 'white'), clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)' }} />
          </div>

          <div
            data-a="flap"
            className="absolute inset-x-0 top-0 z-[4] h-[58%] origin-top"
            style={{ transformStyle: 'preserve-3d', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.25))' }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: t.line, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
            <div className="absolute inset-0" style={{ backgroundColor: t.primary, clipPath: 'polygon(0 0, 100% 0, 50% 96%)' }} />
          </div>

          <div
            data-a="seal"
            className="absolute left-1/2 top-[58%] z-[5] h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2"
            style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))' }}
          >
            {['l', 'r'].map((side) => (
              <div
                key={side}
                data-a={`seal-${side}`}
                className="absolute inset-0 flex items-center justify-center rounded-full"
                style={{
                  background: wax(t.seal),
                  clipPath: SEAL_HALVES[side],
                  boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.25)',
                }}
              >
                <span
                  className="flex h-[58px] w-[58px] items-center justify-center rounded-full border"
                  style={{ ...display, borderColor: 'rgba(0,0,0,0.2)', color: tint(t.seal, 35, 'black') }}
                >
                  <Initials t={t} big="text-2xl" small="text-sm" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <p data-a="hint" className={`absolute inset-x-0 bottom-[8%] text-center ${LABEL}`} style={{ color: t.primary }}>
          Toca el sobre para abrir
        </p>
      </div>
      <Petals t={t} />
      <OpenButton scene={scene} label="Abrir la invitación" />
    </div>
  )
}

/* ---------- Cortina ---------- */

const FABRIC =
  'repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 20px, rgba(255,255,255,0.07) 20px 24px, transparent 24px 42px)'

function CurtainSplash({ t, config, display, onReveal, onDone }) {
  const root = useRef(null)
  const scene = useScene(root, (q) => {
    const names = new SplitText(q('[data-a=names]'), { type: 'words,chars' })

    gsap
      .timeline({ delay: 0.15 })
      .from(q('[data-a=ring]'), { drawSVG: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.15 }, 0.1)
      .from(q('[data-a=mono]'), { autoAlpha: 0, scale: 0.85, duration: 1, ease: 'expo.out' }, 0.5)
      .from(names.chars, revealChars(), 0.8)
      .from(q('[data-a=kicker],[data-a=date]'), { autoAlpha: 0, y: 8, duration: 0.6 }, 1.2)
      .from(q('[data-a=hint]'), { autoAlpha: 0, duration: 0.6 }, 1.6)

    // Vaivén muy leve de la tela mientras espera.
    const sway = gsap.to(q('[data-panel]'), { skewY: 0.5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    const open = once(
      () => {
        sway.kill()
        gsap.set(root.current, { pointerEvents: 'none' })
        gsap
          .timeline({ onComplete: onDone })
          .to(q('[data-a=center]'), { scale: 1.08, autoAlpha: 0, duration: 0.6, ease: 'power2.in' })
          .to(q('[data-a=panel-l]'), { scaleX: 0.06, skewY: -3, duration: 1.5, ease: 'power4.inOut' }, 0.35)
          .to(q('[data-a=panel-r]'), { scaleX: 0.06, skewY: 3, duration: 1.5, ease: 'power4.inOut' }, 0.35)
          .add(onReveal, 0.6)
          .add(fallPetals(q, root.current.offsetHeight), 0.6)
          .to(q('[data-panel]'), { autoAlpha: 0, duration: 0.5 }, 1.6)
      },
      { onReveal, onDone },
    )
    return { open }
  })

  const panel = { backgroundColor: t.primary, backgroundImage: FABRIC }

  return (
    <div ref={root} className="absolute inset-0 z-30 overflow-hidden">
      <div data-a="panel-l" data-panel className="absolute inset-y-0 left-0 w-1/2 origin-left" style={panel} />
      <div data-a="panel-r" data-panel className="absolute inset-y-0 right-0 w-1/2 origin-right" style={panel} />
      <div
        data-a="center"
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ color: t.ground }}
      >
        <span data-a="kicker" className={`${LABEL} opacity-85`}>
          Nos casamos
        </span>
        <div className="relative mt-8 h-44 w-44">
          <svg aria-hidden viewBox="0 0 176 176" className="absolute inset-0 h-full w-full" fill="none">
            <circle data-a="ring" cx="88" cy="88" r="86" stroke={t.line} strokeWidth="1.2" />
            <circle data-a="ring" cx="88" cy="88" r="78" stroke={t.line} strokeWidth="0.8" opacity="0.6" />
          </svg>
          <span
            data-a="mono"
            className="absolute inset-[18px] flex items-center justify-center rounded-full"
            style={{ ...display, backgroundColor: t.primary }}
          >
            <Initials t={t} big="text-5xl" small="text-2xl" />
          </span>
        </div>
        <span data-a="names" className="mt-9 text-4xl leading-tight" style={display}>
          {config.nameA} &amp; {config.nameB}
        </span>
        <span data-a="date" className="mt-3 text-xs uppercase tracking-[0.3em] opacity-85">
          {config.date}
        </span>
        <span data-a="hint" className={`${LABEL} mt-14 opacity-85`}>
          Toca para abrir
        </span>
      </div>
      <Petals t={t} />
      <OpenButton scene={scene} label="Abrir la invitación" />
    </div>
  )
}

/* ---------- Monograma ---------- */

function MonogramSplash({ t, config, display, onReveal, onDone }) {
  const root = useRef(null)
  const scene = useScene(root, (q) => {
    const names = new SplitText(q('[data-a=names]'), { type: 'words,chars' })

    gsap
      .timeline({ delay: 0.15 })
      .from(q('[data-a=ring]'), { drawSVG: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.2 })
      .from(q('[data-a=mono]'), { autoAlpha: 0, scale: 0.6, filter: 'blur(10px)', duration: 1.1, ease: 'expo.out' }, 0.6)
      .from(names.chars, revealChars(), 1)
      .from(q('[data-a=date]'), { autoAlpha: 0, y: 8, duration: 0.6 }, 1.4)
      .from(q('[data-a=hint]'), { autoAlpha: 0, duration: 0.6 }, 1.8)

    const pulse = gsap.to(q('[data-a=hint]'), { opacity: 0.4, duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.4 })

    const open = once(
      () => {
        pulse.kill()
        gsap.set(root.current, { pointerEvents: 'none' })
        gsap
          .timeline({ onComplete: onDone })
          .to(q('[data-a=names],[data-a=date],[data-a=hint]'), { autoAlpha: 0, y: -12, duration: 0.45, stagger: 0.05, ease: 'power1.in' })
          .to(q('[data-a=mono]'), { scale: 1.3, autoAlpha: 0, filter: 'blur(8px)', duration: 0.7, ease: 'power2.in' }, 0.1)
          // Los aros se abren como un iris y dejan ver la portada.
          .to(q('[data-a=iris]'), { scale: 7, autoAlpha: 0, duration: 1.3, ease: 'expo.in' }, 0.25)
          .to(q('[data-a=bg]'), { autoAlpha: 0, duration: 0.9, ease: 'power1.inOut' }, 0.9)
          .add(onReveal, 0.95)
          .add(fallPetals(q, root.current.offsetHeight), 0.9)
      },
      { onReveal, onDone },
    )
    return { open }
  })

  return (
    <div ref={root} className="absolute inset-0 z-30 overflow-hidden">
      <div data-a="bg" className="absolute inset-0" style={{ backgroundColor: t.ground }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center" style={{ color: t.ink }}>
        <div className="relative h-52 w-52">
          <svg data-a="iris" aria-hidden viewBox="0 0 208 208" className="absolute inset-0 h-full w-full" fill="none">
            <circle data-a="ring" cx="104" cy="104" r="102" stroke={t.line} strokeWidth="1.2" />
            <circle data-a="ring" cx="104" cy="104" r="93" stroke={t.line} strokeWidth="0.8" opacity="0.55" />
          </svg>
          <span data-a="mono" className="absolute inset-0 flex items-center justify-center" style={{ ...display, color: t.primary }}>
            <Initials t={t} big="text-6xl" small="text-3xl" />
          </span>
        </div>
        <span data-a="names" className="mt-10 text-4xl leading-tight" style={display}>
          {config.nameA} &amp; {config.nameB}
        </span>
        <span data-a="date" className="mt-3 text-xs uppercase tracking-[0.3em] opacity-75">
          {config.date}
        </span>
        <span data-a="hint" className={`${LABEL} mt-14`} style={{ color: t.primary }}>
          Toca para entrar
        </span>
      </div>
      <Petals t={t} />
      <OpenButton scene={scene} label="Entrar a la invitación" />
    </div>
  )
}
