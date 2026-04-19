"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

export default function ApplicationDetailPage() {
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState(null)
  const [job, setJob] = useState(null)
  const [answersRaw, setAnswersRaw] = useState([])
  const [questions, setQuestions] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (id) {
      loadApplication()
    }
  }, [id])

  async function loadApplication() {
    setLoading(true)
    setErrorMessage("")

    const { data: applicationData, error: applicationError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    console.log("applicationData:", applicationData)
    console.log("applicationError:", applicationError)

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

    const { data: jobData, error: jobError } = await supabase
      .from("job_postings")
      .select("title, department, location, employment_type")
      .eq("id", applicationData.job_posting_id)
      .maybeSingle()

    console.log("jobData:", jobData)
    console.log("jobError:", jobError)

    if (!jobError) {
      setJob(jobData || null)
    }

    const { data: answersData, error: answersError } = await supabase
      .from("application_answers")
      .select("*")
      .eq("application_id", id)

    console.log("answersData:", answersData)
    console.log("answersError:", answersError)

    if (answersError) {
      setErrorMessage(answersError.message || "Could not load answers.")
      setLoading(false)
      return
    }

    setAnswersRaw(answersData || [])

    const questionIds = (answersData || []).map((a) => a.question_id)

    if (questionIds.length > 0) {
      const { data: questionsData, error: questionsError } = await supabase
        .from("application_questions")
        .select("id, label, help_text, is_required, sort_order")
        .in("id", questionIds)

      console.log("questionsData:", questionsData)
      console.log("questionsError:", questionsError)

      if (!questionsError) {
        setQuestions(questionsData || [])
      }
    }

    setLoading(false)
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
            <p className="muted">{errorMessage || "This application could not be loaded."}</p>
          </div>
        </section>
      </main>
    )
  }

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
              <strong>Status:</strong> {application.status || "pending"}
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
