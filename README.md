# BITO

Invitación web con confirmación RSVP para la boda de Bito & Coni.

## Stack

Vite + React 19, Tailwind CSS v4, React Router, Framer Motion, Firebase (Firestore, Auth, Hosting, App Check).

## Desarrollo

```bash
npm install
npm run dev
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Portada neutra: pide abrir el link personal |
| `/rsvp/:token` | Invitación de cada familia (el token se genera al crearla en el panel) |
| `/dashboard` | Panel privado de los novios |
| `/disenador` | Diseñador de invitaciones para mostrar a otras parejas (colores, apertura, portada, letra, foto) |
| `/disenador/vista?c=…` | Un diseño a pantalla completa; el link lleva el diseño dentro |

## Puesta en marcha en Firebase (una sola vez)

1. **Admin del panel.** En Authentication crea el usuario de los novios y copia su UID. En Firestore crea la colección `admins` con un documento cuyo ID sea ese UID (puede ir vacío). Solo esas cuentas entran al panel.
2. **Bloquear registros.** En Authentication → Settings → User actions, desactiva *Enable create (sign-up)* si la opción aparece.
3. **App Check (recomendado).** En App Check registra la app web con reCAPTCHA Enterprise, copia `.env.example` como `.env.local` y pega la clave. Cuando veas tráfico verificado, activa *Enforce* para Firestore.
4. **Dominio propio (opcional).** Conéctalo en Hosting y agrégalo en Authentication → Settings → Authorized domains. Cambia también `og:image` en `index.html` a ese dominio.

## Deploy

```bash
npm run build
npx firebase login                          # una sola vez
npx firebase deploy --only firestore:rules  # reglas de seguridad
npx firebase deploy                         # hosting + reglas
```
