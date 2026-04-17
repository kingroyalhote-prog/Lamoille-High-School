import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      full_name,
      email,
      job_id,
      jobs ( title )
    `)
    .order("created_at", { ascending: false })

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

                  <h3>{app.full_name}</h3>
                  <p>{app.email}</p>

                  <p style={{ marginTop: "6px" }}>
                    <strong>Position:</strong>{" "}
                    {app.jobs?.title || "Unknown"}
                  </p>

                  <p className="muted" style={{ marginTop: "6px" }}>
                    {new Date(app.created_at).toLocaleDateString()}
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
