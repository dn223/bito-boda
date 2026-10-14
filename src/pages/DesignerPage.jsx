import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Copy, Eye, Plus, RefreshCw } from 'lucide-react'
import { DemoInvitation } from '../components/designer/DemoInvitation'
import { Input } from '../components/ui/Input'
import {
  DEFAULT_CONFIG,
  FONTS,
  HEROES,
  PALETTES,
  PHOTOS,
  SEALS,
  SPLASHES,
  decodeConfig,
  encodeConfig,
} from '../designer/catalog'
import { useGoogleFonts } from '../hooks/useGoogleFonts'

// Diseñador de invitaciones para mostrar a futuras parejas. Es independiente
// de la invitación de Bito & Coni: no lee Firestore ni usa sus componentes.
export default function DesignerPage() {
  const [params, setParams] = useSearchParams()
  const [config, setConfig] = useState(() => decodeConfig(params.get('c')))
  const [uploaded, setUploaded] = useState(null)
  const [replay, setReplay] = useState(0)
  const [toast, setToast] = useState(null)
  useGoogleFonts(FONTS.map((f) => f.google))

  const code = useMemo(() => encodeConfig(config), [config])
  const demoUrl = `/disenador/vista?c=${code}`

  // El link de la página siempre refleja el diseño: recargar no pierde nada.
  useEffect(() => {
    setParams({ c: code }, { replace: true })
  }, [code, setParams])

  useEffect(() => {
    document.title = 'Diseñador de invitaciones'
  }, [])

  useEffect(() => () => uploaded && URL.revokeObjectURL(uploaded), [uploaded])

  const set = (patch) => setConfig((prev) => ({ ...prev, ...patch }))
  const setText = (key) => (e) => set({ [key]: e.target.value })
  const setCustom = (key) => (e) =>
    setConfig((prev) => ({ ...prev, palette: 'custom', custom: { ...prev.custom, [key]: e.target.value } }))

  const notify = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2400)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${demoUrl}`)
    notify(uploaded ? 'Link copiado · la foto subida no viaja en el link' : 'Link copiado')
  }

  const pickPhoto = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploaded(URL.createObjectURL(file))
  }

  const reset = () => {
    setConfig(DEFAULT_CONFIG)
    setUploaded(null)
    setReplay((n) => n + 1)
  }

  return (
    <div className="min-h-screen bg-[#f5f2ec] text-ink">
      <header className="border-b border-linen-deep/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-olive">Diseñador</p>
            <h1 className="font-serif text-3xl leading-tight">Crea tu invitación</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={() => setReplay((n) => n + 1)} icon={RefreshCw}>
              Repetir apertura
            </ToolButton>
            <ToolButton as={Link} to={demoUrl} target="_blank" rel="noopener" icon={Eye}>
              Pantalla completa
            </ToolButton>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full bg-olive px-5 py-2.5 text-sm font-medium text-linen shadow-md shadow-olive/30 transition hover:bg-olive-deep"
            >
              <Copy className="h-4 w-4" />
              Copiar link
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row-reverse lg:items-start">
        <section aria-label="Vista previa" className="lg:sticky lg:top-6 lg:flex-1">
          <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[44px] border-[10px] border-ink bg-ink shadow-2xl">
            <DemoInvitation
              key={`${replay}-${config.splash}`}
              config={config}
              uploadedPhoto={uploaded}
              className="h-[min(780px,74svh)]"
            />
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            Toca la vista previa como lo haría un invitado.
          </p>
        </section>

        <div className="space-y-4 lg:w-[440px] lg:shrink-0">
          <Panel title="Textos">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre 1" value={config.nameA} maxLength={20} onChange={setText('nameA')} />
              <Input label="Nombre 2" value={config.nameB} maxLength={20} onChange={setText('nameB')} />
            </div>
            <Input className="mt-3" label="Fecha" value={config.date} maxLength={40} onChange={setText('date')} />
            <Input className="mt-3" label="Lugar" value={config.place} maxLength={40} onChange={setText('place')} />
          </Panel>

          <Panel title="Apertura">
            <div className="grid grid-cols-2 gap-2">
              {SPLASHES.map((s) => (
                <Choice key={s.id} active={config.splash === s.id} onClick={() => set({ splash: s.id })}>
                  <span className="block font-medium">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{s.hint}</span>
                </Choice>
              ))}
            </div>
            {config.splash === 'sobre' && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Color del lacre</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SEALS.map((seal) => (
                    <button
                      key={seal.id}
                      type="button"
                      aria-label={`Lacre ${seal.name}`}
                      aria-pressed={config.seal === seal.id}
                      onClick={() => set({ seal: seal.id })}
                      className={`h-10 w-10 rounded-full ring-offset-2 transition ${config.seal === seal.id ? 'ring-2 ring-ink' : 'hover:scale-105'}`}
                      style={{ background: `radial-gradient(circle at 34% 30%, color-mix(in srgb, ${seal.color} 45%, white), ${seal.color} 55%)` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Portada">
            <div className="grid grid-cols-3 gap-2">
              {HEROES.map((h) => (
                <Choice key={h.id} active={config.hero === h.id} onClick={() => set({ hero: h.id })}>
                  <HeroThumb id={h.id} />
                  <span className="block text-center text-xs font-medium">{h.name}</span>
                </Choice>
              ))}
            </div>
          </Panel>

          <Panel title="Colores">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PALETTES.map((p) => (
                <Choice key={p.id} active={config.palette === p.id} onClick={() => set({ palette: p.id })}>
                  <span aria-hidden className="mb-1.5 flex">
                    {[p.primary, p.ground, p.accent].map((color) => (
                      <span
                        key={color}
                        className="-ml-1.5 h-6 w-6 rounded-full border-2 border-white first:ml-0"
                        style={{ backgroundColor: color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
                      />
                    ))}
                  </span>
                  <span className="block text-xs font-medium">{p.name}</span>
                </Choice>
              ))}
            </div>
            <div
              className={`mt-3 rounded-xl border p-3 ${config.palette === 'custom' ? 'border-ink' : 'border-dashed border-linen-deep'}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Personalizado</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  ['primary', 'Principal'],
                  ['ground', 'Fondo'],
                  ['accent', 'Acento'],
                ].map(([key, name]) => (
                  <label key={key} className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="color"
                      value={config.custom[key]}
                      onChange={setCustom(key)}
                      className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-linen-deep bg-white p-0.5"
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Letra de títulos">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FONTS.map((f) => (
                <Choice key={f.id} active={config.font === f.id} onClick={() => set({ font: f.id })} className="text-center">
                  <span className="block text-3xl leading-tight" style={{ fontFamily: f.css }}>
                    Aa
                  </span>
                  <span className="block text-xs text-slate-500">{f.name}</span>
                </Choice>
              ))}
            </div>
          </Panel>

          <Panel title="Foto">
            <div className="grid grid-cols-3 gap-2">
              {PHOTOS.map((p) => {
                const active = !uploaded && config.photo === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setUploaded(null)
                      set({ photo: p.id })
                    }}
                    className={`overflow-hidden rounded-xl border-2 transition ${active ? 'border-ink' : 'border-transparent hover:border-ink/30'}`}
                  >
                    <img src={p.src} alt={`Foto de muestra: ${p.name}`} className="h-24 w-full object-cover" style={{ objectPosition: p.position }} />
                  </button>
                )
              })}
              <label
                className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-xs text-slate-600 transition hover:bg-white ${uploaded ? 'border-ink' : 'border-linen-deep'}`}
              >
                <Plus className="h-5 w-5" />
                Subir foto
                <input type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              La foto que subas solo se ve en este dispositivo: no se guarda ni viaja en el link.
            </p>
          </Panel>

          <button
            type="button"
            onClick={reset}
            className="w-full py-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 underline underline-offset-4 hover:text-ink"
          >
            Volver al diseño inicial
          </button>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-linen shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-linen-deep bg-white p-5">
      <h2 className="font-serif text-2xl leading-none text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Choice({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
        active ? 'border-ink bg-[#faf8f4] ring-1 ring-ink' : 'border-linen-deep bg-white hover:border-ink/30'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function ToolButton({ as: Component = 'button', icon: Icon, children, ...props }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-linen-deep bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink/30"
      {...props}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Component>
  )
}

// Miniatura esquemática de cada portada (foto en olivo, texto en gris).
function HeroThumb({ id }) {
  return (
    <span aria-hidden className="mb-2 flex h-20 flex-col overflow-hidden rounded-lg bg-[#efe8dc] p-1.5">
      {id === 'completa' && (
        <span className="flex flex-1 items-end justify-center rounded bg-olive/70 pb-1.5">
          <span className="h-1.5 w-8 rounded-full bg-white/90" />
        </span>
      )}
      {id === 'arco' && (
        <>
          <span className="mx-auto w-3/4 flex-1 rounded-t-full bg-olive/70" />
          <span className="mx-auto mt-1 h-1.5 w-8 rounded-full bg-ink/50" />
        </>
      )}
      {id === 'editorial' && (
        <>
          <span className="flex-[1.4] rounded-b-lg bg-olive/70" />
          <span className="mt-1 h-2 w-10 rounded-full bg-ink/50" />
          <span className="mt-1 h-1 w-6 rounded-full bg-ink/30" />
        </>
      )}
    </span>
  )
}
