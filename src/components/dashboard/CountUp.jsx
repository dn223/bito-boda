import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

// Número que sube desde 0 al entrar. Puramente decorativo.
export function CountUp({ value = 0, duration = 0.9 }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const controls = animate(0, Number(value) || 0, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setShown(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value, duration])

  return shown
}
