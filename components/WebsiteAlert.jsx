"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function WebsiteAlert() {
  const [alert, setAlert] = useState(null)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    async function loadAlert() {
      const { data } = await supabase
        .from("site_settings")
        .select("alert_enabled, alert_title, alert_message")
        .eq("id", 1)
        .single()

      if (data?.alert_enabled) {
        setAlert(data)
      }
    }

    loadAlert()
  }, [])

  if (!alert || closed) return null

  return (
    <div className="website-alert">

      <div className="website-alert-icon">
        !
      </div>

      <div className="website-alert-text">

        <div className="website-alert-header">
          <span className="website-alert-label">
            ALERT
          </span>

          <span className="website-alert-divider">
            |
          </span>

          <span className="website-alert-title">
            {alert.alert_title}
          </span>
        </div>

        <p>{alert.alert_message}</p>

      </div>

      <button
        className="website-alert-close"
        onClick={() => setClosed(true)}
        aria-label="Close alert"
      >
        ×
      </button>

    </div>
  )
}
