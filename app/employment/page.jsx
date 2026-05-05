import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function EmploymentPage() {
  const { data: jobs, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) console.log(error)

  const openJobs = jobs?.filter((job) => job.applications_open)
  const closedJobs = jobs?.filter((job) => !job.applications_open)

  const sortedJobs = [...(openJobs || []), ...(closedJobs || [])]

  const hasOpenJobs = openJobs && openJobs.length > 0

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Careers</p>
          <h1>Employment Opportunities</h1>
          <p className="muted">
            Join our team and help shape the future of our students.
          </p>

          {/* 🔥 No open applications message */}
          {!hasOpenJobs && (
            <div
              className="card"
              style={{
                marginTop: "25px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3>No Open Applications</h3>
              <p>
                There are no open applications at this time. Thank you for your
                interest in joining Lamoille High School — we encourage you to
                check back soon for future opportunities.
              </p>
            </div>
          )}

          <div className="card-grid" style={{ marginTop: "30px" }}>
            {sortedJobs?.length ? (
              sortedJobs.map((job) => (
                <div key={job.id} className="card">
                  <h3>{job.title}</h3>

                  <p className="muted" style={{ marginBottom: "10px" }}>
                    {[job.department, job.location, job.employment_type]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  {job.description ? <p>{job.description}</p> : null}

                  <Link
                    href={`/employment/${job.id}`}
                    className="btn-primary"
                    style={{ marginTop: "10px", display: "inline-block" }}
                  >
                    {job.applications_open ? "Apply Now" : "Application Closed"}
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
