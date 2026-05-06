import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

function getStatusStyles(status) {
  switch (status) {
    case "Club Active":
      return {
        background: "#dcfce7",
        color: "#166534",
      }

    case "Club Suspended":
      return {
        background: "#fee2e2",
        color: "#991b1b",
      }

    case "Club On Hold":
      return {
        background: "#fef3c7",
        color: "#92400e",
      }

    case "Club Removed":
      return {
        background: "#e2e8f0",
        color: "#334155",
      }

    default:
      return {
        background: "#e2e8f0",
        color: "#334155",
      }
  }
}

export default async function ClubsPage() {
  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Student Life</p>

          <h1>
            Engage at
            <span className="hero-break">Lamoille</span>
          </h1>

          <p className="hero-tagline">
            Clubs. Leadership. Community.
          </p>

          <p className="hero-subtext">
            Explore student organizations, connect with others, and discover
            opportunities beyond the classroom at Lamoille High School.
          </p>
        </div>
      </section>

      <main className="content">
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-label">Activities</p>
                <h2>Student Clubs</h2>
              </div>

              <span className="muted">
                Find a club that matches your interests
              </span>
            </div>

            <div className="card-grid">
              {clubs?.length ? (
                clubs.map((club) => {
                  const statusStyle = getStatusStyles(club.status)

                  return (
                    <div key={club.id} className="card">
                      <img
                        src={
                          club.image_url || "/images/lamoille-logo.png"
                        }
                        alt={club.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "16px",
                          marginBottom: "18px",
                        }}
                      />

                      <div
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          marginBottom: "14px",
                          background: statusStyle.background,
                          color: statusStyle.color,
                        }}
                      >
                        {club.status}
                      </div>

                      <h3>{club.title}</h3>

                      <p
                        className="muted"
                        style={{ marginBottom: "12px" }}
                      >
                        Advisor: {club.advisor || "Not Assigned"}
                      </p>

                      <p>
                        {club.summary ||
                          "No club summary has been added yet."}
                      </p>

                      <Link
                        href={`/clubs/${club.id}`}
                        className="btn-primary"
                        style={{
                          marginTop: "18px",
                          display: "inline-block",
                          width: "fit-content",
                        }}
                      >
                        More Information
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="card">
                  <h3>No Clubs Yet</h3>

                  <p>
                    Clubs and student organizations will appear here once they
                    are added.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </main>
  )
}
