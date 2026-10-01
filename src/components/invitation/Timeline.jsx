import { Church, Heart, Sparkles, GlassWater } from 'lucide-react'
import { WEDDING } from '../../mockData/guests'
import { Card } from '../ui/Card'
import { Reveal } from '../ui/Reveal'

const icons = [Sparkles, Church, Heart, GlassWater]

function TimelineCard({ item }) {
  return (
    <Card floral className="p-5 text-left">
      <p className="text-xs font-semibold uppercase tracking-widest text-dusty-deep">
        {item.time}
      </p>
      <h3 className="mt-1 font-serif text-2xl text-ink">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
    </Card>
  )
}

export function Timeline() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-dusty-deep">
            Itinerario
          </p>
          <h2 className="font-serif text-4xl text-ink sm:text-5xl">Momentos del día</h2>
        </Reveal>

        <div className="relative">
          <div className="absolute bottom-2 left-6 top-2 w-px bg-gradient-to-b from-strawberry via-gold to-lily md:left-1/2 md:-translate-x-px" />

          <ul className="space-y-10">
            {WEDDING.itinerary.map((item, index) => {
              const Icon = icons[index % icons.length]
              const isLeft = index % 2 === 0

              return (
                <Reveal key={item.id} delay={index * 0.08}>
                  <li className="relative grid grid-cols-[48px_1fr] items-start gap-4 md:grid-cols-[1fr_48px_1fr]">
                    <div
                      className={`hidden md:block ${isLeft ? 'text-right' : 'order-3 text-left'}`}
                    >
                      {isLeft && <TimelineCard item={item} />}
                    </div>

                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-marshmallow bg-baby-powder text-dusty-deep shadow-md md:col-start-2">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className={`${isLeft ? 'md:order-3' : ''}`}>
                      <div className="md:hidden">
                        <TimelineCard item={item} />
                      </div>
                      <div className="hidden md:block">{!isLeft && <TimelineCard item={item} />}</div>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
