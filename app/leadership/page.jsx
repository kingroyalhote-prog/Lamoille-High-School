import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

function LeaderCard({ leader }) {
  return (
    <article className="leadership-card">
      <img
        src={leader.image_url || "/images/lamoille-logo.png"}
        alt={leader.roleplay_name || "Leadership member"}
        className="leadership-photo"
      />

      <div className="leadership-card-body">
        <p className="leadership-title">{leader.title || "Leadership Team"}</p>
        <h3>{leader.roleplay_name}</h3>

        <div className="leadership-details">
          <p>
            <strong>Roblox Username:</strong>{" "}
            {leader.roblox_username || "Not provided"}
          </p>

          <p>
            <strong>Email:</strong> {leader.email || "Not provided"}
          </p>

          <p>
            <strong>Fun Fact:</strong>{" "}
            {leader.fun_fact || "No fun fact has been added yet."}
          </p>
        </div>
      </div>
    </article>
  )
}

function LeaderSection({ title, subtitle, leaders }) {
  return (
    <section className="section leadership-section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="section-label">Leadership</p>
            <h2>{title}</h2>
          </div>

          <span className="muted">{subtitle}</span>
        </div>

        <div className="leadership-grid">
          {leaders.length ? (
            leaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))
          ) : (
            <div className="card">
              <h3>No leaders added yet</h3>
              <p>This section will update once profiles are added.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default async function LeadershipPage() {
  const { data, error } = await supabase
    .from("leadership_members")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Leadership page error</h1>
              <p>{error.message}</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const leaders = data || []

  const districtLeaders = leaders.filter(
    (leader) => leader.leader_type === "district"
  )

  const schoolLeaders = leaders.filter(
    (leader) => leader.leader_type === "school"
  )

  const boardMembers = leaders.filter(
    (leader) => leader.leader_type === "board"
  )

  return (
    <main>
      <section className="hero leadership-hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Lamoille ISD</p>

          <h1>Leadership</h1>

          <p className="hero-tagline">Guiding Our District and School</p>

          <p className="hero-subtext">
            Meet the district, school, and board leaders supporting Lamoille ISD
            and Lamoille High School.
          </p>
        </div>
      </section>

      <LeaderSection
        title="District Leaders"
        subtitle="District leadership appears first"
        leaders={districtLeaders}
      />

      <LeaderSection
        title="School Leaders"
        subtitle="Lamoille High School leadership"
        leaders={schoolLeaders}
      />

      <LeaderSection
        title="School Board Members"
        subtitle="Community leadership and district oversight"
        leaders={boardMembers}
      />
    </main>
  )
}
