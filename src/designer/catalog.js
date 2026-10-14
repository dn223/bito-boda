import samplePhoto1 from '../assets/future-couple-1.jpg'
import samplePhoto2 from '../assets/future-couple-2.jpg'

// Catálogo del diseñador de invitaciones. Todo lo que se puede elegir sale de
// aquí: sumar una paleta, una letra o una foto de muestra es sumar una entrada,
// sin tocar componentes. No afecta la invitación real de Bito & Coni.

export const PALETTES = [
  { id: 'olivo', name: 'Olivo y lino', primary: '#556240', ground: '#F1EADC', accent: '#B06F78', ink: '#2B2A22', line: '#C2A766' },
  { id: 'terracota', name: 'Terracota', primary: '#8F4A2E', ground: '#F4ECE2', accent: '#B0864A', ink: '#33231B', line: '#C9A57A' },
  { id: 'azul', name: 'Azul polvo', primary: '#3F5A73', ground: '#EEF0EE', accent: '#A07C4A', ink: '#1F2A35', line: '#AFBCC8' },
  { id: 'rubor', name: 'Rubor', primary: '#874656', ground: '#F7EEEB', accent: '#A8874F', ink: '#33202A', line: '#D3AEB4' },
  { id: 'salvia', name: 'Salvia', primary: '#5E7464', ground: '#F2F3EC', accent: '#B98B6E', ink: '#25302A', line: '#B7C2B0' },
  { id: 'noche', name: 'Noche y oro', primary: '#1F2A44', ground: '#F5F0E6', accent: '#B8954F', ink: '#151B2B', line: '#C9AE72' },
]

// `google` es el parámetro de Google Fonts; null = ya viene en index.html.
export const FONTS = [
  { id: 'cormorant', name: 'Cormorant', css: "'Cormorant Garamond', Georgia, serif", google: null },
  { id: 'playfair', name: 'Playfair', css: "'Playfair Display', Georgia, serif", google: 'Playfair+Display:ital,wght@0,400;0,500;1,400' },
  { id: 'bodoni', name: 'Bodoni', css: "'Bodoni Moda', Georgia, serif", google: 'Bodoni+Moda:ital,wght@0,400;0,500;1,400' },
  { id: 'caligrafia', name: 'Caligrafía', css: "'Pinyon Script', cursive", google: 'Pinyon+Script' },
]

export const SPLASHES = [
  { id: 'sobre', name: 'Sobre con lacre', hint: 'Se abre la solapa al tocar el sello' },
  { id: 'cortina', name: 'Cortina', hint: 'Dos paneles que se separan' },
  { id: 'monograma', name: 'Monograma', hint: 'Iniciales que se desvanecen' },
  { id: 'ninguno', name: 'Sin apertura', hint: 'Entra directo a la portada' },
]

export const HEROES = [
  { id: 'completa', name: 'Foto completa' },
  { id: 'arco', name: 'Arco' },
  { id: 'editorial', name: 'Editorial' },
]

export const SEALS = [
  { id: 'oro', name: 'Oro', color: '#C4A15A' },
  { id: 'rosa', name: 'Rosa', color: '#B06F78' },
  { id: 'vino', name: 'Vino', color: '#7A2E3A' },
  { id: 'olivo', name: 'Olivo', color: '#6B7650' },
  { id: 'plata', name: 'Plata', color: '#A3A6AB' },
]

export const PHOTOS = [
  { id: 'muestra-1', name: 'Puente', src: samplePhoto1, position: '42% 45%' },
  { id: 'muestra-2', name: 'Jardín', src: samplePhoto2, position: '45% 62%' },
]

export const DEFAULT_CONFIG = {
  nameA: 'Ana',
  nameB: 'Luis',
  date: 'Sábado 14 de marzo, 2027',
  place: 'Jardín Las Magnolias',
  palette: 'olivo',
  custom: { primary: '#556240', ground: '#F1EADC', accent: '#B06F78' },
  font: 'cormorant',
  splash: 'sobre',
  hero: 'completa',
  seal: 'oro',
  photo: 'muestra-1',
}

const byId = (list, id) => list.find((item) => item.id === id) || list[0]

// Convierte la configuración elegida en los valores que pinta la invitación.
export function resolveTheme(config, uploadedPhoto) {
  const palette =
    config.palette === 'custom'
      ? { ...PALETTES[0], ...config.custom, ink: '#2B2A22', line: config.custom.accent }
      : byId(PALETTES, config.palette)
  const font = byId(FONTS, config.font)
  const photo = uploadedPhoto
    ? { src: uploadedPhoto, position: 'center 30%' }
    : byId(PHOTOS, config.photo)

  return {
    ...palette,
    fontCss: font.css,
    fontGoogle: font.google,
    seal: byId(SEALS, config.seal).color,
    photo,
    initials: `${(config.nameA || 'A')[0]}${(config.nameB || 'B')[0]}`.toUpperCase(),
  }
}

// La configuración viaja en el link (?c=...) para enviar ejemplos sin base de datos.
export function encodeConfig(config) {
  const bytes = new TextEncoder().encode(JSON.stringify(config))
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeConfig(value) {
  if (!value) return DEFAULT_CONFIG
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const parsed = JSON.parse(new TextDecoder().decode(bytes))
    return { ...DEFAULT_CONFIG, ...parsed, custom: { ...DEFAULT_CONFIG.custom, ...parsed.custom } }
  } catch {
    return DEFAULT_CONFIG
  }
}
