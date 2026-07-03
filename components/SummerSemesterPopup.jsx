"use client"

import { useEffect, useState } from "react"

export default function SummerSemesterPopup() {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("julyFourthPopupSeen")

    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setShow(true)
        sessionStorage.setItem("julyFourthPopupSeen", "true")
      }, 700)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="summer-popup-overlay">
      <div className="summer-popup">
        <div className="summer-fireworks" aria-hidden="true">
          <span className="firework firework-one"></span>
          <span className="firework firework-two"></span>
          <span className="firework firework-three"></span>
        </div>

        <button className="summer-popup-close" onClick={() => setShow(false)}>
          ×
        </button>

        <div className="summer-popup-content">
          <p className="summer-popup-pill">Fourth of July Holiday</p>

          <h2>Happy Fourth of July from Lamoille ISD</h2>

          <p className="summer-popup-dates">
            Offices Closed Until July 6
          </p>

          <p>
            Lamoille ISD offices are closed for the Independence Day holiday
            weekend and will reopen on Monday, July 6.
          </p>

          {expanded && (
            <div className="summer-popup-more">
              <p>
                Families, students, and staff can still check the website for
                announcements, calendar updates, and other district information
                while offices are closed.
              </p>

              <p>
                We hope everyone has a safe, fun, and relaxing holiday weekend.
              </p>
            </div>
          )}

          <button
            className="summer-popup-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Holiday Details"}
          </button>
        </div>
      </div>
    </div>
  )
}
