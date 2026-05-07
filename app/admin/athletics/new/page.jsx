"use client"

import { useState } from "react"
import { supabase } from "../../../../lib/supabase"

const STATUS_OPTIONS = [
  "Sport Active",
  "Off Season",
  "Sport Suspended",
]

export default function NewSportPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const newSport = {
      name: form.name.value,
      image_url: form.image_url.value,
      summary: form.summary.value,
      description: form.description.value,
      meeting_days: form.meeting_days.value,
      location: form.location.value,
      head_coach: form.head_coach.value,
      other_coaches: form.other_coaches.value,
      status: form.status.value,
      registration_open: form.registration_open.checked,
      is_published: form.is_published.checked,
      display_order: Number(form.display_order.value || 0),
    }

    const { error } = await supabase.from("athletics").insert([newSport])

    setSaving(false)

    if (error) {
      setMessage("Error creating sport: " + error.message)
      return
    }

    window.location.href = "/admin/athletics"
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Add New Sport</h1>
          <p className="muted">Create a new athletics listing.</p>

          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "24px" }}>
            <label>Sport Name</label>
            <input name="name" required style={inputStyle} />

            <label>Picture URL</label>
            <input
              name="image_url"
              placeholder="/images/sport-photo.png or image URL"
              style={inputStyle}
            />

            <label>Short Summary</label>
            <textarea name="summary" rows="3" style={inputStyle} />

            <label>More Information</label>
            <textarea name="description" rows="6" style={inputStyle} />

            <label>Meeting Days</label>
            <input
              name="meeting_days"
              placeholder="Mondays and Wednesdays after school"
              style={inputStyle}
            />

            <label>Location</label>
            <input
              name="location"
              placeholder="Gym, field, classroom, etc."
              style={inputStyle}
            />

            <label>Head Coach</label>
            <input name="head_coach" style={inputStyle} />

            <label>Other Coaches</label>
            <input
              name="other_coaches"
              placeholder="Separate names with commas"
              style={inputStyle}
            />

            <label>Sport Status</label>
            <select name="status" defaultValue="Sport Active" style={inputStyle}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label>Display Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue="0"
              style={inputStyle}
            />

            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input name="registration_open" type="checkbox" defaultChecked />
              Registration open
            </label>

            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input name="is_published" type="checkbox" defaultChecked />
              Show on public athletics page
            </label>

            {message && <p style={{ color: "#b91c1c" }}>{message}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ marginTop: "16px", width: "fit-content" }}
            >
              {saving ? "Saving..." : "Create Sport"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  marginTop: "6px",
  marginBottom: "16px",
  fontFamily: "inherit",
}
