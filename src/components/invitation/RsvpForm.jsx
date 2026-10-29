import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { submitRsvp } from '../../services/guestsApi'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Reveal } from '../ui/Reveal'

// Estado inicial: si la familia ya confirmó, se recupera su respuesta anterior.
function initialPeople(family) {
  const previous = new Set((family.guests || []).map((p) => p.name))
  return (family.members || []).map((name) => ({ name, going: previous.has(name) }))
}

export function RsvpForm({ family, onDone }) {
  const [people, setPeople] = useState(() => initialPeople(family))
  const [phase, setPhase] = useState('form')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const going = people.filter((p) => p.going)

  const toggle = (name) =>
    setPeople((prev) =>
      prev.map((p) => (p.name === name ? { ...p, going: !p.going } : p)),
    )

  // Tras el check de confirmado se abre el resto de la invitación.
  useEffect(() => {
    if (phase !== 'success') return undefined
    const timer = setTimeout(() => {
      setPhase('done')
      onDone?.()
    }, 1600)
    return () => clearTimeout(timer)
  }, [phase, onDone])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await submitRsvp(family.token, {
        guests: going.map(({ name }) => name),
      })
      setPhase('success')
    } catch (err) {
      setError(err.message || 'No se pudo guardar la confirmación')
    } finally {
      setSaving(false)
    }
  }

  if (phase === 'success') {
    return (
      <Reveal>
        <Card floral className="mx-auto max-w-lg p-12 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage/40 text-sage-deep"
          >
            <Check className="h-10 w-10" strokeWidth={2.5} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-6 font-serif text-3xl text-ink sm:text-4xl"
          >
            {going.length > 0 ? '¡Respuesta recibida!' : 'Respuesta registrada'}
          </motion.p>
        </Card>
      </Reveal>
    )
  }

  if (phase === 'done') {
    return (
      <Reveal>
        <Card floral className="mx-auto max-w-lg overflow-hidden">
          <div className="px-7 py-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
              Confirmado
            </p>
            <h3 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              Gracias, {family.family}
            </h3>
            {going.length > 0 ? (
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {going.map((p) => (
                  <li key={p.name} className="flex items-center justify-center gap-2">
                    <Check className="h-3.5 w-3.5 text-sage-deep" strokeWidth={3} />
                    {p.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Registramos que no podrán acompañarnos. ¡Los vamos a extrañar!
              </p>
            )}
            <button
              type="button"
              onClick={() => setPhase('form')}
              className="mt-5 text-xs uppercase tracking-[0.2em] text-dusty-deep underline underline-offset-4"
            >
              Cambiar respuesta
            </button>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-slate-400">
              Desliza para ver los detalles de la boda
            </p>
          </div>
        </Card>
      </Reveal>
    )
  }

  return (
    <Reveal>
      <Card floral className="mx-auto max-w-lg overflow-hidden">
        <div className="border-b border-marshmallow/50 px-7 py-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
            Confirmación RSVP
          </p>
          <h3 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">{family.family}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Reservamos <span className="font-semibold text-dusty-deep">{family.passes}</span>{' '}
            {family.passes === 1 ? 'lugar para ti' : 'lugares para ustedes'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-7">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-500">
            Marca quiénes asistirán
          </p>

          <ul className="space-y-3">
            {people.map((person) => (
              <li key={person.name}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                    person.going
                      ? 'border-sage-deep/40 bg-lily/20'
                      : 'border-stone-200/80 bg-baby-powder/70'
                  }`}
                >
                    <input
                      type="checkbox"
                      checked={person.going}
                      onChange={() => toggle(person.name)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition peer-focus-visible:ring-2 peer-focus-visible:ring-marshmallow ${
                        person.going
                          ? 'border-sage-deep bg-sage-deep text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {person.going && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span
                      className={`font-serif text-xl ${
                        person.going ? 'text-ink' : 'text-slate-500'
                      }`}
                    >
                      {person.name}
                    </span>
                </label>
              </li>
            ))}
          </ul>

          <p className="text-center text-sm text-slate-600">
            <span className="font-serif text-2xl text-ink">{going.length}</span> de{' '}
            {people.length} asistirán
          </p>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            className="w-full py-3.5 text-base"
            variant={going.length > 0 ? 'primary' : 'secondary'}
            disabled={saving}
          >
            {saving
              ? 'Guardando...'
              : going.length > 0
                ? `Confirmar ${going.length} ${going.length === 1 ? 'asistente' : 'asistentes'}`
                : 'No podremos asistir'}
          </Button>
        </form>
      </Card>
    </Reveal>
  )
}
