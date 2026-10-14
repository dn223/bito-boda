// Piezas de estilo compartidas por la invitación de muestra y sus aperturas.

export const LABEL = 'text-[11px] font-medium uppercase tracking-[0.38em]'

// Mezcla un color con otro (o con transparente) sin precalcular paletas.
export const tint = (color, amount, base = 'transparent') => `color-mix(in srgb, ${color} ${amount}%, ${base})`

// Degradado de cera para el lacre, a partir de un solo color.
export const wax = (color) =>
  `radial-gradient(circle at 34% 30%, ${tint(color, 45, 'white')}, ${color} 48%, ${tint(color, 62, 'black')})`

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
