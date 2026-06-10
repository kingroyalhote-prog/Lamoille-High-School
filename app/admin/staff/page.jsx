import Link from "next/link"
import { supabase } from "../../../lib/supabase"
import StaffUsernameSearch from "../../../components/StaffUsernameSearch"

export const dynamic = "force-dynamic"

export default async function StaffDatabasePage() {
  const { data: staff, error } = await supabase
    .from("staff_profiles")
    .select("*")
    .order("roblox_username", { ascending: true })

  if (error) {
    console.log("Staff Database Error:", error)
  }

  const activeCount =
    staff?.filter((s) => s.status === "active").length || 0

  const blacklistedCount =
    staff?.filter(
      (s) =>
        s.status === "employment_blacklisted" ||
        s.do_not_hire === true
    ).length || 0

  const formerCount =
    staff?.filter(
      (s) =>
        s.status === "terminated" ||
        s.status === "resigned"
    ).length || 0

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <div style={{ marginBottom: 30 }}>
            <p className="section-label">Staff Database</p>

            <h1>Staff Records</h1>

            <p className="muted">
              Manage employment history, warnings,
              performance, hiring eligibility,
              disciplinary records, and staffing decisions.
            </p>
          </div>

          <div className="card-grid">

            <div className="card">
              <h3>Active Staff</h3>

              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#16a34a",
                }}
              >
                {activeCount}
              </p>
            </div>

            <div className="card">
              <h3>Former Staff</h3>

              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#64748b",
                }}
              >
                {formerCount}
              </p>
            </div>

            <div className="card">
              <h3>Blacklisted</h3>

              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#dc2626",
                }}
              >
                {blacklistedCount}
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

          <div
            className="card"
            style={{ marginTop: 30 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ margin: 0 }}>
                Staff Profiles
              </h3>

              <Link
                href="/admin/staff/new"
                className="btn-primary"
              >
                Create Profile
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {staff?.length ? (
                staff.map((person) => (
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
                        transition: "all .2s ease",
                      }}
                    >
                      <div>
                        <strong>
                          {person.roblox_username}
                        </strong>

                        <div
                          style={{
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {person.position || "No Position"}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {person.do_not_hire && (
                          <span
                            style={{
                              background: "#fee2e2",
                              color: "#991b1b",
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            DO NOT HIRE
                          </span>
                        )}

                        <span
                          style={{
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          {person.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No staff profiles found.</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
