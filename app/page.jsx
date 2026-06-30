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
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Lamoille Independent School District</p>

          <h1>Lamoille ISD</h1>

          <p className="hero-tagline">Where Ambition Meets Opportunity</p>

          <p className="hero-subtext">
            Home of Lamoille High School, a focused school community built
            around excellence, leadership, and opportunity for every student.
          </p>

          <div className="hero-actions">
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="school-link-bar">
        <Link href="/calendar">District Calendar</Link>
        <Link href="/employment">Careers</Link>
        <Link href="/clubs">Student Clubs</Link>
        <Link href="/athletics">Athletics</Link>
        <Link href="/about">About ISD</Link>
      </section>

      <section className="school-home-section">
        <div className="school-home-grid">
          <div className="school-news">
            <div className="school-section-title">
              <div>
                <p className="section-label">District Updates</p>
                <h2>News & Announcements</h2>
              </div>

              <Link href="/announcements">View All</Link>
            </div>

            <div className="school-news-grid">
              {announcements?.length ? (
                announcements.map((item) => (
                  <article key={item.id} className="school-news-card">
                    <p className="school-date">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "Recently posted"}
                    </p>

                    <h3>{item.title}</h3>
                    <p>{item.summary || "No summary provided yet."}</p>
                  </article>
                ))
              ) : (
                <article className="school-news-card">
                  <p className="school-date">Lamoille ISD</p>
                  <h3>No announcements yet</h3>
                  <p>District announcements will appear here once posted.</p>
                </article>
              )}
            </div>
          </div>

          <aside className="school-events-panel">
            <div className="school-section-title">
              <div>
                <p className="section-label">At a Glance</p>
                <h2>District Snapshot</h2>
              </div>

              <Link href="/about">Learn More</Link>
            </div>

            <div className="school-event-card">
              <strong>Lamoille High School</strong>
              <span>Main district campus</span>
              <p>
                A high school community focused on student growth and belonging.
              </p>
            </div>

            <div className="school-event-card">
              <strong>Student Life</strong>
              <span>Clubs, athletics, and activities</span>
              <p>Students can connect, compete, lead, and build school pride.</p>
            </div>

            <div className="school-event-card">
              <strong>Weekly Sessions</strong>
              <span>Monday, Wednesday, Friday</span>
              <p>7:00 PM Eastern Time</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="school-about-strip">
        <div>
          <p className="section-label">About Lamoille ISD</p>

          <h2>A district built around one strong high school community.</h2>

          <p>
            Lamoille Independent School District exists to support Lamoille High
            School with a clear focus on academics, opportunity, leadership, and
            a student experience that feels connected from day one.
          </p>
        </div>

        <div className="school-about-points">
          <span>College & Career Readiness</span>
          <span>Student Leadership</span>
          <span>Athletics & Activities</span>
          <span>Community Pride</span>
        </div>
      </section>
    </main>
  )
}
