# BITO

Plataforma web para invitaciones y confirmaciones RSVP de la boda de Bito & Coni.

## Stack

- Vite + React (JSX)
- Tailwind CSS v4
- React Router
- Framer Motion
- Lucide React
- Recharts
- canvas-confetti

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/rsvp/:token` | Invitación pública (ej. `/rsvp/familia-navarrete`) |
| `/dashboard` | Panel de administración |

## Estructura

```
src/
  assets/
  components/
    ui/
    invitation/
    dashboard/
  pages/
  services/
  hooks/
  mockData/
```

## Tokens mock

- `familia-navarrete` (4 pases)
- `familia-garcia`
- `familia-lopez`
- …ver `src/mockData/guests.js`
