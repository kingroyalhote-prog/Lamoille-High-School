"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([])
  const [staff, setStaff] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: a } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3)

    const { data: s } = await supabase
      .from("staff_members")
      .select("*")
      .eq("is_active", true)
      .limit(4)

    setAnnouncements(a || [])
    setStaff(s || [])
  }

  return (
    <div className="home-wrapper">
      {/* FLOATING BACKGROUND */}
      <div className="floating-bg">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

     <section className="hero">
  <div className="hero-inner">
    <h1>Welcome to Lamoille High School</h1>

    <p className="hero-sub">
      Excellence. Community. Opportunity.
    </p>

    <p className="hero-desc">
      A modern school environment focused on leadership, growth, and real opportunity.
    </p>

    <div className="hero-buttons">
      <Link href="/employment" className="btn-primary">
        Apply Now
      </Link>

      <Link href="/staff" className="btn-secondary">
        Meet Our Staff
      </Link>
    </div>
  </div>
</section>

      {/* ANNOUNCEMENTS */}
      <section className="section">
        <div className="section-header">
          <h2>Latest Announcements</h2>
          <Link href="/announcements" className="view-all">
            View All →
          </Link>
        </div>

        <div className="card-grid">
          {announcements.length ? (
            announcements.map((a) => (
              <div key={a.id} className="card">
                <h3>{a.title}</h3>
                <p>{a.content}</p>
              </div>
            ))
          ) : (
            <p>No announcements yet</p>
          )}
        </div>
      </section>

      {/* STAFF SPOTLIGHT */}
      <section className="section">
        <h2>Meet Our Team</h2>

        <div className="staff-grid">
          {staff.map((s) => (
            <div key={s.id} className="staff-card">
              <img src={s.photo_url} alt={s.name} />
              <h3>{s.name}</h3>
              <p>{s.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
