"use client"

import { useState } from "react"
import { supabase } from "../../../../lib/supabase"

export default function NewLeaderPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    const form = event.currentTarget

    const newLeader = {
      leader_type: form.leader_type.value,
      roleplay_name: form.roleplay_name.value,
      roblox_username: form.roblox_username.value,
      title: form.title.value,
      email: form.email.value,
      fun_fact: form.fun_fact.value,
      image_url: form.image_url.value,
      is_published: form.is_published.checked,
      display_order: Number(form.display_order.value || 0),
    }

    const { error } = await supabase
      .from("leadership_members")
      .insert([newLeader])

    setSaving(false)

    if (error) {
      setMessage("Error creating leader: " + error.message)
      return
    }

    window.location.href = "/admin/leadership"
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Add New Leader</h1>

          <p className="muted">
            Create a district or school leadership profile.
          </p>

          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ marginTop: "24px" }}
          >
            <label>Leader Type</label>
            <select name="leader_type" defaultValue="district" style={inputStyle}>
              <option value="district">District Leader</option>
              <option value="school">School Leader</option>
              <option value="board">School Board Member</option>
            </select>

            <label>Roleplay Name</label>
            <input name="roleplay_name" required style={inputStyle} />

            <label>Roblox Username</label>
            <input name="roblox_username" style={inputStyle} />

            <label>Title</label>
            <input
              name="title"
              placeholder="Superintendent, Principal, Assistant Principal, etc."
              style={inputStyle}
            />

            <label>Email</label>
            <input name="email" type="email" style={inputStyle} />

            <label>Fun Fact</label>
            <textarea name="fun_fact" rows="4" style={inputStyle} />

            <label>Picture Link</label>
            <input
              name="image_url"
              placeholder="/images/person.png or image URL"
              style={inputStyle}
            />

            <label>Display Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue="0"
              style={inputStyle}
            />

            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input name="is_published" type="checkbox" defaultChecked />
              Show on public leadership page
            </label>

            {message && <p style={{ color: "#b91c1c" }}>{message}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ marginTop: "16px", width: "fit-content" }}
            >
              {saving ? "Saving..." : "Create Leader"}
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
