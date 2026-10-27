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

- `/` (y cualquier ruta desconocida) → `HomePage`: portada neutra que pide abrir el link personal.
- `/rsvp/:token` → `InvitationPage`: invitación pública, cada familia accede con su propio token (ej. `familia-navarrete`).
- `/dashboard` → `DashboardPage`: panel de administración para gestionar invitados (CRUD, export CSV, estadísticas).
- `/disenador` → `DesignerPage` y `/disenador/vista?c=…` → `DemoPage` (carga diferida): diseñador de invitaciones de muestra para vender la plantilla. Es independiente de Bito & Coni: no toca Firestore ni los componentes de `invitation/`. Las opciones (paletas, letras, aperturas, portadas, lacres, fotos) viven en `src/designer/catalog.js`; la configuración viaja en el link como base64url (`encodeConfig`/`decodeConfig`). `components/designer/DemoInvitation.jsx` pinta la muestra. Las aperturas (`Splashes.jsx`) y la entrada de la portada usan GSAP 3.13 (`SplitText`, `DrawSVGPlugin`, gratis incluso para uso comercial); el resto de la app sigue con Framer Motion.

### Capa de datos: Firebase

- Backend real en Firebase (proyecto `boda-byc`). `src/services/firebase.js` inicializa la app y exporta `db`, `auth` y el nombre de la colección (`families`). La config es pública: lo que protege los datos son las reglas.
- Firestore: colección `families`, **el id del documento ES el token de la familia** (`familia-garcia-7f3a`). Campos: `family`, `members[]` (nombres invitados, uno por pase), `passes`, `guests[]` (nombres de quienes confirmaron, como strings; `fromDoc` normaliza a `{ name }` y acepta el formato viejo de objetos), `attending`, `status`, `song`, `notes`, `updatedAt`.
- `src/services/guestsApi.js` es la única puerta a los datos (`listGuests`, `getGuestByToken`, `createGuest`, `updateGuest`, `deleteGuest`, `submitRsvp`, `computeStats`, `guestsToCsv`). Tanto `InvitationPage` como el Dashboard (vía `useGuests`) pasan por aquí.
- `updateGuest` ignora `token`/`id` en el patch: cambiar el token significaría mover el documento y rompería los links ya enviados.
- `createGuest` genera el token con `slugToken`: slug del nombre + sufijo aleatorio de 6 hex, para que un link no se deduzca de otro.
- Importación masiva: botón "Importar lista" del panel (`ImportModal`) → `parseGuestList` (CSV o texto pegado: Familia, Invitados separados por `;`, Notas) → `importGuests` en `useGuests`, que crea una por una con `createGuest` y salta las que ya existen por nombre (`familyKey`). La lista real de invitados NO va al repo (es público).
- Los links que se copian o exportan salen de `rsvpLink` con `WEDDING.siteUrl` (`https://boda-byc.web.app`), así sirven aunque el panel corra en localhost. Si se conecta un dominio propio, cambiar `siteUrl`.
- `submitRsvp(token, { guests, song })` recibe los nombres confirmados (y la canción opcional) y deriva `attending` y `status`.
- Reglas en `firestore.rules` (se publican con `npx firebase deploy --only firestore:rules`): `get` público (quien tiene el link lee su doc); `list`/`create`/`delete` solo admins; `update` del invitado validado: solo `guests`/`attending`/`status`/`song`/`updatedAt`, `guests` ⊆ `members` sin repetidos, `attending == guests.size()`, `status` coherente, `song` ≤ 200 caracteres.
- Admins: colección `admins/{uid}` (documento vacío creado a mano en la consola). Estar logueado no basta, porque cualquiera puede crearse una cuenta con la clave pública.
- `/dashboard` va envuelto en `LoginGate` (Firebase Auth, correo y contraseña) que además comprueba `isAdmin(uid)`.
- App Check (reCAPTCHA Enterprise) se activa en `firebase.js` solo si existe `VITE_RECAPTCHA_SITE_KEY` en `.env.local` (ver `.env.example`).
- `src/mockData/guests.js` ya solo guarda `WEDDING` (config de la boda) y `getDashboardStats`. Los datos de ejemplo se eliminaron.

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
  pages/            HomePage, InvitationPage, DashboardPage, DesignerPage, DemoPage (una por ruta)
  components/
    invitation/     secciones de la landing pública (Envelope, Hero, Countdown, EventDetails, RsvpForm, PhotoBreak, InfoCards, OliveBranch (solo en la cuenta regresiva), Timeline, FloralMargins, FallingPetals)
    designer/       DemoInvitation (muestra configurable: aperturas sobre/cortina/monograma, portadas completa/arco/editorial)
    dashboard/      GuestTable (lista + filtros), GuestFormModal, LoginGate, Panel (tarjeta base), CountUp
    ui/             primitivos reutilizables (Button, Card, Input, Select, Badge, Reveal)
  designer/         catalog.js — catálogo de opciones del diseñador + encode/decode del link
  hooks/            useGuests (estado del dashboard), useCountdown, useGoogleFonts
  services/         guestsApi (única puerta a Firestore), firebase (init del SDK + App Check)
  mockData/         guests.js — solo WEDDING (config de la boda) y getDashboardStats
```

- Dos estéticas separadas a propósito, para que la plantilla escale: la **invitación** usa el mantel de lino (`.mantel` en `index.css`), olivo y serif; el **dashboard** usa tarjetas blancas sobre `#f5f2ec` con acentos de color por estado (olivo confirmado, dorado pendiente, rosa no asisten). El dashboard no reutiliza el `Card floral` de la invitación: tiene su propio `Panel`.
- `InvitationPage` solo tiene un paso previo: el sobre (`Envelope`). Al abrirlo se ve la invitación completa y se puede recorrer libremente; la portada tiene dos botones ancla (`#rsvp` y `#info`). Orden de secciones: portada → cuenta regresiva (fecha grande + hora) → foto → el lugar + botones de mapa → info general → foto del anillo con el versículo → RSVP → pie.
- El contenido/config de la boda (fecha, ceremonia, itinerario, dress code, regalos) vive en `WEDDING` dentro de `src/mockData/guests.js` — es la fuente única para ambas páginas.
- Los tokens se generan al crear cada familia desde el dashboard; no hay tokens fijos en el código.
- Paleta y tipografías custom (`--color-*`, `--font-serif`, `--font-sans`) se definen como Tailwind v4 `@theme` en `src/index.css`, no en un `tailwind.config.js` (Tailwind v4 no usa archivo de config con el plugin de Vite).
