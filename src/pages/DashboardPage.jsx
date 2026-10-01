import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  CircleSlash,
  Clock3,
  Download,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Ticket,
  UserCheck,
  Users,
} from 'lucide-react'
import { CountUp } from '../components/dashboard/CountUp'
import { GuestFormModal } from '../components/dashboard/GuestFormModal'
import { GuestTable } from '../components/dashboard/GuestTable'
import { LoginGate } from '../components/dashboard/LoginGate'
import { Panel } from '../components/dashboard/Panel'
import { useGuests } from '../hooks/useGuests'

export default function DashboardPage() {
  return (
    <LoginGate>
      <Dashboard />
    </LoginGate>
  )
}

// Cada métrica lleva su propio color: de un vistazo se sabe qué es qué.
const TONES = {
  olive: { chip: 'bg-olive/10 text-olive', value: 'text-olive-deep' },
  gold: { chip: 'bg-gold/20 text-[#9a844f]', value: 'text-[#9a844f]' },
  dusty: { chip: 'bg-marshmallow/50 text-dusty-deep', value: 'text-dusty-deep' },
  ink: { chip: 'bg-ink/[0.07] text-ink/75', value: 'text-ink' },
}

function Dashboard() {
  const {
    guests,
    wedding,
    stats,
    loading,
    saving,
    error,
    refresh,
    saveGuest,
    addGuest,
    removeGuest,
    exportCsv,
  } = useGuests()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2200)
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (guest) => {
    setEditing(guest)
    setModalOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await saveGuest(editing.id, payload)
      notify('Familia actualizada')
    } else {
      await addGuest(payload)
      notify('Familia creada')
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async (guest) => {
    await removeGuest(guest.id)
    notify(`${guest.family} eliminada`)
  }

  const handleCopyLink = async (guest) => {
    await navigator.clipboard.writeText(`${window.location.origin}/rsvp/${guest.token}`)
    notify('Link copiado al portapapeles')
  }

  const capacity = wedding?.venueCapacity || 0
  const occupancy = capacity ? Math.min(100, (stats.attendingCount / capacity) * 100) : 0
  const answered = stats.confirmedFamilies + stats.declinedFamilies
  const responseRate = stats.totalFamilies
    ? Math.round((answered / stats.totalFamilies) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#f5f2ec] text-ink">
      <header className="sticky top-0 z-30 border-b border-linen-deep/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-olive text-lg font-serif text-linen">
              B
            </span>
            <div>
              <h1 className="font-serif text-2xl leading-tight text-ink">
                {wedding?.coupleLabel || 'Boda'}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Panel de invitados
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {guests[0] && (
              <HeaderButton as={Link} to={`/rsvp/${guests[0].token}`} icon={Eye}>
                Ver invitación
              </HeaderButton>
            )}
            <HeaderButton onClick={refresh} icon={RefreshCw} spinning={loading}>
              Recargar
            </HeaderButton>
            <HeaderButton onClick={exportCsv} icon={Download}>
              Exportar CSV
            </HeaderButton>
            <motion.button
              type="button"
              onClick={openCreate}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-olive px-4 py-2.5 text-sm font-medium text-linen shadow-[0_6px_16px_-6px_rgba(86,96,67,0.8)] transition hover:bg-olive-deep"
            >
              <Plus className="h-4 w-4" />
              Nueva familia
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-sm text-slate-400">Cargando invitados...</p>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat index={0} icon={Users} tone="ink" label="Familias" value={stats.totalFamilies} />
              <Stat index={1} icon={Ticket} tone="ink" label="Pases" value={stats.totalPasses} />
              <Stat
                index={2}
                icon={UserCheck}
                tone="olive"
                label="Asistirán"
                value={stats.attendingCount}
              />
              <Stat
                index={3}
                icon={Clock3}
                tone="gold"
                label="Sin responder"
                value={stats.pendingFamilies}
              />
            </section>

            <section className="grid gap-3 lg:grid-cols-3">
              <Panel index={4} className="p-5 lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      Aforo de la finca
                    </p>
                    <p className="mt-1 font-serif text-3xl text-ink">
                      <CountUp value={stats.attendingCount} />
                      <span className="text-lg text-slate-400"> / {capacity || '—'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      Respondieron
                    </p>
                    <p className="mt-1 font-serif text-3xl text-ink">
                      <CountUp value={responseRate} />%
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#f0ece3]">
                  <motion.div
                    className="h-full rounded-full bg-olive"
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancy}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Mini tone="olive" icon={UserCheck} value={stats.confirmedFamilies} label="confirmadas" />
                  <Mini tone="gold" icon={Clock3} value={stats.pendingFamilies} label="pendientes" />
                  <Mini tone="dusty" icon={CircleSlash} value={stats.declinedFamilies} label="no asisten" />
                </div>
              </Panel>

              <Panel index={5} className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  El evento
                </p>
                <p className="mt-3 flex items-center gap-2.5 text-sm text-ink">
                  <CalendarDays className="h-4 w-4 shrink-0 text-olive" />
                  {wedding?.dateLabel} · {wedding?.ceremony?.time}
                </p>
                <p className="mt-3 flex items-start gap-2.5 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                  <span>
                    <span className="block text-ink">{wedding?.ceremony?.place}</span>
                    {wedding?.ceremony?.address}
                  </span>
                </p>
              </Panel>
            </section>

            <GuestTable
              guests={guests}
              onEdit={openEdit}
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
              onCreate={openCreate}
            />
          </>
        )}
      </main>

      <GuestFormModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm text-linen shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HeaderButton({ as: Component = 'button', icon: Icon, children, spinning, ...props }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-linen-deep bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-ink hover:shadow-md"
      {...props}
    >
      {Icon && <Icon className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} />}
      {children}
    </Component>
  )
}

function Stat({ label, value, icon: Icon, tone = 'ink', index = 0 }) {
  const t = TONES[tone]
  return (
    <Panel index={index} hover className="p-5">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${t.chip}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className={`mt-4 font-serif text-4xl ${t.value}`}>
        <CountUp value={value} />
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    </Panel>
  )
}

function Mini({ tone, icon: Icon, value, label }) {
  const t = TONES[tone]
  return (
    <div className="rounded-xl bg-[#faf8f4] px-3 py-2.5">
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${t.value}`}>
        <Icon className="h-3.5 w-3.5" />
        {value}
      </span>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  )
}
