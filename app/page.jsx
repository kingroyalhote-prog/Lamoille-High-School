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
          <p className="hero-eyebrow">Lamoille High School</p>

          <h1>
            Welcome to
            <span className="hero-break">Lamoille High School</span>
          </h1>

          <p className="hero-tagline">Excellence. Community. Opportunity.</p>

          <p className="hero-subtext">
            A modern school community focused on leadership, belonging, and
            meaningful opportunity for every student.
          </p>

          <div className="hero-actions">
            <Link href="/employment" className="btn-primary">
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      <section className="school-link-bar">
        <Link href="/calendar">Calendar</Link>
        <Link href="/employment">Employment</Link>
        <Link href="/clubs">Clubs</Link>
        <Link href="/athletics">Athletics</Link>
        <Link href="/about">About Lamoille</Link>
      </section>

      <section className="school-home-section">
        <div className="school-home-grid">
          <div className="school-news">
            <div className="school-section-title">
              <h2>News & Announcements</h2>
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
                  <p className="school-date">School News</p>
                  <h3>No announcements yet</h3>
                  <p>They will appear here once added.</p>
                </article>
              )}
            </div>
          </div>

          <aside className="school-events-panel">
            <div className="school-section-title">
              <h2>Events</h2>
              <Link href="/calendar">See All</Link>
            </div>

            <div className="school-event-card">
              <strong>Weekly Sessions</strong>
              <span>Monday, Wednesday, Thursday</span>
              <p>7:00 PM Eastern Time</p>
            </div>

            <div className="school-event-card">
              <strong>Student Life</strong>
              <span>Clubs, athletics, and activities</span>
              <p>Check the calendar for upcoming events.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="school-about-strip">
        <div>
          <p className="section-label">About Us</p>
          <h2>Building a Stronger School Community</h2>
          <p>
            Lamoille High School is dedicated to creating a supportive and
            engaging environment where students can grow academically, socially,
            and personally.
          </p>
        </div>

        <div className="school-about-points">
          <span>Supportive Environment</span>
          <span>Strong Leadership</span>
          <span>Real Opportunity</span>
        </div>
      </section>
    </main>
  )
}
