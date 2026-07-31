"use client"

import { useEffect, useMemo, useState } from "react"

function getTimeParts(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

function formatPart(value) {
  return String(value).padStart(2, "0")
}

export default function SchoolBoardResultsCountdown({ releaseAt }) {
  const releaseTime = useMemo(() => new Date(releaseAt).getTime(), [releaseAt])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const nextNow = Date.now()
      setNow(nextNow)

      if (nextNow >= releaseTime) {
        window.location.reload()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [releaseTime])

  const timeLeft = getTimeParts(releaseTime - now)

  return (
    <div className="results-countdown-grid">
      <div className="results-countdown-unit">
        <strong>{formatPart(timeLeft.days)}</strong>
        <span>Days</span>
      </div>

      <div className="results-countdown-unit">
        <strong>{formatPart(timeLeft.hours)}</strong>
        <span>Hours</span>
      </div>

      <div className="results-countdown-unit">
        <strong>{formatPart(timeLeft.minutes)}</strong>
        <span>Minutes</span>
      </div>

      <div className="results-countdown-unit">
        <strong>{formatPart(timeLeft.seconds)}</strong>
        <span>Seconds</span>
      </div>
    </div>
  )
}
