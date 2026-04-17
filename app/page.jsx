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
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="hero-content">
          <Image
            src="/lamoille-logo.png"
            alt="Lamoille Logo"
            width={150}
            height={150}
          />

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

      {/* ANNOUNCEMENTS (ONLY HERE) */}
      <section className="announcements-preview">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Latest Announcements
        </h2>

        <div className="announcement-grid">
          {announcements?.length ? (
            announcements.map((item) => (
              <div key={item.id} className="announcement-card">
                <h3>{item.title}</h3>
                <p>{item.summary || "No summary yet"}</p>
              </div>
            ))
          ) : (
            <div className="announcement-card">
              <h3>No announcements yet</h3>
              <p>Add announcements from your admin panel later.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
