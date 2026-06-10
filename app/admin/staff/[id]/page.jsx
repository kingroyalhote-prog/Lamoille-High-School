"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

export default function StaffProfilePage() {
  const { id } = useParams()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [logForm, setLogForm] = useState({
    log_type: "Note",
    title: "",
    description: "",
    created_by: "Admin",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)

    const { data: profileData } = await supabase
      .from("staff_profiles")
      .select("*")
      .eq("id", id)
      .single()

    const { data: logData } = await supabase
      .from("staff_logs")
      .select("*")
      .eq("staff_profile_id", id)
      .order("created_at", { ascending: false })

    setProfile(profileData)
    setLogs(logData || [])
    setLoading(false)
  }

  function getCooldownDate() {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().split("T")[0]
  }

  async function sendWebhook(title, description, fields = []) {
    const { data: settings } = await supabase
      .from("staff_settings")
      .select("discord_webhook_url, webhook_enabled")
      .eq("id", 1)
      .single()

    if (!settings?.webhook_enabled || !settings?.discord_webhook_url) return

    await fetch("/api/staff-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhookUrl: settings.discord_webhook_url,
        title,
        description,
        fields,
        color: 15158332,
      }),
    })
  }

  async function addLog(customLog = null) {
    const entry = customLog || logForm

    if (!entry.title.trim()) {
      alert("Please add a log title.")
      return
    }

    const { error } = await supabase.from("staff_logs").insert([
      {
        staff_profile_id: id,
        log_type: entry.log_type,
        title: entry.title.trim(),
        description: entry.description.trim(),
        created_by: entry.created_by || "Admin",
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    await sendWebhook(
      "Staff Log Added",
      `${entry.log_type}: ${entry.title}`,
      [
        { name: "Roblox Username", value: profile.roblox_username || "Unknown" },
        { name: "Type", value: entry.log_type || "Log" },
        { name: "Created By", value: entry.created_by || "Admin" },
      ]
    )

    setLogForm({
      log_type: "Note",
      title: "",
      description: "",
      created_by: "Admin",
    })

    loadProfile()
  }

  async function deleteLog(logId) {
    const confirmDelete = confirm("Delete this log?")
    if (!confirmDelete) return

    await supabase.from("staff_logs").delete().eq("id", logId)
    loadProfile()
  }

  async function updateProfile(updates, logTitle, logDescription) {
    setSaving(true)

    const { error } = await supabase
      .from("staff_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      alert(error.message)
      setSaving(false)
      return
    }

    if (logTitle) {
      await addLog({
        log_type: "Status Update",
        title: logTitle,
        description: logDescription || "",
        created_by: "Admin",
      })
    }

    setSaving(false)
    loadProfile()
  }

  async function saveProfile() {
    await updateProfile(
      {
        roblox_username: profile.roblox_username,
        display_name: profile.display_name,
        position: profile.position,
        department: profile.department,
        performance: profile.performance,
        notes: profile.notes,
      },
      "Profile Updated",
      "Staff profile information was updated."
    )
  }

  async function setStatus(status) {
    if (status === "terminated") {
      await updateProfile(
        {
          status: "terminated",
          cooldown_until: getCooldownDate(),
          do_not_hire: false,
        },
        "Employee Terminated",
        "Employee was marked as terminated and placed on a 30-day employment cooldown."
      )
      return
    }

    if (status === "resigned") {
      await updateProfile(
        {
          status: "resigned",
          cooldown_until: getCooldownDate(),
          do_not_hire: false,
        },
        "Employee Resigned",
        "Employee was marked as resigned and placed on a 30-day employment cooldown."
      )
      return
    }

    if (status === "suspended") {
      await updateProfile(
        { status: "suspended" },
        "Employee Suspended",
        "Employee was marked as suspended."
      )
      return
    }

    if (status === "active") {
      await updateProfile(
        {
          status: "active",
          cooldown_until: null,
        },
        "Employee Set Active",
        "Employee was returned to active status."
      )
    }
  }

  async function blacklist() {
    const reason = prompt("Reason for employment blacklist?")
    if (!reason) return

    await updateProfile(
      {
        status: "employment_blacklisted",
        do_not_hire: true,
        blacklist_reason: reason,
      },
      "Employment Blacklisted",
      reason
    )
  }

  async function revokeBlacklist() {
    await updateProfile(
      {
        do_not_hire: false,
        blacklist_reason: null,
        status: "active",
      },
      "Employment Blacklist Revoked",
      "This staff member was removed from the employment blacklist."
    )
  }

  async function deleteProfile() {
    const confirmDelete = confirm(
      "Are you sure you want to permanently delete this staff profile?"
    )

    if (!confirmDelete) return

    await supabase.from("staff_profiles").delete().eq("id", id)
    router.push("/admin/staff")
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading profile...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Profile Not Found</h1>
          </div>
        </section>
      </main>
    )
  }

  const cooldownActive =
    profile.cooldown_until &&
    new Date(profile.cooldown_until) > new Date()

  const doNotHire =
    profile.do_not_hire ||
    profile.status === "employment_blacklisted"

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <div className="card" style={{ marginBottom: 24 }}>
            <p className="section-label">Staff Profile</p>

            <h1>{profile.roblox_username}</h1>

            {doNotHire && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: 16,
                  borderRadius: 16,
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                🚫 DO NOT HIRE
                {profile.blacklist_reason && (
                  <p style={{ marginTop: 8 }}>
                    Reason: {profile.blacklist_reason}
                  </p>
                )}
              </div>
            )}

            {cooldownActive && !doNotHire && (
              <div
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: 16,
                  borderRadius: 16,
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                ⏳ Employment Cooldown Active Until {profile.cooldown_until}
              </div>
            )}

            <div className="card-grid">
              <input
                className="alert-admin-input"
                value={profile.roblox_username || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    roblox_username: e.target.value,
                  })
                }
                placeholder="Roblox Username"
              />

              <input
                className="alert-admin-input"
                value={profile.display_name || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    display_name: e.target.value,
                  })
                }
                placeholder="Display Name"
              />

              <input
                className="alert-admin-input"
                value={profile.position || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    position: e.target.value,
                  })
                }
                placeholder="Position"
              />

              <input
                className="alert-admin-input"
                value={profile.department || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    department: e.target.value,
                  })
                }
                placeholder="Department"
              />

              <input
                className="alert-admin-input"
                value={profile.performance || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    performance: e.target.value,
                  })
                }
                placeholder="Performance"
              />

              <input
                className="alert-admin-input"
                value={profile.status || ""}
                disabled
              />
            </div>

            <textarea
              className="alert-admin-textarea"
              value={profile.notes || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  notes: e.target.value,
                })
              }
              placeholder="Internal notes"
              style={{ marginTop: 14 }}
            />

            <button
              className="btn-primary"
              onClick={saveProfile}
              disabled={saving}
              style={{ marginTop: 16 }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h3>Quick Actions</h3>

            <div className="admin-action-row">
              <button className="admin-action-btn admin-neutral" onClick={() => setStatus("active")}>
                Set Active
              </button>

              <button className="admin-action-btn admin-neutral" onClick={() => setStatus("suspended")}>
                Suspend
              </button>

              <button className="admin-action-btn admin-deny" onClick={() => setStatus("terminated")}>
                Terminate
              </button>

              <button className="admin-action-btn admin-neutral" onClick={() => setStatus("resigned")}>
                Mark Resigned
              </button>

              <button className="admin-action-btn admin-deny" onClick={blacklist}>
                Employment Blacklist
              </button>

              {profile.do_not_hire && (
                <button className="admin-action-btn admin-accept" onClick={revokeBlacklist}>
                  Revoke Blacklist
                </button>
              )}

              <button className="admin-action-btn admin-delete" onClick={deleteProfile}>
                Delete Profile
              </button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h3>Add Log Entry</h3>

            <select
              className="alert-admin-input"
              value={logForm.log_type}
              onChange={(e) =>
                setLogForm({
                  ...logForm,
                  log_type: e.target.value,
                })
              }
            >
              <option>Note</option>
              <option>Warning</option>
              <option>Performance Review</option>
              <option>Suspension</option>
              <option>Termination</option>
              <option>Resignation</option>
              <option>Promotion</option>
              <option>Demotion</option>
              <option>Blacklist</option>
              <option>Other</option>
            </select>

            <input
              className="alert-admin-input"
              placeholder="Log Title"
              value={logForm.title}
              onChange={(e) =>
                setLogForm({
                  ...logForm,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="alert-admin-textarea"
              placeholder="Description"
              value={logForm.description}
              onChange={(e) =>
                setLogForm({
                  ...logForm,
                  description: e.target.value,
                })
              }
            />

            <input
              className="alert-admin-input"
              placeholder="Created By"
              value={logForm.created_by}
              onChange={(e) =>
                setLogForm({
                  ...logForm,
                  created_by: e.target.value,
                })
              }
            />

            <button
              className="btn-primary"
              onClick={() => addLog()}
              style={{ marginTop: 16 }}
            >
              Add Log
            </button>
          </div>

          <div className="card">
            <h3>Employment Logs</h3>

            {logs.length ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 14,
                  }}
                >
                  <p className="section-label">{log.log_type}</p>
                  <h3>{log.title}</h3>

                  <p className="muted">
                    {log.description || "No description provided."}
                  </p>

                  <p className="muted" style={{ marginTop: 8 }}>
                    Created by {log.created_by || "Admin"} •{" "}
                    {new Date(log.created_at).toLocaleString()}
                  </p>

                  <button
                    className="admin-action-btn admin-delete"
                    onClick={() => deleteLog(log.id)}
                    style={{ marginTop: 10 }}
                  >
                    Delete Log
                  </button>
                </div>
              ))
            ) : (
              <p className="muted">No logs found for this profile.</p>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
