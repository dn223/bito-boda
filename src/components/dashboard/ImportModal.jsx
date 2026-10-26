import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileUp, X } from 'lucide-react'
import { familyKey, parseGuestList } from '../../services/guestsApi'
import { Button } from '../ui/Button'

// Importa muchas familias de una vez (CSV con Familia, Invitados, Notas).
// Cada una sale con su token nuevo, igual que si se creara a mano.
export function ImportModal({ open, guests, onClose, onImport }) {
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)

  // Al cerrar se limpia todo para que la próxima vez empiece de cero.
  const close = () => {
    setText('')
    setProgress(null)
    setError(null)
    onClose()
  }

  const entries = useMemo(() => parseGuestList(text), [text])
  const existing = useMemo(() => new Set(guests.map((g) => familyKey(g.family))), [guests])
  const fresh = entries.filter((entry) => !existing.has(familyKey(entry.family)))
  const people = fresh.reduce((sum, entry) => sum + entry.members.length, 0)
  const importing = progress !== null && progress < fresh.length

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (file) setText(await file.text())
    event.target.value = ''
  }

  const handleImport = async () => {
    setError(null)
    setProgress(0)
    try {
      await onImport(fresh, setProgress)
    } catch (err) {
      setError(err.message || 'No se pudo importar')
      setProgress(null)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={importing ? undefined : close}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-linen-deep bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between border-b border-linen-deep/70 px-6 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-olive">
                  Importar
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ink">Lista de invitados</h3>
              </div>
              <button
                type="button"
                onClick={close}
                disabled={importing}
                aria-label="Cerrar"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-ink disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <p className="text-sm text-slate-600">
                Una fila por invitación con tres columnas: <b>Familia</b>, <b>Invitados</b>{' '}
                (separados por punto y coma) y <b>Notas</b>. Las familias que ya existen con el
                mismo nombre se saltan.
              </p>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-linen-deep bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-ink hover:shadow-md">
                <FileUp className="h-4 w-4" />
                Elegir archivo CSV
                <input type="file" accept=".csv,.txt,text/csv" onChange={handleFile} className="hidden" />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  O pega la lista aquí
                </span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  disabled={importing}
                  placeholder={'Familia,Invitados,Notas\nFamilia Navarrete,Raúl Navarrete; Arlin Navarrete,De parte de Bito'}
                  className="w-full rounded-xl border border-linen-deep bg-[#faf8f4] px-4 py-3 font-mono text-xs text-slate-800 outline-none transition focus:border-olive/50 focus:bg-white focus:ring-2 focus:ring-olive/15"
                />
              </label>

              {entries.length > 0 && (
                <div className="rounded-xl border border-linen-deep bg-[#faf8f4]">
                  <p className="border-b border-linen-deep/70 px-4 py-3 text-sm text-ink">
                    <b>{fresh.length}</b> {fresh.length === 1 ? 'familia nueva' : 'familias nuevas'} ·{' '}
                    <b>{people}</b> {people === 1 ? 'persona' : 'personas'}
                    {entries.length > fresh.length && (
                      <span className="text-slate-500">
                        {' '}· {entries.length - fresh.length} ya existen (se saltan)
                      </span>
                    )}
                  </p>
                  <ul className="max-h-56 divide-y divide-linen-deep/60 overflow-y-auto text-sm">
                    {entries.map((entry) => {
                      const skip = existing.has(familyKey(entry.family))
                      return (
                        <li key={entry.family} className={`px-4 py-2 ${skip ? 'text-slate-400' : 'text-slate-700'}`}>
                          <span className="font-medium text-ink">{entry.family}</span>
                          <span className="text-slate-400"> · {entry.members.length}</span>
                          {skip && <span className="text-xs"> (ya existe)</span>}
                          <span className="block truncate text-xs text-slate-500">
                            {entry.members.join(' · ')}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {progress !== null && (
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f0ece3]">
                    <div
                      className="h-full rounded-full bg-olive transition-all"
                      style={{ width: `${fresh.length ? (progress / fresh.length) * 100 : 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {importing ? `Creando ${progress} de ${fresh.length}...` : `Listo: ${progress} familias creadas`}
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={close} disabled={importing}>
                  {progress !== null && !importing ? 'Cerrar' : 'Cancelar'}
                </Button>
                {(progress === null || importing) && (
                  <Button
                    type="button"
                    onClick={handleImport}
                    disabled={importing || fresh.length === 0}
                    className="bg-olive shadow-olive/30 hover:bg-olive-deep"
                  >
                    {importing ? 'Importando...' : `Importar ${fresh.length || ''}`}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
