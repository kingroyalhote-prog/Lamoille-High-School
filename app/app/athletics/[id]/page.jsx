"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "../../../lib/supabase"

function getStatusStyles(status) {
  switch (status) {
    case "Sport Active":
      return { background: "#dcfce7", color: "#166534" }
    case "Off Season":
      return { background: "#fef3c7", color: "#92400e" }
    case "Sport Suspended":
      return { background: "#fee2e2", color: "#991b1b" }
    default:
      return { background: "#e2e8f0", color: "#334155" }
  }
}

export default function SportDetailsPage() {
  const params = useParams()
  const id = params?.id

  const [sport, setSport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadSport() {
      if (!id) return

      const { data, error } = await supabase
        .from("athletics")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setMessage("Error loading sport: " + error.message)
      } else {
        setSport(data)
      }

      setLoading(false)
    }

    loadSport()
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")

    const form = event.currentTarget

    const registration = {
      sport_id: id,
      roblox_username: form.roblox_username.value,
      discord_username: form.discord_username.value,
      attendance_agreement: form.attendance_agreement.checked,
    }

    if (!registration.attendance_agreement) {
      setSubmitting(false)
      setMessage("You must confirm that you can attend sports events.")
      return
    }

    const { error } = await supabase
      .from("athletic_registrations")
      .insert([registration])

    setSubmitting(false)

    if (error) {
      setMessage("Error submitting registration: " + error.message)
      return
    }

    form.reset()
    setMessage("Registration submitted successfully.")
  }

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading sport...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!sport) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <div className="card">
              <h1>Sport Not Found</h1>
              {message && <p style={{ color: "#b91c1c" }}>{message}</p>}

              <Link
                href="/athletics"
                className="btn-primary"
                style={{ marginTop: "16px", display: "inline-block" }}
              >
                Back to Athletics
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const statusStyle = getStatusStyles(sport.status)

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <Link href="/athletics" className="muted">
            ← Back to Athletics
          </Link>

          <div className="card" style={{ marginTop: "24px" }}>
            <img
              src={sport.image_url || "/images/lamoille-logo.png"}
              alt={sport.name}
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "cover",
                borderRadius: "18px",
                marginBottom: "24px",
              }}
            />

            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "14px",
                background: statusStyle.background,
                color: statusStyle.color,
              }}
            >
              {sport.status}
            </div>

            <h1 style={{ marginTop: 0 }}>{sport.name}</h1>

            <p className="muted" style={{ marginBottom: "10px" }}>
              {sport.meeting_days || "Meeting days TBD"} •{" "}
              {sport.location || "Location TBD"}
            </p>

            <p style={{ marginBottom: "10px" }}>
              Head Coach: {sport.head_coach || "Not Assigned"}
            </p>

            {sport.other_coaches && (
              <p style={{ marginBottom: "18px" }}>
                Other Coaches: {sport.other_coaches}
              </p>
            )}

            <p style={{ lineHeight: 1.7 }}>
              {sport.description ||
                sport.summary ||
                "More information has not been added for this sport yet."}
            </p>
          </div>

          <div className="card" style={{ marginTop: "24px" }}>
            <h2>Sport Registration</h2>

            {sport.registration_open ? (
              <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
                <label>Roblox Username</label>
                <input name="roblox_username" required style={inputStyle} />

                <label>Discord Username</label>
                <input name="discord_username" required style={inputStyle} />

                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    marginTop: "10px",
                  }}
                >
                  <input
                    name="attendance_agreement"
                    type="checkbox"
                    required
                    style={{ marginTop: "4px" }}
                  />
                  <span>
                    I understand that I must be able to attend sports events to
                    stay on the team.
                  </span>
                </label>

                {message && (
                  <p
                    style={{
                      color: message.includes("Error") ? "#b91c1c" : "#166534",
                      marginTop: "14px",
                    }}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ marginTop: "18px" }}
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            ) : (
              <p className="muted">
                Registration for this sport is currently closed, but this sport
                is still listed for information.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  marginTop: "6px",
  marginBottom: "16px",
  fontFamily: "inherit",
}
