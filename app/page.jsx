"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main>

      {/* FLOATING BACKGROUND */}
      <div className="floating-bg">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* HERO */}
      <section className="section" style={{ textAlign: "center", marginTop: "80px" }}>
        <h1>Welcome to Lamoille High School</h1>

        <p style={{ marginTop: "12px" }}>
          Excellence. Community. Opportunity.
        </p>

        <p style={{ marginTop: "8px", opacity: 0.7 }}>
          A modern school environment focused on leadership, growth, and real opportunity.
        </p>

        <div style={{ marginTop: "24px" }}>
          <Link href="/employment">
            <button className="primary-btn">Apply Now</button>
          </Link>

          <Link href="/staff-directory">
            <button className="secondary-btn" style={{ marginLeft: "10px" }}>
              Meet Our Staff
            </button>
          </Link>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Latest Announcements</h2>

          <Link href="/announcements">
            View All →
          </Link>
        </div>

        <div className="glass-card" style={{ marginTop: "20px" }}>
          <p>No announcements yet</p>
        </div>
      </section>

      {/* STAFF */}
      <section className="section">
        <h2>Meet Our Team</h2>

        <div className="glass-card" style={{ marginTop: "20px", textAlign: "center" }}>
          <p>Staff profiles coming soon</p>
        </div>
      </section>

    </main>
  )
}
