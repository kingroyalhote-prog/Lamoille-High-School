import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

function getStatusStyles(status) {
  switch (status) {
    case "Sport Active":
      return { background: "#dcfce7", color: "#166534" }

    case "Off Season":
      return { background: "#fef3c7", color: "#92400e" }

    case "Sport Suspended":
      return { background: "#fee2e2", color: "#991b1b" }

    default:
      return { background: "#e2e8f0", color: "#334155" }
  }
}

export default async function AthleticsPage() {
  const { data: sports } = await supabase
    .from("athletics")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Athletics</p>

          <h1>
            Lamoille
            <span className="hero-break">Athletics</span>
          </h1>

          <p className="hero-tagline">
            Teamwork. Dedication. School Spirit.
          </p>

          <p className="hero-subtext">
            Explore athletic programs, meet coaches, and register for sports at
            Lamoille High School.
          </p>
        </div>
      </section>

      <div className="content">
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-label">Sports</p>
                <h2>Athletic Programs</h2>
              </div>

              <span className="muted">
                Registration availability may vary by sport.
              </span>
            </div>

            <div className="card-grid">
              {sports?.length ? (
                sports.map((sport) => {
                  const statusStyle = getStatusStyles(sport.status)

                  return (
                    <div key={sport.id} className="card">
                      <img
                        src={sport.image_url || "/images/lamoille-logo.png"}
                        alt={sport.name}
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
                        {sport.status}
                      </div>

                      <h3>{sport.name}</h3>

                      <p className="muted" style={{ marginBottom: "10px" }}>
                        {sport.meeting_days || "Meeting days TBD"} •{" "}
                        {sport.location || "Location TBD"}
                      </p>

                      <p style={{ marginBottom: "10px" }}>
                        Head Coach: {sport.head_coach || "Not Assigned"}
                      </p>

                      <p>
                        {sport.summary ||
                          "More information about this sport will be added soon."}
                      </p>

                      <Link
                        href={`/athletics/${sport.id}`}
                        className="btn-primary"
                        style={{
                          marginTop: "18px",
                          display: "inline-block",
                          width: "fit-content",
                        }}
                      >
                        {sport.registration_open
                          ? "Register for Sport"
                          : "Registration Closed"}
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="card">
                  <h3>No Sports Yet</h3>
                  <p>Athletic programs will appear here once they are added.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
