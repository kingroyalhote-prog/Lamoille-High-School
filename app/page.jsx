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
        <div className="hero-inner">
          <p className="hero-eyebrow">Lamoille High School</p>

          <h1>Welcome to Lamoille High School</h1>

          <p className="hero-tagline">
            Excellence. Community. Opportunity.
          </p>

          <p className="hero-subtext">
            A modern school community focused on leadership, belonging, and meaningful opportunity for every student.
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

      {/* WHITE CONTENT AREA */}
      <div className="content">

        {/* ABOUT */}
        <section className="section">
          <div className="container">
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

            <ul>
              <li>✔ Supportive and inclusive environment</li>
              <li>✔ Strong leadership and student involvement</li>
              <li>✔ Real opportunities for growth</li>
            </ul>
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

              <span className="muted">More coming soon</span>
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
                    <p>{item.summary}</p>
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
