"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../../../lib/supabase"

export default function StaffBlacklistPage() {
  const [blacklisted, setBlacklisted] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlacklist()
  }, [])

  async function loadBlacklist() {
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*")
      .order("roblox_username", { ascending: true })

    if (error) {
      console.error("Blacklist Error:", error)
    }

    const filtered = (data || []).filter(
      (person) =>
        person.status === "employment_blacklisted" ||
        person.do_not_hire === true
    )

    setBlacklisted(filtered)
    setLoading(false)
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <Link
            href="/admin/staff"
            className="admin-action-btn admin-neutral"
            style={{ display: "inline-block", marginBottom: 18 }}
          >
            ← Back to Staff Database
          </Link>

          <div style={{ marginBottom: 30 }}>
            <p className="section-label">Staff Database</p>
            <h1>Employment Blacklist</h1>
            <p className="muted">
              View all active employment blacklists and attached reasons.
            </p>
          </div>

          {loading ? (
            <div className="card">
              <p>Loading blacklist...</p>
            </div>
          ) : (
            <div className="card-grid">
              {blacklisted.length ? (
                blacklisted.map((person) => (
                  <div key={person.id} className="card">
                    <p
                      style={{
                        display: "inline-block",
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        marginBottom: 12,
                      }}
                    >
                      DO NOT HIRE
                    </p>

                    <h3>{person.roblox_username}</h3>

                    <p className="muted">
                      {person.position || "No Position"} •{" "}
                      {person.department || "No Department"}
                    </p>

                    <div
                      style={{
                        marginTop: 14,
                        padding: 14,
                        borderRadius: 14,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong>Reason:</strong>
                      <p style={{ marginTop: 6 }}>
                        {person.blacklist_reason || "No reason attached."}
                      </p>
                    </div>

                    <Link
                      href={`/admin/staff/${person.id}`}
                      className="btn-primary"
                      style={{ marginTop: 16, display: "inline-block" }}
                    >
                      Open Profile
                    </Link>
                  </div>
                ))
              ) : (
                <div className="card">
                  <h3>No Active Blacklists</h3>
                  <p className="muted">
                    There are currently no staff members on the employment blacklist.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
