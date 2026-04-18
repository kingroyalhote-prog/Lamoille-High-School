import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function JobsAdminPage() {
  const { data: jobs, error } = await supabase
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) console.log(error)

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-label">Admin</p>
              <h1>Job Postings</h1>
            </div>

            <Link href="/admin/jobs/new" className="btn-primary">
              + New Job
            </Link>
          </div>

          <div className="card-grid" style={{ marginTop: "20px" }}>
            {jobs?.length ? (
              jobs.map((job) => (
                <div key={job.id} className="card">
                  <h3>{job.title}</h3>

                  <p className="muted" style={{ marginBottom: "10px" }}>
                    {[job.department, job.location, job.employment_type]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  <p style={{ marginBottom: "12px" }}>
                    {job.is_published ? "Published" : "Draft"} ·{" "}
                    {job.applications_open ? "Applications Open" : "Applications Closed"}
                  </p>

                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="btn-primary"
                    style={{ display: "inline-block" }}
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No job postings yet</h3>
                <p>Create your first posting to get started.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
