"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

function getStatusStyles(status) {
  switch (status) {
    case "accepted":
      return {
        label: "Accepted",
        background: "#dcfce7",
        color: "#166534",
      }
    case "denied":
      return {
        label: "Denied",
        background: "#fee2e2",
        color: "#991b1b",
      }
    default:
      return {
        label: "Not Reviewed",
        background: "#e2e8f0",
        color: "#334155",
      }
  }
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState(null)
  const [job, setJob] = useState(null)
  const [answersRaw, setAnswersRaw] = useState([])
  const [questions, setQuestions] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [working, setWorking] = useState(false)

  useEffect(() => {
    if (id) {
      loadApplication()
    }
  }, [id])

  async function loadApplication() {
    setLoading(true)
    setErrorMessage("")
    setActionMessage("")

    const { data: applicationData, error: applicationError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (applicationError) {
      setErrorMessage(applicationError.message || "Could not load application.")
      setLoading(false)
      return
    }

    if (!applicationData) {
      setErrorMessage("This application could not be loaded.")
      setLoading(false)
      return
    }

    // ✅ FIX HERE
    setApplication(applicationData)
    setErrorMessage("")

    const { data: jobData } = await supabase
      .from("job_postings")
      .select("title, department, location, employment_type")
      .eq("id", applicationData.job_posting_id)
      .maybeSingle()

    setJob(jobData || null)

    const { data: answersData, error: answersError } = await supabase
      .from("application_answers")
      .select("*")
      .eq("application_id", id)

    if (answersError) {
      setErrorMessage(answersError.message || "Could not load answers.")
      setLoading(false)
      return
    }

    setAnswersRaw(answersData || [])

    const questionIds = (answersData || []).map((a) => a.question_id)

    if (questionIds.length > 0) {
      const { data: questionsData } = await supabase
        .from("application_questions")
        .select("id, label, help_text, is_required, sort_order")
        .in("id", questionIds)

      setQuestions(questionsData || [])
    } else {
      setQuestions([])
    }

    setLoading(false)
  }

  async function handleDecision(status) {
    let denialReason = ""

    if (status === "denied") {
      denialReason = prompt("Enter the reason for denial:")

      if (!denialReason || !denialReason.trim()) {
        setActionMessage("Denial reason is required.")
        return
      }
    }

    setWorking(true)
    setActionMessage("")

    const res = await fetch(`/api/applications/${id}/decision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        denialReason,
      }),
    })

    const data = await res.json()

    setWorking(false)

    if (!res.ok) {
      setActionMessage(data.error || "Something went wrong.")
      return
    }

    setApplication((prev) => ({
      ...prev,
      status,
    }))

    setActionMessage(data.message || `Application ${status}.`)
  }

  async function updateStatus(nextStatus) {
    setWorking(true)
    setActionMessage("")

    const { error } = await supabase
      .from("applications")
      .update({ status: nextStatus })
      .eq("id", id)

    if (error) {
      setActionMessage(error.message || "Could not update application status.")
      setWorking(false)
      return
    }

    setApplication((prev) => ({ ...prev, status: nextStatus }))

    setActionMessage("Application updated.")
    setWorking(false)
  }

  async function deleteApplication() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application? This cannot be undone."
    )

    if (!confirmed) return

    setWorking(true)
    setActionMessage("")

    const { error: answersError } = await supabase
      .from("application_answers")
      .delete()
      .eq("application_id", id)

    if (answersError) {
      setActionMessage(answersError.message || "Could not delete answers.")
      setWorking(false)
      return
    }

    const { error: appError } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)

    if (appError) {
      setActionMessage(appError.message || "Could not delete application.")
      setWorking(false)
      return
    }

    router.push("/admin/applications")
  }

  const sortedAnswers = useMemo(() => {
    const questionMap = new Map((questions || []).map((q) => [q.id, q]))

    return (answersRaw || [])
      .map((a) => ({
        ...a,
        question: questionMap.get(a.question_id) || null,
      }))
      .sort((a, b) => {
        const aOrder = a.question?.sort_order ?? 0
        const bOrder = b.question?.sort_order ?? 0
        return aOrder - bOrder
      })
  }, [answersRaw, questions])

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!application) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Application not found</h1>
            <p className="muted">
              {errorMessage || "This application could not be loaded."}
            </p>
          </div>
        </section>
      </main>
    )
  }

  const statusStyles = getStatusStyles(application.status)

  return (
    <main className="content">
      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <p className="section-label">Admin</p>
          <h1>{application.full_name || "Applicant"}</h1>

          {errorMessage && (
            <p className="muted" style={{ marginBottom: "16px" }}>
              {errorMessage}
            </p>
          )}

          {actionMessage && (
            <p className="muted" style={{ marginBottom: "16px" }}>
              {actionMessage}
            </p>
          )}

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Application Details</h3>

            <p><strong>Email:</strong> {application.email || "Not provided"}</p>
            <p><strong>Discord Username:</strong> {application.discord_username || "Not provided"}</p>
            <p><strong>Roblox Username:</strong> {application.roblox_username || "Not provided"}</p>

            <p>
              <strong>Status:</strong>
              <span
                style={{
                  marginLeft: "6px",
                  background: statusStyles.background,
                  color: statusStyles.color,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {statusStyles.label}
              </span>
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {application.created_at
                ? new Date(application.created_at).toLocaleString()
                : "Unknown"}
            </p>

            <p><strong>Position:</strong> {job?.title || "Unknown"}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button onClick={() => handleDecision("accepted")} disabled={working}>
                Accept
              </button>

              <button onClick={() => handleDecision("denied")} disabled={working}>
                Deny
              </button>

              <button onClick={() => updateStatus("not_reviewed")} disabled={working}>
                Mark Not Reviewed
              </button>

              <button onClick={deleteApplication} disabled={working}>
                Delete
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Question Responses</h3>

            {sortedAnswers.length ? (
              sortedAnswers.map((item) => (
                <div key={item.id} style={{ padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
                  <p style={{ fontWeight: 700 }}>{item.question?.label}</p>
                  <p style={{ whiteSpace: "pre-wrap" }}>{item.answer}</p>
                </div>
              ))
            ) : (
              <p className="muted">No answers found.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
