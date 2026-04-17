import { supabase } from "../../lib/supabase"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Dashboard</p>
        <h1>Admin Dashboard</h1>
        <p>Manage announcements, staff, jobs, and applications from one place.</p>
      </section>

      <main className="page-shell">
        <div className="info-grid">
          <div className="content-card">
            <h2>Announcements</h2>
            <p>{announcementCount ?? 0} total announcements</p>
            <Link href="/admin/announcements" className="job-link">
              Manage announcements
            </Link>
          </div>

          <div className="content-card">
            <h2>Staff Directory</h2>
            <p>{staffCount ?? 0} staff entries</p>
            <Link href="/admin/staff" className="job-link">
              Manage staff
            </Link>
          </div>

          <div className="content-card">
            <h2>Job Postings</h2>
            <p>{jobCount ?? 0} total job postings</p>
            <Link href="/admin/jobs" className="job-link">
              Manage jobs
            </Link>
          </div>

          <div className="content-card">
            <h2>Applications</h2>
            <p>{applicationCount ?? 0} submitted applications</p>
            <Link href="/admin/applications" className="job-link">
              Review applications
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
