"use client"

import { useState } from "react"
import { supabase } from "../../../../lib/supabase"

const STATUS_OPTIONS = [
  "Club Active",
  "Club Suspended",
  "Club Removed",
  "Club On Hold",
]

export default function NewClubPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const newClub = {
      title: form.title.value,
      image_url: form.image_url.value,
      summary: form.summary.value,
      description: form.description.value,
      advisor: form.advisor.value,
      status: form.status.value,
      is_published: form.is_published.checked,
      display_order: Number(form.display_order.value || 0),
    }

    const { error } = await supabase.from("clubs").insert([newClub])

    setSaving(false)

    if (error) {
      setMessage("Error creating club: " + error.message)
      return
    }

    window.location.href = "/admin/clubs"
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Add New Club</h1>
          <p className="muted">Create a new student club listing.</p>

          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "24px" }}>
            <label>Club Title</label>
            <input name="title" required style={inputStyle} />

            <label>Picture URL</label>
            <input
              name="image_url"
              placeholder="/images/club-photo.png or image URL"
              style={inputStyle}
            />

            <label>Short Summary</label>
            <textarea name="summary" rows="3" style={inputStyle} />

            <label>More Information</label>
            <textarea name="description" rows="6" style={inputStyle} />

            <label>Club Advisor</label>
            <input name="advisor" style={inputStyle} />

            <label>Club Status</label>
            <select name="status" defaultValue="Club Active" style={inputStyle}>
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
              <input name="is_published" type="checkbox" defaultChecked />
              Show on public clubs page
            </label>

            {message && <p style={{ color: "#b91c1c" }}>{message}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ marginTop: "16px", width: "fit-content" }}
            >
              {saving ? "Saving..." : "Create Club"}
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
