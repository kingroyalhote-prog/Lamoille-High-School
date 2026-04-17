import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function EmploymentPage() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <p className="section-label">Careers</p>
          <h1>Employment Opportunities</h1>
          <p className="muted">
            Join our team and help shape the future of our students.
          </p>

          <div className="card-grid" style={{ marginTop: "30px" }}>
            {jobs?.length ? (
              jobs.map((job) => (
                <div key={job.id} className="card">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>

                  <Link
                    href={`/employment/${job.id}`}
                    className="btn-primary"
                    style={{ marginTop: "10px", display: "inline-block" }}
                  >
                    Apply
                  </Link>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No openings right now</h3>
                <p>Please check back later.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
