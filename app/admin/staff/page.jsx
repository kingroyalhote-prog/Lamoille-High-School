"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../../lib/supabase"
import StaffUsernameSearch from "../../../components/StaffUsernameSearch"

export default function StaffDatabasePage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStaff()
  }, [])

  async function loadStaff() {
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*")
      .order("roblox_username", { ascending: true })

    if (error) {
      console.error("Staff Database Error:", error)
    }

    setStaff(data || [])
    setLoading(false)
  }

  const activeStaff = staff.filter((s) => s.status === "active")

  const activeCount = activeStaff.length

  const blacklistedCount = staff.filter(
    (s) => s.status === "employment_blacklisted" || s.do_not_hire === true
  ).length

  const formerCount = staff.filter(
    (s) => s.status === "terminated" || s.status === "resigned"
  ).length

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 30 }}>
            <p className="section-label">Staff Database</p>
            <h1>Staff Records</h1>
            <p className="muted">
              Manage employment history, warnings, performance, hiring
              eligibility, disciplinary records, and staffing decisions.
            </p>
          </div>

          <div className="card-grid">
            <div className="card">
              <h3>Active Staff</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#16a34a" }}>
                {loading ? "..." : activeCount}
              </p>
            </div>

            <div className="card">
              <h3>Former Staff</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#64748b" }}>
                {loading ? "..." : formerCount}
              </p>
            </div>

            <div className="card">
              <h3>Blacklisted</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#dc2626" }}>
                {loading ? "..." : blacklistedCount}
              </p>

              <Link
                href="/admin/staff/blacklist"
                className="btn-primary"
                style={{ marginTop: 12 }}
              >
                View Blacklist
              </Link>
            </div>
          </div>

          <StaffUsernameSearch />

          <div className="card" style={{ marginTop: 30 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Active Staff Profiles</h3>
                <p className="muted" style={{ marginTop: 6 }}>
                  Only currently active staff are shown here. Use search to find
                  former or blacklisted staff.
                </p>
              </div>

              <Link href="/admin/staff/new" className="btn-primary">
                Create Profile
              </Link>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {activeStaff.length ? (
                activeStaff.map((person) => (
                  <Link
                    key={person.id}
                    href={`/admin/staff/${person.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        padding: 16,
                        border: "1px solid #e2e8f0",
                        borderRadius: 14,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div>
                        <strong>{person.roblox_username}</strong>

                        <div style={{ color: "#64748b", marginTop: 4 }}>
                          {person.position || "No Position"}
                        </div>
                      </div>

                      <span
                        style={{
                          background: "#dcfce7",
                          color: "#166534",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        ACTIVE
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No active staff profiles found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
