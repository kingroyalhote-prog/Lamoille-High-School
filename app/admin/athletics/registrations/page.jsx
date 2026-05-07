"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"

export default function AthleticRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function loadRegistrations() {
    const { data, error } = await supabase
      .from("athletic_registrations")
      .select(`
        *,
        athletics (
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      setMessage("Error loading registrations: " + error.message)
    } else {
      setRegistrations(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadRegistrations()
  }, [])

  async function deleteRegistration(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this registration?"
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("athletic_registrations")
      .delete()
      .eq("id", id)

    if (error) {
      setMessage("Error deleting registration: " + error.message)
      return
    }

    setRegistrations((current) =>
      current.filter((registration) => registration.id !== id)
    )

    setMessage("Registration deleted successfully.")
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>
          <h1>Athletic Registrations</h1>

          <p className="muted">
            Review student athletic sign-ups and registration submissions.
          </p>

          {message && (
            <p
              style={{
                marginTop: "18px",
                color: message.includes("Error") ? "#b91c1c" : "#166534",
              }}
            >
              {message}
            </p>
          )}

          <div style={{ marginTop: "30px" }}>
            {loading ? (
              <div className="card">
                <h3>Loading registrations...</h3>
              </div>
            ) : registrations.length ? (
              registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="card"
                  style={{ marginBottom: "18px" }}
                >
                  <h3>
                    {registration.athletics?.name || "Unknown Sport"}
                  </h3>

                  <p>
                    <strong>Roblox Username:</strong>{" "}
                    {registration.roblox_username}
                  </p>

                  <p>
                    <strong>Discord Username:</strong>{" "}
                    {registration.discord_username}
                  </p>

                  <p>
                    <strong>Attendance Agreement:</strong>{" "}
                    {registration.attendance_agreement
                      ? "Confirmed"
                      : "Not Confirmed"}
                  </p>

                  <p className="muted" style={{ marginTop: "10px" }}>
                    Submitted{" "}
                    {new Date(registration.created_at).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() => deleteRegistration(registration.id)}
                    className="admin-action-btn admin-delete"
                    style={{ marginTop: "16px", width: "fit-content" }}
                  >
                    Delete Registration
                  </button>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No Registrations Yet</h3>
                <p>
                  Athletic registrations submitted by students will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
