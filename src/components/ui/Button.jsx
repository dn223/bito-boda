export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const variants = {
    primary:
      'bg-dusty-deep text-white hover:bg-strawberry shadow-lg shadow-strawberry/30',
    secondary:
      'bg-baby-powder/80 text-slate-700 border border-stone-200 hover:bg-white shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-ivory',
    sage: 'bg-sage-deep text-white hover:bg-sweet-pea shadow-lg shadow-lily/40',
    gold: 'bg-gold text-slate-800 hover:bg-gold-soft shadow-md',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
