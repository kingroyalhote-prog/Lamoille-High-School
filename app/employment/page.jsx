/*
OLD EMPLOYMENT SYSTEM BACKUP

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

  return null
}
*/

export const dynamic = "force-dynamic"

export default function EmploymentPage() {
  return (
    <main className="employment-page">
      <section className="employment-hero">
        <div className="employment-bg-orb orb-one"></div>
        <div className="employment-bg-orb orb-two"></div>
        <div className="employment-bg-orb orb-three"></div>

        <div className="employment-wrap">
          <div className="employment-header">
            <p className="employment-pill">Lamoille High School</p>
            <h1>Employment Application</h1>
            <p>
              Interested in joining the Lamoille High School staff team?
              Complete the application below and our leadership team will review
              your submission.
            </p>
          </div>

          <div className="employment-form-card">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSccCZgXiBrMM0uMAm4isK7uXSq2fQIu9tOICO6eLkJsDZKgqQ/viewform?embedded=true"
              width="100%"
              height="1763"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </main>
  )
}
