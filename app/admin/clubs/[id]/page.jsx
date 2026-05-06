"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

const STATUS_OPTIONS = [
  "Club Active",
  "Club Suspended",
  "Club Removed",
  "Club On Hold",
]

export default function EditClubPage() {
  const params = useParams()
  const id = params?.id

  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadClub() {
      if (!id) return

      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setMessage("Error loading club: " + error.message)
      } else {
        setClub(data)
      }

      setLoading(false)
    }

    loadClub()
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const updatedClub = {
      title: form.title.value,
      image_url: form.image_url.value,
      summary: form.summary.value,
      description: form.description.value,
      advisor: form.advisor.value,
      status: form.status.value,
      is_published: form.is_published.checked,
      display_order: Number(form.display_order.value || 0),
    }

    const { error } = await supabase
      .from("clubs")
      .update(updatedClub)
      .eq("id", id)

    setSaving(false)

    if (error) {
      setMessage("Error saving club: " + error.message)
      return
    }

    setMessage("Club updated successfully.")
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this club? This cannot be undone."
    )

    if (!confirmed) return

    const { error } = await supabase.from("clubs").delete().eq("id", id)

    if (error) {
      setMessage("Error deleting club: " + error.message)
      return
    }

    window.location.href = "/admin/clubs"
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading club...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!club) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Club Not Found</h1>
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
          <h1>Edit Club</h1>
          <p className="muted">Update club information and visibility.</p>

          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "24px" }}>
            <label>Club Title</label>
            <input name="title" required defaultValue={club.title || ""} style={inputStyle} />

            <label>Picture URL</label>
            <input name="image_url" defaultValue={club.image_url || ""} style={inputStyle} />

            <label>Short Summary</label>
            <textarea name="summary" rows="3" defaultValue={club.summary || ""} style={inputStyle} />

            <label>More Information</label>
            <textarea name="description" rows="6" defaultValue={club.description || ""} style={inputStyle} />

            <label>Club Advisor</label>
            <input name="advisor" defaultValue={club.advisor || ""} style={inputStyle} />

            <label>Club Status</label>
            <select name="status" defaultValue={club.status || "Club Active"} style={inputStyle}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label>Display Order</label>
            <input name="display_order" type="number" defaultValue={club.display_order || 0} style={inputStyle} />

            <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input name="is_published" type="checkbox" defaultChecked={club.is_published} />
              Show on public clubs page
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
                Delete Club
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
