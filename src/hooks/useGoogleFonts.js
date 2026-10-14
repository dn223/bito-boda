import { useEffect } from 'react'

// Carga bajo demanda las letras de Google Fonts que elige el diseñador.
// Cada familia se inserta una sola vez aunque varios componentes la pidan.
export function useGoogleFonts(families) {
  const key = families.filter(Boolean).join('|')

  useEffect(() => {
    key
      .split('|')
      .filter(Boolean)
      .forEach((family) => {
        const id = `gf-${family.split(':')[0]}`
        if (document.getElementById(id)) return
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`
        document.head.appendChild(link)
      })
  }, [key])
}
