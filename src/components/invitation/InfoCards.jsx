import { Mail } from 'lucide-react'
import dressCode from '../../assets/dresscode.jpg'
import { WEDDING } from '../../mockData/guests'
import { Reveal } from '../ui/Reveal'

// El título va sobre el mantel; el contenido, encima de la foto.
export function InfoCards({ background }) {
  return (
    <section>
      <Reveal className="px-6 pb-10 pt-6 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
          Info general
        </p>
        <h2 className="font-serif text-4xl text-ink sm:text-5xl">Para que lo sepas</h2>
      </Reveal>

      <div className="relative isolate overflow-hidden">
        {background && (
          <>
            <img
              src={background}
              alt=""
              aria-hidden
              className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_25%]"
            />
            <div className="absolute inset-0 -z-10 bg-black/40" />
          </>
        )}

        <div className="mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <Reveal delay={0.05}>
            <Mail className="mx-auto h-7 w-7 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
              Regalos
            </p>
            <p className="mt-2 font-serif text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] sm:text-3xl">
              {WEDDING.gifts}
            </p>
          </Reveal>

          <div className="mx-auto my-12 h-px w-24 bg-white/40" />

          <Reveal delay={0.1}>
            {/* dibujo en blanco sobre la foto: se invierte y el negro se vuelve transparente */}
            <img
              src={dressCode}
              alt=""
              aria-hidden
              className="mx-auto h-24 w-24 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:h-28 sm:w-28"
              style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
            />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
              Código de vestimenta
            </p>
            <p className="mt-2 font-serif text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] sm:text-3xl">
              {WEDDING.dressCode}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
