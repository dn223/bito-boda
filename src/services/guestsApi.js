import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { WEDDING, getDashboardStats } from '../mockData/guests'
import { ADMINS, FAMILIES, db } from './firebase'

// El id del documento en Firestore ES el token de la familia.
function fromDoc(snapshot) {
  const data = snapshot.data()
  return {
    ...data,
    id: snapshot.id,
    token: snapshot.id,
    members: data.members || [],
    // Antes se guardaba { name }; ahora solo el nombre (las reglas lo validan
    // contra members). Se aceptan ambos para no romper confirmaciones viejas.
    guests: (data.guests || []).map((g) => (typeof g === 'string' ? { name: g } : g)),
  }
}

// Sufijo aleatorio para que el link de una familia no se pueda adivinar
// desde el de otra (familia-lopez -> familia-lopez-k3xq9f).
function slugToken(family) {
  const slug = (family || 'invitado')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/^familia-/, '')
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6)
  return `familia-${slug}-${suffix}`
}

export async function getWeddingConfig() {
  return WEDDING
}

// Una cuenta solo entra al panel si existe admins/{uid} (se crea en la consola).
export async function isAdmin(uid) {
  if (!uid) return false
  const snapshot = await getDoc(doc(db, ADMINS, uid))
  return snapshot.exists()
}

export async function listGuests() {
  const snapshot = await getDocs(collection(db, FAMILIES))
  return snapshot.docs.map(fromDoc)
}

export async function getGuestByToken(token) {
  if (!token) return null
  const snapshot = await getDoc(doc(db, FAMILIES, token))
  return snapshot.exists() ? fromDoc(snapshot) : null
}

export async function createGuest(payload) {
  const token = payload.token?.trim() || slugToken(payload.family)
  const members = payload.members || []
  const next = {
    family: payload.family || 'Sin nombre',
    members,
    passes: Number(payload.passes) || members.length || 1,
    attending: payload.attending ?? null,
    status: payload.status || 'pending',
    song: payload.song || '',
    notes: payload.notes || '',
    guests: payload.guests || [],
    updatedAt: serverTimestamp(),
  }
  await setDoc(doc(db, FAMILIES, token), next)
  return { ...next, id: token, token, updatedAt: null }
}

export async function updateGuest(id, patch) {
  // El token es el id del documento, así que renombrarlo sería mover el doc:
  // se ignora para no romper links ya enviados.
  const { token: _ignored, id: _id, ...fields } = patch
  await updateDoc(doc(db, FAMILIES, id), { ...fields, updatedAt: serverTimestamp() })
  return getGuestByToken(id)
}

export async function deleteGuest(id) {
  await deleteDoc(doc(db, FAMILIES, id))
  return true
}

export async function submitRsvp(token, { guests: attendees = [], song }) {
  const names = [...new Set(attendees.map((p) => (typeof p === 'string' ? p : p.name)))]
  const patch = {
    guests: names,
    attending: names.length,
    status: names.length > 0 ? 'confirmed' : 'declined',
    updatedAt: serverTimestamp(),
  }
  if (typeof song === 'string') patch.song = song.trim().slice(0, 200)
  await updateDoc(doc(db, FAMILIES, token), patch)
  return getGuestByToken(token)
}

export function computeStats(list) {
  return getDashboardStats(list)
}

export function guestsToCsv(list) {
  const headers = [
    'Familia',
    'Token',
    'Pases',
    'Invitados (nombres)',
    'Asistentes',
    'Estado',
    'Notas',
    'Canción',
    'Detalle invitados',
    'Link RSVP',
  ]

  const rows = list.map((g) => {
    const detail = (g.guests || []).map((p) => p.name).join('; ')
    const link =
      typeof window !== 'undefined'
        ? `${window.location.origin}/rsvp/${g.token}`
        : `/rsvp/${g.token}`

    return [
      g.family,
      g.token,
      g.passes,
      (g.members || []).join('; '),
      g.attending ?? '',
      g.status,
      g.notes || '',
      g.song || '',
      detail,
      link,
    ]
  })

  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  return [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n')
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
