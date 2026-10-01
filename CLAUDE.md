# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Ejecutar desde `BITO/` (este es el directorio raíz del proyecto; el padre `dn/` no es parte del código, solo contiene archivos personales del usuario).

```bash
npm install       # instalar dependencias
npm run dev        # servidor de desarrollo (Vite)
npm run build       # build de producción -> dist/
npm run preview     # sirve el build de dist/
npm run lint       # oxlint
```

No hay suite de tests configurada (no hay `test` script ni framework instalado).

## Arquitectura

BITO es una SPA de invitación de boda con RSVP, construida con Vite + React 19 + React Router + Tailwind v4. Tiene dos rutas principales (`src/App.jsx`):

- `/rsvp/:token` → `InvitationPage`: invitación pública, cada familia accede con su propio token (ej. `familia-navarrete`).
- `/dashboard` → `DashboardPage`: panel de administración para gestionar invitados (CRUD, export CSV, estadísticas).

### Capa de datos: Firebase

- Backend real en Firebase (proyecto `boda-byc`). `src/services/firebase.js` inicializa la app y exporta `db`, `auth` y el nombre de la colección (`families`). La config es pública: lo que protege los datos son las reglas.
- Firestore: colección `families`, **el id del documento ES el token de la familia** (`familia-garcia-7f3a`). Campos: `family`, `members[]` (nombres invitados, uno por pase), `passes`, `guests[]` (`{ name }` de quienes confirmaron), `attending`, `status`, `song`, `notes`, `updatedAt`.
- `src/services/guestsApi.js` es la única puerta a los datos (`listGuests`, `getGuestByToken`, `createGuest`, `updateGuest`, `deleteGuest`, `submitRsvp`, `computeStats`, `guestsToCsv`). Tanto `InvitationPage` como el Dashboard (vía `useGuests`) pasan por aquí.
- `updateGuest` ignora `token`/`id` en el patch: cambiar el token significaría mover el documento y rompería los links ya enviados.
- `createGuest` genera el token con `slugToken`: slug del nombre + sufijo aleatorio de 6 hex, para que un link no se deduzca de otro.
- `submitRsvp(token, { guests })` recibe los nombres confirmados y deriva `attending` y `status`.
- Reglas en `firestore.rules` (publicadas desde la consola): `get` público (quien tiene el link lee su doc), `list` solo autenticado, `update` público **solo** sobre `guests`/`attending`/`status`/`updatedAt`, `create`/`delete` solo autenticado.
- `/dashboard` va envuelto en `LoginGate` (Firebase Auth, correo y contraseña). El usuario admin se crea a mano en la consola de Firebase.
- `src/mockData/guests.js` ya solo guarda `WEDDING` (config de la boda) y `getDashboardStats`. Los datos de ejemplo se eliminaron.
- `src/services/db.js` es un re-export deprecado de `guestsApi.js` — no añadir lógica nueva ahí.

### Deploy

```bash
npm run build
npx firebase login       # una sola vez
npx firebase deploy      # hosting + reglas de Firestore
```

`firebase.json` sirve `dist/` con rewrite de todo a `/index.html` (necesario para que `/rsvp/:token` no dé 404 al recargar).

### Estructura de componentes

```
src/
  pages/            InvitationPage, DashboardPage (una por ruta)
  components/
    invitation/     secciones de la landing pública (Envelope, Hero, Countdown, EventDetails, RsvpForm, PhotoBreak, InfoCards, OliveBranch (solo en la cuenta regresiva), Timeline, FloralMargins, FallingPetals)
    dashboard/      GuestTable (lista + filtros), GuestFormModal, LoginGate, Panel (tarjeta base), CountUp
    ui/             primitivos reutilizables (Button, Card, Input, Select, Badge, Reveal)
  hooks/            useGuests (estado del dashboard), useCountdown
  services/         guestsApi (única puerta a Firestore), firebase (init del SDK), db (deprecado)
  mockData/         guests.js — solo WEDDING (config de la boda) y getDashboardStats
```

- Dos estéticas separadas a propósito, para que la plantilla escale: la **invitación** usa el mantel de lino (`.mantel` en `index.css`), olivo y serif; el **dashboard** usa tarjetas blancas sobre `#f5f2ec` con acentos de color por estado (olivo confirmado, dorado pendiente, rosa no asisten). El dashboard no reutiliza el `Card floral` de la invitación: tiene su propio `Panel`.
- `InvitationPage` solo tiene un paso previo: el sobre (`Envelope`). Al abrirlo se ve la invitación completa y se puede recorrer libremente; la portada tiene dos botones ancla (`#rsvp` y `#info`). Orden de secciones: portada → cuenta regresiva (fecha grande + hora) → foto → el lugar + botones de mapa → info general → foto del anillo con el versículo → RSVP → pie.
- El contenido/config de la boda (fecha, ceremonia, itinerario, dress code, regalos) vive en `WEDDING` dentro de `src/mockData/guests.js` — es la fuente única para ambas páginas.
- Los tokens se generan al crear cada familia desde el dashboard; no hay tokens fijos en el código.
- Paleta y tipografías custom (`--color-*`, `--font-serif`, `--font-sans`) se definen como Tailwind v4 `@theme` en `src/index.css`, no en un `tailwind.config.js` (Tailwind v4 no usa archivo de config con el plugin de Vite).
