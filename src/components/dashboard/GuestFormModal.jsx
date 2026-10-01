import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const emptyForm = {
  family: '',
  members: '',
  attending: '',
  status: 'pending',
  token: '',
  notes: '',
  song: '',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'declined', label: 'No asisten' },
]

export function GuestFormModal({ open, initial, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm(
      initial
        ? {
            family: initial.family || '',
            members: (initial.members || []).join('\n'),
            attending: initial.attending ?? '',
            status: initial.status || 'pending',
            token: initial.token || '',
            notes: initial.notes || '',
            song: initial.song || '',
          }
        : emptyForm,
    )
  }, [open, initial])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const members = form.members
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      family: form.family.trim(),
      members,
      passes: members.length || 1,
      attending: form.attending === '' ? null : Number(form.attending),
      status: form.status,
      token: form.token.trim() || undefined,
      notes: form.notes.trim(),
      song: form.song.trim(),
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-linen-deep bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between border-b border-linen-deep/70 px-6 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-olive">
                  {initial ? 'Editar' : 'Nueva'}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ink">
                  {initial ? initial.family : 'Familia invitada'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <Input
                label="Nombre de la familia"
                required
                value={form.family}
                onChange={handleChange('family')}
                placeholder="Familia Navarrete"
              />

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Invitados · un nombre por línea
                </span>
                <textarea
                  value={form.members}
                  onChange={handleChange('members')}
                  rows={5}
                  placeholder={'Raúl Navarrete\nArlin Navarrete\nMartín Navarrete'}
                  className="w-full rounded-xl border border-linen-deep bg-[#faf8f4] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-olive/50 focus:bg-white focus:ring-2 focus:ring-olive/15"
                />
                <span className="block text-xs text-slate-400">
                  {members.length} {members.length === 1 ? 'pase' : 'pases'} · cada nombre
                  aparece con su casilla en la invitación
                </span>
              </label>

              <Select
                label="Estado"
                value={form.status}
                onChange={(status) => setForm((prev) => ({ ...prev, status }))}
                options={STATUS_OPTIONS}
              />

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Notas
                </span>
                <textarea
                  value={form.notes}
                  onChange={handleChange('notes')}
                  rows={2}
                  placeholder="Alergias, transporte, lo que sea"
                  className="w-full rounded-xl border border-linen-deep bg-[#faf8f4] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-olive/50 focus:bg-white focus:ring-2 focus:ring-olive/15"
                />
              </label>

              {initial && (
                <p className="rounded-xl border border-linen-deep bg-[#faf8f4] px-4 py-3 font-mono text-[11px] text-slate-500">
                  /rsvp/{initial.token}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-olive shadow-olive/30 hover:bg-olive-deep"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
