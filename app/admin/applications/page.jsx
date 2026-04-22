import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

function getStatusStyles(status) {
  switch (status) {
    case "accepted":
      return {
        label: "ACCEPTED",
        background: "#dcfce7",
        color: "#166534",
      }
    case "denied":
      return {
        label: "DENIED",
        background: "#fee2e2",
        color: "#991b1b",
      }
    default:
      return {
        label: "NOT REVIEWED",
        background: "#e2e8f0",
        color: "#334155",
      }
  }
}

export default async function ApplicationsPage() {
  const { data: applications, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      full_name,
      email,
      status,
      job_posting_id,
      job_postings ( title )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.log("Applications query error:", error)
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-label">Admin</p>
              <h1>Applications</h1>
            </div>
          </div>

          <div className="card-grid">
            {applications?.length ? (
              applications.map((app) => {
                const statusStyles = getStatusStyles(app.status)

                return (
                  <div
                    key={app.id}
                    className="card"
                    style={{ position: "relative" }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        background: statusStyles.background,
                        color: statusStyles.color,
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {statusStyles.label}
                    </span>

                    <h3>{app.full_name || "Unnamed Applicant"}</h3>
                    <p>{app.email || "No email provided"}</p>

                    <p style={{ marginTop: "6px" }}>
                      <strong>Position:</strong>{" "}
                      {app.job_postings?.title || "Unknown"}
                    </p>

                    <p className="muted" style={{ marginTop: "6px" }}>
                      {app.created_at
                        ? new Date(app.created_at).toLocaleDateString()
                        : "Unknown date"}
                    </p>

                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="btn-primary"
                      style={{ marginTop: "10px", display: "inline-block" }}
                    >
                      View Application
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="card">
                <h3>No applications yet</h3>
                <p>Applications will appear here once submitted.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
