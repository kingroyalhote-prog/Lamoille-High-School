export const dynamic = "force-dynamic"

import Link from "next/link"
import { supabase } from "../../lib/supabase"

export default async function EmploymentPage() {
  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Careers</p>
        <h1>Employment</h1>
        <p>Join our team at Lamoille High School.</p>
      </section>

      <main className="page-shell">
        <div className="jobs-grid">
          {jobs?.length ? (
            jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p className="meta-text">
                  {[job.department, job.location, job.employment_type].filter(Boolean).join(" • ")}
                </p>
                <p>{job.description}</p>
                <Link href={`/employment/${job.id}`} className="job-link">
                  Apply Now
                </Link>
              </div>
            ))
          ) : (
            <div className="job-card">
              <h3>No open positions</h3>
              <p>Please check back later for future opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
