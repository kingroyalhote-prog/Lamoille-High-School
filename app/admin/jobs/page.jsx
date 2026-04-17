import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function JobsAdmin() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })

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

          <div className="card-grid">
            {jobs?.map((job) => (
              <div key={job.id} className="card">
                <h3>{job.title}</h3>
                <p>{job.description?.slice(0, 100)}...</p>

                <Link
                  href={`/admin/jobs/${job.id}`}
                  className="btn-primary"
                  style={{ marginTop: "10px", display: "inline-block" }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  )
}
