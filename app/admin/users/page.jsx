"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"

export default function AdminUsersPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [message, setMessage] = useState("")
  const [workingId, setWorkingId] = useState(null)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    const { data: myProfile, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .maybeSingle()

    if (error || !myProfile) {
      router.replace("/login")
      return
    }

    if (myProfile.role !== "master_admin") {
      router.replace("/admin")
      return
    }

    setCurrentUser(myProfile)
    setAuthorized(true)
    await loadProfiles()
    setLoading(false)
  }

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .order("email", { ascending: true })

    if (error) {
      setMessage(error.message || "Could not load users.")
      return
    }

    setProfiles(data || [])
  }

  async function updateRole(profileId, newRole) {
    setWorkingId(profileId)
    setMessage("")

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId)

    if (error) {
      setMessage(error.message || "Could not update role.")
      setWorkingId(null)
      return
    }

    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p))
    )
    setWorkingId(null)
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!authorized) return null

  return (
    <main className="content">
      <section className="section">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="section-head">
            <div>
              <p className="section-label">Master Admin</p>
              <h1>Manage Admins</h1>
              <p className="muted">
                Promote or remove admin access. Regular admins cannot access this page.
              </p>
            </div>
          </div>

          {message ? (
            <p className="muted" style={{ marginBottom: "16px" }}>
              {message}
            </p>
          ) : null}

          <div className="card" style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "16px" }}>Users</h3>

            <div style={{ display: "grid", gap: "12px" }}>
              {profiles.length ? (
                profiles.map((profile) => {
                  const isMe = currentUser?.id === profile.id
                  const isMaster = profile.role === "master_admin"
                  const isAdmin = profile.role === "admin"

                  return (
                    <div
                      key={profile.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        padding: "14px 16px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                          {profile.email || "No email"}
                        </p>
                        <p className="muted" style={{ margin: 0 }}>
                          Role: {profile.role || "user"}
                          {isMe ? " • You" : ""}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {!isMaster ? (
                          <>
                            {!isAdmin ? (
                              <button
                                className="btn-primary"
                                disabled={workingId === profile.id}
                                onClick={() => updateRole(profile.id, "admin")}
                              >
                                Make Admin
                              </button>
                            ) : (
                              <button
                                disabled={workingId === profile.id}
                                onClick={() => updateRole(profile.id, "user")}
                                style={dangerButton}
                              >
                                Remove Admin
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="muted" style={{ fontWeight: 700 }}>
                            Master Admin
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="muted">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const dangerButton = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px 18px",
  borderRadius: "999px",
  fontWeight: 700,
  cursor: "pointer",
}
