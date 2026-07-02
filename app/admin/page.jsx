import Link from "next/link"
import { supabase } from "../../lib/supabase"
import MaintenanceSwitch from "../../components/MaintenanceSwitch"
import WebsiteAlertAdmin from "../../components/WebsiteAlertAdmin"

export const dynamic = "force-dynamic"

async function getCount(table) {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })

  return count || 0
}

export default async function AdminPage() {
  const cards = [
    ["Announcements", await getCount("announcements"), "posts", "/admin/announcements", "Manage"],
    ["Clubs", await getCount("clubs"), "clubs", "/admin/clubs", "Manage"],
    ["Athletics", await getCount("athletics"), "sports", "/admin/athletics", "Manage"],
    ["Leadership", await getCount("leadership_members"), "leaders", "/admin/leadership", "Manage"],
    ["Athletic Registrations", await getCount("athletic_registrations"), "submissions", "/admin/athletics/registrations", "View"],
    ["Jobs", await getCount("job_postings"), "postings", "/admin/jobs", "Manage"],
    ["Applications", await getCount("applications"), "submitted", "/admin/applications", "Review"],
    ["Calendar", await getCount("events"), "events", "/admin/calendar", "Manage"],
  ]

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
            <div className="card">
              <h3>Staff Database</h3>
              <p className="muted">
                Manage employee records, warnings, notes, eligibility,
                blacklists, and staff history.
              </p>
              <Link href="/admin/staff" className="btn-primary" style={{ marginTop: "12px" }}>
                Open Staff Database
              </Link>
            </div>

            <MaintenanceSwitch />
            <WebsiteAlertAdmin />

            {cards.map(([title, count, label, href, button]) => (
              <AdminCard
                key={href}
                title={title}
                count={count}
                label={label}
                href={href}
                button={button}
              />
            ))}

            <div className="card">
              <h3>Admin Controls</h3>
              <p className="muted">Manage admin access and permissions.</p>
              <Link href="/admin/users" className="btn-primary" style={{ marginTop: "12px" }}>
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
    <div className="card">
      <h3>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: 700, margin: "6px 0" }}>
        {count}
      </p>
      <p className="muted">{label}</p>
      <Link href={href} className="btn-primary" style={{ marginTop: "12px" }}>
        {button}
      </Link>
    </div>
  )
}
