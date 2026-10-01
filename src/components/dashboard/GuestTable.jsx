import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Pencil, Search, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Panel } from './Panel'

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'declined', label: 'No asisten' },
]

export function GuestTable({ guests, onEdit, onDelete, onCopyLink, onCreate }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmingId, setConfirmingId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return guests.filter((g) => {
      const matchStatus = statusFilter === 'all' || g.status === statusFilter
      const matchQuery =
        !q ||
        g.family.toLowerCase().includes(q) ||
        g.token.toLowerCase().includes(q) ||
        (g.members || []).some((name) => name.toLowerCase().includes(q)) ||
        (g.notes || '').toLowerCase().includes(q)
      return matchStatus && matchQuery
    })
  }, [guests, query, statusFilter])

  // El botón de eliminar pide confirmación en el mismo sitio antes de borrar.
  const askDelete = (guest) => {
    if (confirmingId !== guest.id) {
      setConfirmingId(guest.id)
      setTimeout(() => setConfirmingId((current) => (current === guest.id ? null : current)), 4000)
      return
    }
    setConfirmingId(null)
    onDelete(guest)
  }

  return (
    <Panel index={6} className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-linen-deep/70 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink">Invitados</h2>
          <p className="text-xs text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'familia' : 'familias'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar familia o invitado..."
              className="w-full rounded-xl border border-linen-deep bg-[#faf8f4] py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-olive/50 focus:bg-white focus:ring-2 focus:ring-olive/15 sm:w-64"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  statusFilter === filter.value
                    ? 'bg-olive text-linen shadow-sm shadow-olive/40'
                    : 'bg-[#f3f0e9] text-slate-600 hover:bg-[#ebe7dd]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="divide-y divide-linen-deep/60">
        {filtered.map((guest, index) => (
          <motion.li
            key={guest.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
            className="group relative flex flex-col gap-4 p-5 pl-6 transition hover:bg-[#faf8f4] lg:flex-row lg:items-center"
          >
            <span
              aria-hidden
              className={`absolute inset-y-3 left-0 w-1 rounded-full transition-opacity ${
                guest.status === 'confirmed'
                  ? 'bg-olive'
                  : guest.status === 'declined'
                    ? 'bg-dusty'
                    : 'bg-gold'
              }`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-serif text-xl text-ink">{guest.family}</h3>
                <Badge status={guest.status} />
              </div>
              <p className="mt-1.5 text-sm text-slate-600">
                {(guest.members || []).map((name, i) => {
                  // Sin respuesta todavía: ningún nombre se marca como ausente.
                  const pending = guest.status === 'pending'
                  const going = (guest.guests || []).some((p) => p.name === name)
                  return (
                    <span
                      key={name}
                      className={
                        pending ? 'text-slate-600' : going ? 'text-sage-deep' : 'text-slate-400 line-through decoration-slate-300'
                      }
                    >
                      {i > 0 && <span className="text-slate-300"> · </span>}
                      {name}
                    </span>
                  )
                })}
              </p>
              <button
                type="button"
                onClick={() => onCopyLink(guest)}
                className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition hover:text-olive"
              >
                <Copy className="h-3 w-3" />
                /rsvp/{guest.token}
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="whitespace-nowrap font-serif text-2xl text-ink">
                  {guest.attending ?? '—'}
                  <span className="text-lg text-slate-400"> / {guest.passes}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">asisten</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(guest)}
                  aria-label={`Editar ${guest.family}`}
                  className="rounded-xl border border-linen-deep bg-white p-2.5 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-ink hover:shadow-md"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => askDelete(guest)}
                  className={`rounded-xl border p-2.5 text-xs transition ${
                    confirmingId === guest.id
                      ? 'border-red-300 bg-red-50 px-3 text-red-700'
                      : 'border-linen-deep bg-white text-slate-400 shadow-sm hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 hover:shadow-md'
                  }`}
                >
                  {confirmingId === guest.id ? '¿Seguro?' : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.li>
        ))}

        {filtered.length === 0 && (
          <li className="p-12 text-center">
            <p className="font-serif text-xl text-ink">
              {guests.length === 0 ? 'Aún no hay familias' : 'Sin resultados'}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {guests.length === 0
                ? 'Crea la primera para generar su link de invitación.'
                : 'Prueba con otro nombre o cambia el filtro.'}
            </p>
            {guests.length === 0 && onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="mt-5 text-xs uppercase tracking-[0.2em] text-olive underline underline-offset-4"
              >
                Nueva familia
              </button>
            )}
          </li>
        )}
      </ul>
    </Panel>
  )
}
