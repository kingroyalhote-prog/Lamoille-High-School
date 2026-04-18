import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  const { data: applications, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      full_name,
      email,
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
              applications.map((app) => (
                <div key={app.id} className="card">
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
              ))
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
