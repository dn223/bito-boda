import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  computeStats,
  createGuest,
  deleteGuest,
  familyKey,
  getWeddingConfig,
  guestsToCsv,
  downloadCsv,
  listGuests,
  updateGuest,
} from '../services/guestsApi'

export function useGuests() {
  const [guests, setGuests] = useState([])
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [guestList, weddingConfig] = await Promise.all([
        listGuests(),
        getWeddingConfig(),
      ])
      setGuests(guestList)
      setWedding(weddingConfig)
    } catch (err) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const stats = useMemo(() => computeStats(guests), [guests])

  const saveGuest = useCallback(async (id, patch) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateGuest(id, patch)
      setGuests((prev) => prev.map((g) => (g.id === id ? updated : g)))
      return updated
    } catch (err) {
      setError(err.message || 'Error al guardar')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const addGuest = useCallback(async (payload) => {
    setSaving(true)
    setError(null)
    try {
      const created = await createGuest(payload)
      setGuests((prev) => [created, ...prev])
      return created
    } catch (err) {
      setError(err.message || 'Error al crear')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  // Crea las familias una por una (cada una con su token nuevo). Las que ya
  // existen con el mismo nombre se saltan, así repetir la importación no duplica.
  const importGuests = useCallback(async (entries, onProgress) => {
    setSaving(true)
    setError(null)
    const existing = new Set(guests.map((g) => familyKey(g.family)))
    const created = []
    try {
      for (const entry of entries) {
        if (existing.has(familyKey(entry.family))) continue
        const guest = await createGuest({ ...entry, passes: entry.members.length })
        existing.add(familyKey(entry.family))
        created.push(guest)
        onProgress?.(created.length)
      }
      return created
    } catch (err) {
      setError(err.message || 'Error al importar')
      throw err
    } finally {
      if (created.length) setGuests((prev) => [...[...created].reverse(), ...prev])
      setSaving(false)
    }
  }, [guests])

  const removeGuest = useCallback(async (id) => {
    setSaving(true)
    setError(null)
    try {
      await deleteGuest(id)
      setGuests((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      setError(err.message || 'Error al eliminar')
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const exportCsv = useCallback(() => {
    const csv = guestsToCsv(guests)
    downloadCsv(`invitados-${wedding?.coupleLabel || 'boda'}.csv`, csv)
  }, [guests, wedding])

  return {
    guests,
    wedding,
    stats,
    loading,
    saving,
    error,
    refresh,
    saveGuest,
    addGuest,
    importGuests,
    removeGuest,
    exportCsv,
  }
}
