"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function MaintenanceSwitch() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("maintenance_mode")
        .eq("id", 1)
        .single()

      setEnabled(data?.maintenance_mode || false)
    }

    load()
  }, [])

  async function handleSwitch() {
    const newValue = !enabled
    setEnabled(newValue)

    await supabase
      .from("site_settings")
      .update({ maintenance_mode: newValue })
      .eq("id", 1)
  }

  return (
    <div className="card">
      <h3>Website Maintenance</h3>
      <p className="muted">
        Turn the public website off while keeping admin access available.
      </p>

      <label className="maintenance-switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleSwitch}
        />
        <span className="maintenance-slider"></span>
      </label>

      <p style={{ marginTop: "12px", fontWeight: 700 }}>
        {enabled ? "Website is OFF" : "Website is ON"}
      </p>
    </div>
  )
}
