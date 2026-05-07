"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

const STATUS_OPTIONS = [
  "Sport Active",
  "Off Season",
  "Sport Suspended",
]

export default function EditSportPage() {
  const params = useParams()
  const id = params?.id

  const [sport, setSport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadSport() {
      if (!id) return

      const { data, error } = await supabase
        .from("athletics")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setMessage("Error loading sport: " + error.message)
      } else {
        setSport(data)
      }

      setLoading(false)
    }

    loadSport()
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const updatedSport = {
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

    const { error } = await supabase
      .from("athletics")
      .update(updatedSport)
      .eq("id", id)

    setSaving(false)

    if (error) {
      setMessage("Error saving sport: " + error.message)
      return
    }

    setMessage("Sport updated successfully.")
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sport? This cannot be undone."
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("athletics")
      .delete()
      .eq("id", id)

    if (error) {
      setMessage("Error deleting sport: " + error.message)
      return
    }

    window.location.href = "/admin/athletics"
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading sport...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!sport) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Sport Not Found</h1>
              {message && <p style={{ color: "#b91c1c" }}>{message}</p>}
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Edit Sport</h1>
          <p className="muted">Update athletic program information and registration settings.</p>

          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "24px" }}>
            <label>Sport Name</label>
            <input name="name" required defaultValue={sport.name || ""} style={inputStyle} />

            <label>Picture URL</label>
            <input name="image_url" defaultValue={sport.image_url || ""} style={inputStyle} />

            <label>Short Summary</label>
            <textarea name="summary" rows="3" defaultValue={sport.summary || ""} style={inputStyle} />

            <label>More Information</label>
            <textarea name="description" rows="6" defaultValue={sport.description || ""} style={inputStyle} />

            <label>Meeting Days</label>
            <input name="meeting_days" defaultValue={sport.meeting_days || ""} style={inputStyle} />

            <label>Location</label>
            <input name="location" defaultValue={sport.location || ""} style={inputStyle} />

            <label>Head Coach</label>
            <input name="head_coach" defaultValue={sport.head_coach || ""} style={inputStyle} />

            <label>Other Coaches</label>
            <input name="other_coaches" defaultValue={sport.other_coaches || ""} style={inputStyle} />

            <label>Sport Status</label>
            <select name="status" defaultValue={sport.status || "Sport Active"} style={inputStyle}>
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
              defaultValue={sport.display_order || 0}
              style={inputStyle}
            />

            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                name="registration_open"
                type="checkbox"
                defaultChecked={sport.registration_open}
              />
              Registration open
            </label>

            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={sport.is_published}
              />
              Show on public athletics page
            </label>

            {message && (
              <p style={{ color: message.includes("Error") ? "#b91c1c" : "#166534" }}>
                {message}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button type="button" onClick={handleDelete} className="admin-action-btn admin-delete">
                Delete Sport
              </button>
            </div>
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
