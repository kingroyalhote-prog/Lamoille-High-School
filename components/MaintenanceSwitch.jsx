"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function MaintenanceSwitch() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSetting()
  }, [])

  async function loadSetting() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("maintenance_mode")
      .eq("id", 1)
      .single()

    if (!error) {
      setEnabled(data?.maintenance_mode === true)
    }

    setLoading(false)
  }

  async function handleSwitch() {
    setSaving(true)

    const newValue = !enabled

    const { error } = await supabase
      .from("site_settings")
      .update({
        maintenance_mode: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (!error) {
      setEnabled(newValue)
    } else {
      alert("Could not save website status.")
      console.error(error)
    }

    setSaving(false)
  }

  if (loading) return null

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
          disabled={saving}
        />
        <span className="maintenance-slider"></span>
      </label>

      <p style={{ marginTop: "12px", fontWeight: 700 }}>
        {saving
          ? "Saving..."
          : enabled
          ? "Website is OFF"
          : "Website is ON"}
      </p>
    </div>
  )
}
