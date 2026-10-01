export function Card({ children, className = '', floral = false, image = null }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/70 shadow-lg shadow-strawberry/10 ${className}`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
        </>
      ) : floral ? (
        <div className="absolute inset-0 bg-gradient-to-br from-baby-powder/90 via-marshmallow/35 to-lily/30 backdrop-blur-2xl" />
      ) : (
        <div className="absolute inset-0 bg-white/90" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
