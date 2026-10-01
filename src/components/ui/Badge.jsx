const styles = {
  confirmed: 'border-olive/25 bg-olive/10 text-olive-deep',
  pending: 'border-gold/40 bg-gold/15 text-[#95804b]',
  declined: 'border-dusty/40 bg-marshmallow/40 text-dusty-deep',
}

const labels = {
  confirmed: 'Confirmado',
  pending: 'Pendiente',
  declined: 'No asisten',
}

export function Badge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        styles[status] || 'border-stone-200 bg-white text-slate-600'
      }`}
    >
      {labels[status] || status}
    </span>
  )
}
