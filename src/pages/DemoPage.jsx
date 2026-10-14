import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DemoInvitation } from '../components/designer/DemoInvitation'
import { decodeConfig, resolveTheme } from '../designer/catalog'

// Un diseño del diseñador a pantalla completa, para enviarlo a una pareja.
export default function DemoPage() {
  const [params] = useSearchParams()
  const code = params.get('c') || ''
  const config = useMemo(() => decodeConfig(code), [code])
  const ground = resolveTheme(config).ground

  useEffect(() => {
    document.title = `${config.nameA} & ${config.nameB} — Invitación de muestra`
  }, [config.nameA, config.nameB])

  return (
    <div className="flex min-h-[100svh] justify-center" style={{ backgroundColor: ground }}>
      <DemoInvitation config={config} className="h-[100svh] w-full max-w-[480px] shadow-2xl" />
      <Link
        to={`/disenador?c=${code}`}
        className="fixed right-3 top-3 z-40 rounded-full bg-black/45 px-3.5 py-2 text-xs font-medium text-white backdrop-blur"
      >
        Editar diseño
      </Link>
    </div>
  )
}
