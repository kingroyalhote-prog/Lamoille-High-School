"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

export default function EditLeaderPage() {
  const params = useParams()
  const id = params?.id

  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadLeader() {
      if (!id) return

      const { data, error } = await supabase
        .from("leadership_members")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setMessage("Error loading leader: " + error.message)
      } else {
        setLeader(data)
      }

      setLoading(false)
    }

    loadLeader()
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const updatedLeader = {
      leader_type: form.leader_type.value,
      roleplay_name: form.roleplay_name.value,
      roblox_username: form.roblox_username.value,
      title: form.title.value,
      email: form.email.value,
      fun_fact: form.fun_fact.value,
      image_url: form.image_url.value,
      is_published: form.is_published.checked,
      display_order: Number(form.display_order.value || 0),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("leadership_members")
      .update(updatedLeader)
      .eq("id", id)

    setSaving(false)

    if (error) {
      setMessage("Error saving leader: " + error.message)
      return
    }

    setMessage("Leader updated successfully.")
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this leader? This cannot be undone."
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("leadership_members")
      .delete()
      .eq("id", id)

    if (error) {
      setMessage("Error deleting leader: " + error.message)
      return
    }

    window.location.href = "/admin/leadership"
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading leader...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!leader) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Leader Not Found</h1>
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
          <h1>Edit Leader</h1>

          <p className="muted">
            Update leadership profile details and visibility.
          </p>

          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ marginTop: "24px" }}
          >
            <label>Leader Type</label>
            <select
              name="leader_type"
              defaultValue={leader.leader_type || "district"}
              style={inputStyle}
            >
              <option value="district">District Leader</option>
              <option value="school">School Leader</option>
              <option value="board">School Board Member</option>
            </select>

            <label>Roleplay Name</label>
            <input
              name="roleplay_name"
              required
              defaultValue={leader.roleplay_name || ""}
              style={inputStyle}
            />

            <label>Roblox Username</label>
            <input
              name="roblox_username"
              defaultValue={leader.roblox_username || ""}
              style={inputStyle}
            />

            <label>Title</label>
            <input
              name="title"
              defaultValue={leader.title || ""}
              style={inputStyle}
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              defaultValue={leader.email || ""}
              style={inputStyle}
            />

            <label>Fun Fact</label>
            <textarea
              name="fun_fact"
              rows="4"
              defaultValue={leader.fun_fact || ""}
              style={inputStyle}
            />

            <label>Picture Link</label>
            <input
              name="image_url"
              defaultValue={leader.image_url || ""}
              style={inputStyle}
            />

            <label>Display Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue={leader.display_order || 0}
              style={inputStyle}
            />

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={leader.is_published}
              />
              Show on public leadership page
            </label>

            {message && (
              <p
                style={{
                  color: message.includes("Error") ? "#b91c1c" : "#166534",
                }}
              >
                {message}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "16px",
              }}
            >
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="admin-action-btn admin-delete"
              >
                Delete Leader
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
