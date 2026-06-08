"use client"

import { useEffect, useState } from "react"

export default function SummerSemesterPopup() {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("summerSemesterPopupSeen")

    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setShow(true)
        sessionStorage.setItem("summerSemesterPopupSeen", "true")
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
          <p className="summer-popup-pill">Summer Semester 2026</p>

          <h2>
            Welcome to the Summer Semester @ Lamoille
          </h2>

          <p className="summer-popup-dates">
            June 10 – August 1
          </p>

          <p>
            We cannot wait to welcome students, staff, and families back to
            campus for an exciting summer semester filled with learning,
            leadership, activities, and school community events.
          </p>

          {expanded && (
            <div className="summer-popup-more">
              <p>
                During the summer semester, students can look forward to
                academic support, club opportunities, athletic involvement,
                community events, and meaningful ways to stay connected with
                Lamoille High School.
              </p>

              <p>
                Please continue checking the school website for announcements,
                calendar updates, and important information from the leadership
                team.
              </p>
            </div>
          )}

          <button
            className="summer-popup-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "More Information"}
          </button>
        </div>
      </div>
    </div>
  )
}
