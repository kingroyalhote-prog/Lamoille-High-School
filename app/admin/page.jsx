import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const { count: announcementsCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })

  const { count: staffCount } = await supabase
    .from("staff_members")
    .select("*", { count: "exact", head: true })

  const { count: jobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })

  const { count: applicationsCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <p className="section-label">Admin</p>
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage your entire site from here.</p>

          <div className="card-grid" style={{ marginTop: "30px" }}>

            {/* ANNOUNCEMENTS */}
            <div className="card">
              <h3>Announcements</h3>
              <p>{announcementsCount || 0} total</p>

              <Link href="/admin/announcements" className="btn-primary" style={{ marginTop: "10px", display: "inline-block" }}>
                Manage
              </Link>
            </div>

            {/* STAFF */}
            <div className="card">
              <h3>Staff Directory</h3>
              <p>{staffCount || 0} staff</p>

              <Link href="/admin/staff" className="btn-primary" style={{ marginTop: "10px", display: "inline-block" }}>
                Manage
              </Link>
            </div>

            {/* JOBS */}
            <div className="card">
              <h3>Jobs</h3>
              <p>{jobsCount || 0} postings</p>

              <Link href="/admin/jobs" className="btn-primary" style={{ marginTop: "10px", display: "inline-block" }}>
                Manage
              </Link>
            </div>

            {/* APPLICATIONS */}
            <div className="card">
              <h3>Applications</h3>
              <p>{applicationsCount || 0} submitted</p>

              <Link href="/admin/applications" className="btn-primary" style={{ marginTop: "10px", display: "inline-block" }}>
                Review
              </Link>
            </div>

          </div>

        </div>
      </section>
    </main>
  )
}
