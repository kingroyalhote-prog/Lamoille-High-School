import Image from "next/image"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export default async function Home() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, summary, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="hero-content">
          <div className="hero-logo-wrap">
            <Image
              src="/images/lamoille-logo.png"
              alt="Lamoille High School logo"
              width={180}
              height={180}
              className="hero-logo"
              priority
            />
          </div>

          <p className="eyebrow">Home of the Raiders</p>
          <h1>Welcome to Lamoille</h1>
          <p className="hero-text">
            A modern school community built on leadership, opportunity, and pride.
          </p>

          <div className="hero-actions">
            <Link href="/announcements" className="btn btn-primary">
              View Announcements
            </Link>
            <Link href="/employment" className="btn btn-secondary">
              Employment Opportunities
            </Link>
          </div>
        </div>
      </section>

      <section className="quick-grid">
        <div className="glass-card">
          <h2>About Lamoille</h2>
          <p>Learn more about our mission, leadership, and school community.</p>
          <Link href="/about">Explore About</Link>
        </div>

        <div className="glass-card">
          <h2>Staff Directory</h2>
          <p>Find administrators, faculty, and support staff in one place.</p>
          <Link href="/staff-directory">View Directory</Link>
        </div>

        <div className="glass-card">
          <h2>Employment</h2>
          <p>Browse open positions and apply through our online application system.</p>
          <Link href="/employment">See Openings</Link>
        </div>
      </section>

      <section className="announcements-preview">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Latest News</p>
            <h2>Recent Announcements</h2>
          </div>
          <Link href="/announcements" className="text-link">
            View all
          </Link>
        </div>

        <div className="announcement-grid">
          {announcements?.length ? (
            announcements.map((item) => (
              <article key={item.id} className="announcement-card">
                <p className="announcement-date">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : "Recently posted"}
                </p>
                <h3>{item.title}</h3>
                <p>{item.summary || "No summary provided yet."}</p>
              </article>
            ))
          ) : (
            <article className="announcement-card empty-card">
              <h3>No announcements yet</h3>
              <p>Your published announcements will show here once you add them.</p>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
