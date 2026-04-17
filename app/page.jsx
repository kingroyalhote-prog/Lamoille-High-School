export const dynamic = "force-dynamic"

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
              width={150}
              height={150}
              className="hero-logo"
              priority
            />
          </div>

          <p className="eyebrow">Home of the Raiders</p>
          <h1>Welcome to Lamoille</h1>
          <p className="hero-text">
            A modern school community built on leadership and opportunity.
          </p>

          <div className="hero-actions">
            <Link href="/employment" className="btn btn-primary">
              Employment Opportunities
            </Link>
          </div>
        </div>
      </section>

      <section className="quick-grid">
        <div className="glass-card">
          <h2>About Lamoille</h2>
          <p>Learn more about our mission, values, and school community.</p>
          <Link href="/about">Learn More</Link>
        </div>

        <div className="glass-card">
          <h2>Staff Directory</h2>
          <p>Find administrators, faculty, and support staff in one place.</p>
          <Link href="/staff-directory">View Directory</Link>
        </div>

        <div className="glass-card">
          <h2>Employment</h2>
          <p>Browse current openings and explore opportunities to join our team.</p>
          <Link href="/employment">See Openings</Link>
        </div>
      </section>

      <section className="announcements-preview">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Latest News</p>
            <h2>Recent Announcements</h2>
          </div>
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
              <p>Published announcements will appear here once you add them.</p>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
