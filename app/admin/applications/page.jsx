"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminApplicationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      await loadApplications()
      setLoading(false)
    }

    init()
  }, [router])

  const loadApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        job_postings(title),
        application_answers(
          answer,
          application_questions(question)
        )
      `)
      .order("created_at", { ascending: false })

    if (!error) {
      setApplications(data || [])
    }
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("applications")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (!error) {
      await loadApplications()
    }
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <h1>Review Applications</h1>
        <p>Review, accept, or deny incoming applications.</p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {applications.length ? (
          applications.map((app) => (
            <div key={app.id} className="content-card">
              <p className="announcement-date">
                Status: {app.status || "pending"}
              </p>

              <h2 style={{ marginBottom: "8px" }}>
                {app.applicant_name}
              </h2>

              <p><strong>Job:</strong> {app.job_postings?.title || "Unknown"}</p>
              <p><strong>Email:</strong> {app.applicant_email}</p>
              <p><strong>Phone:</strong> {app.applicant_phone || "Not provided"}</p>

              {/* CUSTOM ANSWERS */}
              {app.application_answers?.length ? (
                <div style={{ marginTop: "14px" }}>
                  <h3 style={{ marginBottom: "10px" }}>Responses</h3>

                  {app.application_answers.map((a, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      <strong>{a.application_questions?.question}</strong>
                      <p style={{ marginTop: "4px" }}>
                        {a.answer || "No response"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(app.id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => updateStatus(app.id, "denied")}
                >
                  Deny
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => updateStatus(app.id, "pending")}
                >
                  Set Pending
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="content-card">
            <h2>No applications yet</h2>
            <p>Applications will appear here once submitted.</p>
          </div>
        )}
      </div>
    </main>
  )
}
