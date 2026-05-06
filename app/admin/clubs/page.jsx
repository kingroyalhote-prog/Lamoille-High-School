import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function AdminClubsPage() {
  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Manage Clubs</h1>
          <p className="muted">
            Add, edit, publish, and manage Lamoille club information.
          </p>

          <Link
            href="/admin/clubs/new"
            className="btn-primary"
            style={{ marginTop: "20px", display: "inline-block" }}
          >
            Add New Club
          </Link>

          <div className="card-grid" style={{ marginTop: "30px" }}>
            {clubs?.length ? (
              clubs.map((club) => (
                <div key={club.id} className="card">
                  <h3>{club.title}</h3>

                  <p className="muted" style={{ marginBottom: "10px" }}>
                    {club.status || "No Status"} •{" "}
                    {club.is_published ? "Published" : "Hidden"}
                  </p>

                  <p>
                    Advisor: {club.advisor || "Not Assigned"}
                  </p>

                  <Link
                    href={`/admin/clubs/${club.id}`}
                    className="btn-primary"
                    style={{ marginTop: "16px", display: "inline-block" }}
                  >
                    Edit Club
                  </Link>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No Clubs Yet</h3>
                <p>Create your first club to show it on the public clubs page.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
