import Link from "next/link"
import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

function getStatusStyles(status) {
  switch (status) {
    case "Club Active":
      return { background: "#dcfce7", color: "#166534" }
    case "Club Suspended":
      return { background: "#fee2e2", color: "#991b1b" }
    case "Club On Hold":
      return { background: "#fef3c7", color: "#92400e" }
    case "Club Removed":
      return { background: "#e2e8f0", color: "#334155" }
    default:
      return { background: "#e2e8f0", color: "#334155" }
  }
}

export default async function ClubDetailsPage({ params }) {
  const { id } = await params

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", id)
    .single()

  if (!club) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Club Not Found</h1>
              <p>This club could not be found or is no longer available.</p>

              <Link
                href="/clubs"
                className="btn-primary"
                style={{ marginTop: "16px", display: "inline-block" }}
              >
                Back to Clubs
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const statusStyle = getStatusStyles(club.status)

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <Link href="/clubs" className="muted">
            ← Back to Clubs
          </Link>

          <div className="card" style={{ marginTop: "24px" }}>
            <img
              src={club.image_url || "/images/lamoille-logo.png"}
              alt={club.title}
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "cover",
                borderRadius: "18px",
                marginBottom: "24px",
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

            <h1 style={{ marginTop: 0 }}>{club.title}</h1>

            <p className="muted" style={{ marginBottom: "18px" }}>
              Advisor: {club.advisor || "Not Assigned"}
            </p>

            <p style={{ lineHeight: 1.7 }}>
              {club.description ||
                club.summary ||
                "More information has not been added for this club yet."}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
