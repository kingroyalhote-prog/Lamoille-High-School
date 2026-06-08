"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function WebsiteAlertAdmin() {
  const [enabled, setEnabled] = useState(false)
  const [title, setTitle] = useState("Website Alert")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("alert_enabled, alert_title, alert_message")
        .eq("id", 1)
        .single()

      if (data) {
        setEnabled(data.alert_enabled || false)
        setTitle(data.alert_title || "Website Alert")
        setMessage(data.alert_message || "")
      }
    }

    loadSettings()
  }, [])

  async function saveAlert() {
    setSaving(true)

    const { error } = await supabase
      .from("site_settings")
      .update({
        alert_enabled: enabled,
        alert_title: title,
        alert_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (error) {
      alert("Could not save alert.")
      console.error(error)
    } else {
      alert("Website alert saved.")
    }

    setSaving(false)
  }

  return (
    <div className="card">
      <h3>Website Alert</h3>

      <p className="muted">
        Show a small modern alert in the bottom-left corner of the website.
      </p>

      <label className="alert-admin-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        <span>{enabled ? "Alert Enabled" : "Alert Disabled"}</span>
      </label>

      <input
        className="alert-admin-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Alert title"
      />

      <textarea
        className="alert-admin-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Alert message"
        rows={4}
      />

      <button
        className="btn-primary"
        onClick={saveAlert}
        disabled={saving}
        style={{ marginTop: "12px" }}
      >
        {saving ? "Saving..." : "Save Alert"}
      </button>
    </div>
  )
}
