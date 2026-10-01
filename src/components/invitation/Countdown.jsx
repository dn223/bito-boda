import { useCountdown } from '../../hooks/useCountdown'
import { WEDDING } from '../../mockData/guests'
import { Reveal } from '../ui/Reveal'
import { OliveBranch } from './OliveBranch'

function pad(value) {
  return String(value).padStart(2, '0')
}

export function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING.date)
  const cells = [
    { value: days, label: 'días' },
    { value: hours, label: 'horas' },
    { value: minutes, label: 'min' },
    { value: seconds, label: 'seg' },
  ]

  return (
    <Reveal className="px-4 py-16 sm:px-6">
      <div className="relative mx-auto max-w-xl px-6 py-6 text-center">
        <OliveBranch className="pointer-events-none absolute -left-4 -top-2 h-20 w-36 opacity-40 sm:-left-10" />
        <OliveBranch
          className="pointer-events-none absolute -bottom-2 -right-4 h-20 w-36 opacity-40 sm:-right-10"
          flip
        />

        <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          {WEDDING.dateBig}
        </h2>
        <p className="mt-3 font-serif text-2xl italic text-dusty-deep sm:text-3xl">
          {WEDDING.ceremony.time}
        </p>

        <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-olive">
          Cuenta regresiva
        </p>

        <div className="relative flex items-start justify-center">
          {cells.map((cell, index) => (
            <div key={cell.label} className="flex items-start">
              <div className="w-16 sm:w-20 md:w-24">
                <p className="font-serif text-4xl leading-none tracking-tight text-ink sm:text-5xl md:text-6xl">
                  {pad(cell.value)}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-olive/80 sm:text-xs">
                  {cell.label}
                </p>
              </div>
              {index < cells.length - 1 && (
                <span className="font-serif text-4xl leading-none text-olive/40 sm:text-5xl md:text-6xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
