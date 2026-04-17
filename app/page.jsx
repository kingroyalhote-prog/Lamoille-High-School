import Link from "next/link"
import { supabase } from "../lib/supabase"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, summary, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  const { data: staff } = await supabase
    .from("staff_members")
    .select("id, full_name, title, image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(4)

  return (
    <main className="home-page">
      
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-shape shape-one" />
        <div className="home-hero-shape shape-two" />
        <div className="home-hero-shape shape-three" />

        <div className="home-hero-inner">
          <p className="home-eyebrow">Lamoille High School</p>
          <h1>Welcome to Lamoille High School</h1>
          <p className="home-tagline">Excellence. Community. Opportunity.</p>
          <p className="home-subtext">
            A modern school community focused on leadership, belonging, and meaningful opportunity for every student.
          </p>

          <div className="home-hero-actions">
            <Link href="/employment" className="home-btn home-btn-primary">
              Apply Now
            </Link>
            <Link href="/staff-directory" className="home-btn home-btn-secondary">
              Meet Our Staff
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="home-section">
        <div className="home-about">

          <div className="home-about-text">
            <p className="home-section-label">About Us</p>
            <h2>Building a Stronger School Community</h2>

            <p>
              Lamoille High School is dedicated to creating a supportive and engaging
              environment where students can grow academically, socially, and personally.
              We focus on leadership, collaboration, and real-world opportunities that
              prepare students for success beyond the classroom.
            </p>

            <p>
              Our staff is committed to helping every student feel valued, challenged,
              and inspired every day.
            </p>
          </div>

          <div className="home-about-box">
            <h3>Why Lamoille?</h3>
            <ul>
              <li>✔ Supportive and inclusive environment</li>
              <li>✔ Strong leadership and student involvement</li>
              <li>✔ Real opportunities for growth</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="home-section">
        <div className="home-section-head">
          <div>
            <p className="home-section-label">Latest Updates</p>
            <h2>Recent Announcements</h2>
          </div>
          <span style={{ color: "#64748b", fontWeight: 700 }}>
            More coming soon
          </span>
        </div>

        <div className="home-cards-grid">
          {announcements?.length ? (
            announcements.map((item) => (
              <article key={item.id} className="home-card">
                <p className="home-card-date">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : "Recently posted"}
                </p>
                <h3>{item.title}</h3>
                <p>{item.summary || "No summary provided yet."}</p>
              </article>
            ))
          ) : (
            <article className="home-card home-card-empty">
              <h3>No announcements yet</h3>
              <p>Published announcements will appear here once added.</p>
            </article>
          )}
        </div>
      </section>

      {/* STAFF */}
      <section className="home-section">
        <div className="home-section-head">
          <div>
            <p className="home-section-label">Our People</p>
            <h2>Staff Spotlight</h2>
          </div>
        </div>

        <div className="home-staff-grid">
          {staff?.length ? (
            staff.map((person) => (
              <article key={person.id} className="home-staff-card">
                <div className="home-staff-photo-wrap">
                  <img
                    src={person.image_url || "/images/lamoille-logo.png"}
                    alt={person.full_name}
                    className="home-staff-photo"
                  />
                </div>
                <h3>{person.full_name}</h3>
                <p>{person.title || "Staff Member"}</p>
              </article>
            ))
          ) : (
            <article className="home-card home-card-empty">
              <h3>No staff profiles yet</h3>
              <p>Staff spotlight entries will appear here once added.</p>
            </article>
          )}
        </div>
      </section>

    </main>
  )
}
