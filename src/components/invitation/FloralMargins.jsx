export function FloralMargins() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div className="absolute -left-24 top-1/4 hidden h-[70vh] w-64 rounded-full bg-marshmallow/40 blur-3xl lg:block" />
      <div className="absolute -left-10 top-[15%] hidden h-72 w-40 rounded-[40%] bg-lily/35 blur-2xl lg:block" />
      <div className="absolute -left-6 bottom-[20%] hidden h-52 w-36 rounded-full bg-strawberry/20 blur-3xl lg:block" />

      <div className="absolute -right-24 top-[18%] hidden h-[65vh] w-64 rounded-full bg-lily/40 blur-3xl lg:block" />
      <div className="absolute -right-10 top-[40%] hidden h-80 w-44 rounded-[45%] bg-marshmallow/35 blur-2xl lg:block" />
      <div className="absolute -right-8 bottom-[12%] hidden h-48 w-32 rounded-full bg-lime-cream/40 blur-3xl lg:block" />

      <div className="absolute -left-8 bottom-10 h-40 w-40 rounded-full bg-marshmallow/30 blur-3xl lg:hidden" />
      <div className="absolute -right-8 top-32 h-36 w-36 rounded-full bg-lily/35 blur-3xl lg:hidden" />
    </div>
  )
}
