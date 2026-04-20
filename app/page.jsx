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

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-one" />
        <div className="hero-bg-orb hero-orb-two" />
        <div className="hero-bg-grid" />

        <div className="hero-inner">
          <p className="hero-eyebrow">Lamoille High School</p>

          <h1>
            Welcome to
            <span className="hero-break">Lamoille High School</span>
          </h1>

          <p className="hero-tagline">
            Excellence. Community. Opportunity.
          </p>

          <p className="hero-subtext">
            A modern school community focused on leadership, belonging, and
            meaningful opportunity for every student.
          </p>

          <div className="hero-actions">
            <Link href="/employment" className="btn-primary">
              Apply Now
            </Link>

            <Link href="/staff-directory" className="btn-secondary">
              Meet Our Staff
            </Link>
          </div>
        </div>
      </section>

      <div className="content">
        {/* QUICK LINKS */}
        <section className="section">
          <div className="container">
            <div className="quick-links-grid">
              <Link href="/about" className="quick-link-card">
                <span className="quick-link-label">Learn More</span>
                <h3>About Lamoille</h3>
                <p>See our mission, values, and school community focus.</p>
              </Link>

              <Link href="/staff-directory" className="quick-link-card">
                <span className="quick-link-label">Directory</span>
                <h3>Meet Our Staff</h3>
                <p>Browse teachers, administration, and support staff.</p>
              </Link>

              <Link href="/employment" className="quick-link-card">
                <span className="quick-link-label">Careers</span>
                <h3>Employment</h3>
                <p>Explore job openings and apply to join our team.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section">
          <div className="container">
            <div className="home-feature-card">
              <div className="home-feature-copy">
                <p className="section-label">About Us</p>
                <h2>Building a Stronger School Community</h2>

                <p>
                  Lamoille High School is dedicated to creating a supportive and engaging
                  environment where students can grow academically, socially, and personally.
                </p>

                <p>
                  Our staff is committed to helping every student feel valued,
                  challenged, and inspired every day.
                </p>
              </div>

              <div className="home-feature-points">
                <div className="home-point-card">
                  <h3>Supportive Environment</h3>
                  <p>Students are encouraged to grow in a welcoming and inclusive community.</p>
                </div>

                <div className="home-point-card">
                  <h3>Strong Leadership</h3>
                  <p>We promote responsibility, involvement, and student voice across campus.</p>
                </div>

                <div className="home-point-card">
                  <h3>Real Opportunity</h3>
                  <p>Students are given meaningful opportunities to prepare for the future.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-label">Latest Updates</p>
                <h2>Recent Announcements</h2>
              </div>

              <span className="muted">Stay up to date with school news</span>
            </div>

            <div className="card-grid">
              {announcements?.length ? (
                announcements.map((item) => (
                  <div key={item.id} className="card">
                    <p className="card-date">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "Recently posted"}
                    </p>

                    <h3>{item.title}</h3>
                    <p>{item.summary || "No summary provided yet."}</p>
                  </div>
                ))
              ) : (
                <div className="card empty">
                  <h3>No announcements yet</h3>
                  <p>They will appear here once added.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
