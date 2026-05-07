import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function AdminAthleticsPage() {
  const { data: sports } = await supabase
    .from("athletics")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Manage Athletics</h1>
          <p className="muted">
            Add, edit, publish, and manage Lamoille athletic programs.
          </p>

          <Link
            href="/admin/athletics/new"
            className="btn-primary"
            style={{ marginTop: "20px", display: "inline-block" }}
          >
            Add New Sport
          </Link>

          <div className="card-grid" style={{ marginTop: "30px" }}>
            {sports?.length ? (
              sports.map((sport) => (
                <div key={sport.id} className="card">
                  <h3>{sport.name}</h3>

                  <p className="muted" style={{ marginBottom: "10px" }}>
                    {sport.status || "No Status"} •{" "}
                    {sport.registration_open
                      ? "Registration Open"
                      : "Registration Closed"}{" "}
                    • {sport.is_published ? "Published" : "Hidden"}
                  </p>

                  <p>Head Coach: {sport.head_coach || "Not Assigned"}</p>

                  <Link
                    href={`/admin/athletics/${sport.id}`}
                    className="btn-primary"
                    style={{ marginTop: "16px", display: "inline-block" }}
                  >
                    Edit Sport
                  </Link>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No Sports Yet</h3>
                <p>Create your first sport to show it on the athletics page.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
