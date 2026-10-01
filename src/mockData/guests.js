export const WEDDING = {
  bride: 'Coni',
  groom: 'Bito',
  coupleLabel: 'Bito & Coni',
  date: '2026-12-20T17:00:00',
  dateLabel: '20 de Diciembre de 2026',
  dateBig: 'Domingo 20 de Diciembre',
  venueCapacity: 120,
  ceremony: {
    title: 'Ceremonia Religiosa',
    time: '3:30 PM',
    place: 'Finca San Nicolás',
    address: 'Av. Génova, Urb. Cumbres de San Francisco, San Salvador',
    mapsUrl: 'https://maps.app.goo.gl/N4bBSFyj5BvPFkEb8',
    wazeUrl:
      'https://ul.waze.com/ul?venue_id=177471625.1774585175.21894723&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
  },
  itinerary: [
    { id: 1, time: '15:00', title: 'Recepción', description: 'Llegada de invitados a la finca' },
    { id: 2, time: '15:30', title: 'Ceremonia', description: 'Celebración religiosa' },
    { id: 3, time: '16:30', title: 'Bendición', description: 'Momento de oración y fotos' },
    { id: 4, time: '17:00', title: 'Brindis', description: 'Celebración con los novios' },
  ],
  dressCode: 'Gala',
  gifts: 'Regalo de sobre',
}

export function getDashboardStats(list = []) {
  const totalPasses = list.reduce((sum, g) => sum + g.passes, 0)
  const confirmed = list.filter((g) => g.status === 'confirmed')
  const pending = list.filter((g) => g.status === 'pending')
  const declined = list.filter((g) => g.status === 'declined')
  const attendingCount = confirmed.reduce((sum, g) => sum + (g.attending ?? 0), 0)

  return {
    totalFamilies: list.length,
    totalPasses,
    confirmedFamilies: confirmed.length,
    pendingFamilies: pending.length,
    declinedFamilies: declined.length,
    attendingCount,
    statusChart: [
      { name: 'Confirmados', value: confirmed.length, color: '#87967e' },
      { name: 'Pendientes', value: pending.length, color: '#c9b896' },
      { name: 'Declinados', value: declined.length, color: '#c48787' },
    ],
  }
}
