import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

function getLeaderTypeLabel(type) {
  return type === "district" ? "District Leader" : "School Leader"
}

export default async function AdminLeadershipPage() {
  const { data: leaders } = await supabase
    .from("leadership_members")
    .select("*")
    .order("leader_type", { ascending: true })
    .order("display_order", { ascending: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Manage Leadership</h1>

          <p className="muted">
            Add, edit, publish, and organize district and school leaders.
          </p>

          <Link
            href="/admin/leadership/new"
            className="btn-primary"
            style={{ marginTop: "20px", display: "inline-block" }}
          >
            Add New Leader
          </Link>

          <div className="card-grid" style={{ marginTop: "30px" }}>
            {leaders?.length ? (
              leaders.map((leader) => (
                <div key={leader.id} className="card">
                  <img
                    src={leader.image_url || "/images/lamoille-logo.png"}
                    alt={leader.roleplay_name || "Leadership member"}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "18px",
                    }}
                  />

                  <p className="section-label">
                    {getLeaderTypeLabel(leader.leader_type)}
                  </p>

                  <h3>{leader.roleplay_name}</h3>

                  <p className="muted" style={{ marginBottom: "8px" }}>
                    {leader.title || "No title added"} •{" "}
                    {leader.is_published ? "Published" : "Hidden"}
                  </p>

                  <p>Roblox: {leader.roblox_username || "Not provided"}</p>

                  <Link
                    href={`/admin/leadership/${leader.id}`}
                    className="btn-primary"
                    style={{ marginTop: "16px", display: "inline-block" }}
                  >
                    Edit Leader
                  </Link>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No leaders yet</h3>
                <p>
                  Create your first leadership profile to show it on the public
                  page.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
