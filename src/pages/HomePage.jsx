import { WEDDING } from '../mockData/guests'

// La raíz no lleva a ninguna familia: cada invitado entra con su link personal.
export default function HomePage() {
  return (
    <main className="mantel flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-olive">Nos casamos</p>
      <h1 className="mt-4 font-serif text-6xl leading-none text-ink sm:text-7xl">
        {WEDDING.groom}
        <span className="mx-3 font-serif text-4xl italic text-dusty-deep sm:text-5xl">&amp;</span>
        {WEDDING.bride}
      </h1>
      <div className="mx-auto my-6 h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="text-sm uppercase tracking-[0.3em] text-ink/70">{WEDDING.dateLabel}</p>
      <p className="mt-8 max-w-xs text-sm leading-relaxed text-slate-600">
        Abre el link personal que te enviamos para ver tu invitación y confirmar.
      </p>
    </main>
  )
}
