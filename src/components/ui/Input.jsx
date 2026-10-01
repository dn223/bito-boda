export function Input({ label, className = '', id, ...props }) {
  const inputId = id || props.name

  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-dusty focus:ring-2 focus:ring-rose-100"
        {...props}
      />
    </label>
  )
}
