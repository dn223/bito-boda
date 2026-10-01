import { useEffect, useState } from 'react'

function getRemaining(targetDate) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: diff === 0,
  }
}

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => getRemaining(targetDate))

  useEffect(() => {
    const tick = () => setTimeLeft(getRemaining(targetDate))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}
