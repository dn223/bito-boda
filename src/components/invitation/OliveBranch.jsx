// Rama de olivo en SVG: las hojas se reparten sobre la curva del tallo,
// así una sola función sirve para ramas de cualquier tamaño u orientación.
const STEM = [
  { x: 6, y: 96 },
  { x: 62, y: 96 },
  { x: 118, y: 58 },
  { x: 194, y: 12 },
]

function pointAt(t) {
  const [a, b, c, d] = STEM
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  }
}

function angleAt(t) {
  const before = pointAt(Math.max(0, t - 0.01))
  const after = pointAt(Math.min(1, t + 0.01))
  return (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI
}

const LEAVES = Array.from({ length: 11 }, (_, i) => {
  const t = 0.1 + i * 0.082
  const { x, y } = pointAt(t)
  const side = i % 2 === 0 ? -1 : 1
  return { x, y, rotate: angleAt(t) + side * 52, scale: 0.75 + (1 - t) * 0.45, side }
})

const OLIVES = [0.3, 0.55, 0.78].map((t) => pointAt(t))

export function OliveBranch({ className = '', flip = false, tone = 'olive' }) {
  const leaf = tone === 'olive' ? 'var(--color-olive)' : 'var(--color-sage-deep)'

  return (
    <svg
      viewBox="0 0 200 110"
      aria-hidden
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d={`M${STEM[0].x} ${STEM[0].y} C ${STEM[1].x} ${STEM[1].y}, ${STEM[2].x} ${STEM[2].y}, ${STEM[3].x} ${STEM[3].y}`}
        fill="none"
        stroke={leaf}
        strokeOpacity="0.75"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {LEAVES.map((l, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={0}
          rx={13 * l.scale}
          ry={5.4 * l.scale}
          fill={leaf}
          fillOpacity={l.side === -1 ? 0.85 : 0.65}
          transform={`translate(${l.x} ${l.y}) rotate(${l.rotate}) translate(${12 * l.scale} 0)`}
        />
      ))}
      {OLIVES.map((o, i) => (
        <circle key={i} cx={o.x} cy={o.y - 7} r={4.2} fill="var(--color-olive-deep)" fillOpacity="0.8" />
      ))}
    </svg>
  )
}

// Separador entre secciones: dos ramas enfrentadas con un rombo al centro.
export function BranchDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-10 ${className}`} aria-hidden>
      <OliveBranch className="h-10 w-20 opacity-70 sm:h-12 sm:w-24" flip />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <OliveBranch className="h-10 w-20 opacity-70 sm:h-12 sm:w-24" />
    </div>
  )
}
