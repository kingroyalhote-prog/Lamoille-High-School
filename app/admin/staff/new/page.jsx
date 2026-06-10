"use client"

import { useState } from "react"
import { supabase } from "../../../../lib/supabase"

export default function NewStaffProfilePage() {
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    roblox_username: "",
    display_name: "",
    position: "",
    department: "",
    performance: "",
    status: "active",
    notes: "",
    blacklist_reason: "",
  })

  function getCooldownDate() {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().split("T")[0]
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const isBlacklisted = form.status === "employment_blacklisted"
    const needsCooldown =
      form.status === "terminated" || form.status === "resigned"

    const { error } = await supabase.from("staff_profiles").insert([
      {
        roblox_username: form.roblox_username.trim(),
        display_name: form.display_name.trim(),
        position: form.position.trim(),
        department: form.department.trim(),
        performance: form.performance.trim(),
        status: form.status,
        notes: form.notes.trim(),
        do_not_hire: isBlacklisted,
        blacklist_reason: isBlacklisted
          ? form.blacklist_reason.trim()
          : null,
        cooldown_until: needsCooldown ? getCooldownDate() : null,
      },
    ])

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = "/admin/staff"
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 30 }}>
            <p className="section-label">Staff Database</p>
            <h1>Create Staff Profile</h1>
            <p className="muted">Add a new employee record.</p>
          </div>

          <form onSubmit={handleSubmit} className="card">
            <input
              className="alert-admin-input"
              placeholder="Roblox Username"
              value={form.roblox_username}
              onChange={(e) =>
                setForm({ ...form, roblox_username: e.target.value })
              }
              required
            />

            <input
              className="alert-admin-input"
              placeholder="Display Name"
              value={form.display_name}
              onChange={(e) =>
                setForm({ ...form, display_name: e.target.value })
              }
            />

            <input
              className="alert-admin-input"
              placeholder="Position"
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
            />

            <input
              className="alert-admin-input"
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            />

            <input
              className="alert-admin-input"
              placeholder="Performance"
              value={form.performance}
              onChange={(e) =>
                setForm({ ...form, performance: e.target.value })
              }
            />

            <select
              className="alert-admin-input"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
              <option value="employment_blacklisted">
                Employment Blacklisted
              </option>
            </select>

            {form.status === "employment_blacklisted" && (
              <textarea
                className="alert-admin-textarea"
                placeholder="Blacklist Reason"
                value={form.blacklist_reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    blacklist_reason: e.target.value,
                  })
                }
                required
              />
            )}

            <textarea
              className="alert-admin-textarea"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ marginTop: 16 }}
            >
              {saving ? "Creating..." : "Create Profile"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
