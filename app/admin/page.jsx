import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const { count: announcementsCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })

  const { count: jobsCount } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })

  const { count: applicationsCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })

  const { count: eventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  const { count: clubsCount } = await supabase
    .from("clubs")
    .select("*", { count: "exact", head: true })

  const { count: athleticsCount } = await supabase
    .from("athletics")
    .select("*", { count: "exact", head: true })

  const { count: athleticRegistrationsCount } = await supabase
    .from("athletic_registrations")
    .select("*", { count: "exact", head: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "30px" }}>
            <p className="section-label">Admin</p>
            <h1 style={{ marginBottom: "6px" }}>Dashboard</h1>
            <p className="muted">Manage your entire site from one place.</p>
          </div>

          <div className="card-grid" style={{ marginTop: "20px" }}>
            <AdminCard title="Announcements" count={announcementsCount} label="posts" href="/admin/announcements" button="Manage" />

            <AdminCard title="Clubs" count={clubsCount} label="clubs" href="/admin/clubs" button="Manage" />

            <AdminCard title="Athletics" count={athleticsCount} label="sports" href="/admin/athletics" button="Manage" />

            <AdminCard title="Athletic Registrations" count={athleticRegistrationsCount} label="submissions" href="/admin/athletics/registrations" button="View" />

            <AdminCard title="Jobs" count={jobsCount} label="postings" href="/admin/jobs" button="Manage" />

            <AdminCard title="Applications" count={applicationsCount} label="submitted" href="/admin/applications" button="Review" />

            <AdminCard title="Calendar" count={eventsCount} label="events" href="/admin/calendar" button="Manage" />

            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
              }}
            >
              <h3>Admin Controls</h3>
              <p style={{ opacity: 0.85 }}>
                Manage admin access and permissions
              </p>

              <Link
                href="/admin/users"
                style={{
                  marginTop: "12px",
                  display: "inline-block",
                  background: "white",
                  color: "#4f46e5",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Manage Admins
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AdminCard({ title, count, label, href, button }) {
  return (
    <div
      className="card"
      style={{
        transition: "all 0.2s ease",
        border: "1px solid #e2e8f0",
      }}
    >
      <h3>{title}</h3>

      <p style={{ fontSize: "22px", fontWeight: 700, margin: "6px 0" }}>
        {count || 0}
      </p>

      <p className="muted">{label}</p>

      <Link
        href={href}
        className="btn-primary"
        style={{
          marginTop: "12px",
          display: "inline-block",
        }}
      >
        {button}
      </Link>
    </div>
  )
}
