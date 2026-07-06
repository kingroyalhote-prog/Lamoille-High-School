"use client"

import { useEffect, useState } from "react"

export default function SummerSemesterPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("robloxGroupPopupSeen")

    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setShow(true)
        sessionStorage.setItem("robloxGroupPopupSeen", "true")
      }, 700)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="summer-popup-overlay">
      <div className="summer-popup">
        <button
          className="summer-popup-close"
          onClick={() => setShow(false)}
        >
          ×
        </button>

        <div className="summer-popup-content">
          <p className="summer-popup-pill">Lamoille ISD Update</p>

          <h2>
            Join Our New Roblox Group
          </h2>

          <p className="summer-popup-dates">
            New Official Community
          </p>

          <p>
            We had to make a new Roblox group due to unforeseen events. Please
            join the new Lamoille Independent School District group to stay
            connected with our community.
          </p>

          <a
            href="https://www.roblox.com/communities/1022057335/Lamoille-Independent-School-District#!/about"
            className="summer-popup-btn"
            target="_blank"
            rel="noreferrer"
          >
            Join Roblox Group
          </a>
        </div>
      </div>
    </div>
  )
}
