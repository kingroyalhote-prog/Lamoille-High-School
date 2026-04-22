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

    setApplication(applicationData)

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

    if (nextStatus === "accepted") {
      setActionMessage("Application marked as accepted.")
    } else if (nextStatus === "denied") {
      setActionMessage("Application marked as denied.")
    } else {
      setActionMessage("Application marked as not reviewed.")
    }

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

          {errorMessage ? (
            <p className="muted" style={{ marginBottom: "16px" }}>
              {errorMessage}
            </p>
          ) : null}

          {actionMessage ? (
            <p className="muted" style={{ marginBottom: "16px" }}>
              {actionMessage}
            </p>
          ) : null}

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Application Details</h3>

            <p>
              <strong>Email:</strong> {application.email || "Not provided"}
            </p>

            <p>
              <strong>Discord Username:</strong>{" "}
              {application.discord_username || "Not provided"}
            </p>

            <p>
              <strong>Roblox Username:</strong>{" "}
              {application.roblox_username || "Not provided"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "6px",
                  background: statusStyles.background,
                  color: statusStyles.color,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  verticalAlign: "middle",
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

            <p>
              <strong>Position:</strong> {job?.title || "Unknown"}
            </p>

            <p className="muted">
              {[job?.department, job?.location, job?.employment_type]
                .filter(Boolean)
                .join(" • ")}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "18px",
              }}
            >
              <button
                onClick={() => updateStatus("accepted")}
                disabled={working}
                style={{
                  border: "none",
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus("denied")}
                disabled={working}
                style={{
                  border: "none",
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Deny
              </button>

              <button
                onClick={() => updateStatus("not_reviewed")}
                disabled={working}
                style={{
                  border: "none",
                  background: "#e2e8f0",
                  color: "#334155",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Mark Not Reviewed
              </button>

              <button
                onClick={deleteApplication}
                disabled={working}
                style={{
                  border: "none",
                  background: "#1e293b",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Delete Application
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Question Responses</h3>

            {sortedAnswers.length ? (
              sortedAnswers.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ fontWeight: 700, marginBottom: "6px" }}>
                    {item.question?.label || "Question"}
                    {item.question?.is_required ? " *" : ""}
                  </p>

                  {item.question?.help_text ? (
                    <p className="muted" style={{ marginBottom: "8px" }}>
                      {item.question.help_text}
                    </p>
                  ) : null}

                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {item.answer || "No response provided"}
                  </p>
                </div>
              ))
            ) : (
              <p className="muted">No answers found for this application.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
