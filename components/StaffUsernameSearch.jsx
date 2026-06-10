"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export default function StaffUsernameSearch() {
  const [username, setUsername] = useState("")
  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function searchStaff(e) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setProfile(null)
    setLogs([])

    const cleanUsername = username.trim()

    if (!cleanUsername) {
      setLoading(false)
      return
    }

    const { data: foundProfile } = await supabase
      .from("staff_profiles")
      .select("*")
      .ilike("roblox_username", cleanUsername)
      .single()

    if (foundProfile) {
      setProfile(foundProfile)

      const { data: foundLogs } = await supabase
        .from("staff_logs")
        .select("*")
        .eq("staff_profile_id", foundProfile.id)
        .order("created_at", { ascending: false })

      setLogs(foundLogs || [])
    }

    setLoading(false)
  }

  const isDoNotHire =
    profile?.do_not_hire ||
    profile?.status === "employment_blacklisted" ||
    (profile?.cooldown_until &&
      new Date(profile.cooldown_until) > new Date())

  return (
    <div className="card" style={{ marginTop: 30 }}>
      <h3>Search Staff by Roblox Username</h3>
      <p className="muted">
        Look up staff profiles, logs, warnings, performance, and hiring status.
      </p>

      <form onSubmit={searchStaff} style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Roblox username..."
          style={{
            flex: 1,
            padding: "13px 14px",
            borderRadius: 14,
            border: "1px solid #cbd5e1",
            fontFamily: "inherit",
          }}
        />

        <button className="btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && !profile && !loading && (
        <div style={{ marginTop: 20 }}>
          <h3>No profile found</h3>
          <p className="muted">
            No staff profile exists for that Roblox username.
          </p>
        </div>
      )}

      {profile && (
        <div style={{ marginTop: 24 }}>
          {isDoNotHire && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: 16,
                borderRadius: 16,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              🚫 DO NOT HIRE
              {profile.blacklist_reason && (
                <p style={{ margin: "8px 0 0", fontWeight: 600 }}>
                  Reason: {profile.blacklist_reason}
                </p>
              )}
              {profile.cooldown_until && (
                <p style={{ margin: "8px 0 0", fontWeight: 600 }}>
                  Cooldown Until: {profile.cooldown_until}
                </p>
              )}
            </div>
          )}

          <div
            style={{
              padding: 18,
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              background: "#f8fafc",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{profile.roblox_username}</h2>
            <p><strong>Position:</strong> {profile.position || "None"}</p>
            <p><strong>Status:</strong> {profile.status || "active"}</p>
            <p><strong>Performance:</strong> {profile.performance || "Not rated"}</p>

            <Link href={`/admin/staff/${profile.id}`} className="btn-primary">
              Open Full Profile
            </Link>
          </div>

          <h3 style={{ marginTop: 24 }}>Logs</h3>

          {logs.length ? (
            logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: 16,
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  marginTop: 12,
                }}
              >
                <strong>{log.log_type}: {log.title}</strong>
                <p className="muted" style={{ marginTop: 6 }}>
                  {log.description || "No description."}
                </p>
              </div>
            ))
          ) : (
            <p className="muted">No logs found for this profile.</p>
          )}
        </div>
      )}
    </div>
  )
}
