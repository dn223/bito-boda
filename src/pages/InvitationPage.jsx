import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import couple2 from '../assets/couple-2.jpg'
import couple4 from '../assets/couple-4.jpg'
import ringPhoto from '../assets/ring.jpg'
import { Countdown } from '../components/invitation/Countdown'
import { Envelope } from '../components/invitation/Envelope'
import { EventDetails } from '../components/invitation/EventDetails'
import { FallingPetals } from '../components/invitation/FallingPetals'
import { FloralMargins } from '../components/invitation/FloralMargins'
import { Hero } from '../components/invitation/Hero'
import { InfoCards } from '../components/invitation/InfoCards'
import { PhotoBreak } from '../components/invitation/PhotoBreak'
import { RsvpForm } from '../components/invitation/RsvpForm'
import { WEDDING } from '../mockData/guests'
import { getGuestByToken } from '../services/guestsApi'
import { Reveal } from '../components/ui/Reveal'

// Solo hay un paso previo: el sobre. Después la invitación se recorre libre.
export default function InvitationPage() {
  const { token } = useParams()
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getGuestByToken(token)
      .then((found) => active && setFamily(found))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [token])

  return (
    <div className="mantel relative min-h-screen overflow-x-hidden">
      {!opened && <Envelope onOpen={() => setOpened(true)} />}
      <FloralMargins />
      <FallingPetals />

      <div className="relative z-10 lg:px-40 xl:px-52">
        <Hero />

        <div id="info">
          <Countdown />
        </div>

        <PhotoBreak
          src={couple2}
          alt="Bito & Coni"
          caption="Un momento, para siempre"
          tall
          objectPosition="center 30%"
        />

        <EventDetails />

        <InfoCards background={couple4} />

        {/* El versículo va entre las dos fotos para que no queden pegadas */}
        <Reveal className="mx-auto max-w-xl px-6 py-14 text-center">
          <p className="font-serif text-2xl italic leading-relaxed text-ink sm:text-3xl">
            “Cordón de tres dobleces no se corta fácilmente.”
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
            Eclesiastés 4:12
          </p>
        </Reveal>

        <PhotoBreak src={ringPhoto} alt="Anillo de compromiso" objectPosition="center 40%" />

        <section id="rsvp" className="relative px-4 py-16 sm:px-6">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
              RSVP
            </p>
            <h2 className="font-serif text-4xl text-ink sm:text-5xl">Confirma tu asistencia</h2>
            <p className="mt-3 text-sm text-slate-600">
              Tu respuesta nos ayuda a preparar cada detalle con cariño.
            </p>
          </Reveal>

          {loading ? (
            <p className="text-center text-sm text-slate-400">Cargando tu invitación...</p>
          ) : family ? (
            <RsvpForm family={family} />
          ) : (
            <Reveal>
              <div className="mx-auto max-w-lg rounded-3xl border border-marshmallow/60 bg-baby-powder/80 p-8 text-center shadow-lg">
                <h3 className="font-serif text-3xl text-ink">Invitación no encontrada</h3>
                <p className="mt-3 text-sm text-slate-600">
                  El enlace <span className="font-mono text-xs">{token}</span> no corresponde a
                  ninguna familia. Pídenos el link correcto.
                </p>
              </div>
            </Reveal>
          )}
        </section>

        <footer className="relative overflow-hidden bg-olive px-6 py-14 text-center text-linen">
          <p className="relative font-serif text-4xl">{WEDDING.coupleLabel}</p>
          <div className="relative mx-auto my-5 h-px w-24 bg-linen/40" />
          <p className="relative text-xs uppercase tracking-[0.35em] text-linen/80">
            20 · 12 · 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
