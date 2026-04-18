"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useParams } from "next/navigation"

export default function JobApplicationPage() {
  const { id: jobId } = useParams()

  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  })

  useEffect(() => {
    if (jobId) loadData()
  }, [jobId])

  async function loadData() {
    setLoading(true)

    const { data: jobData, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .single()

    if (jobError) {
      console.log("Job error:", jobError)
    }

    const { data: questionData, error: questionError } = await supabase
      .from("application_questions")
      .select("*")
      .eq("job_posting_id", jobId)
      .order("sort_order", { ascending: true })

    if (questionError) {
      console.log("Question error:", questionError)
    }

    setJob(jobData)
    setQuestions(questionData || [])
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleAnswerChange(qid, value) {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    for (const q of questions) {
      if (q.is_required && !answers[q.id]?.trim()) {
        setMessage("Please answer all required questions.")
        setSaving(false)
        return
      }
    }

   const { data, error } = await supabase.rpc("insert_application", {
  job_id: jobId,
  name: form.full_name,
  email: form.email,
})

console.log("RPC result:", data)
console.log("RPC error:", error)

if (error) {
  setMessage(error.message || "Error submitting application.")
  setSaving(false)
  return
}

const applicationId = data

    if (error) {
      console.log(error)
      setMessage(error.message || "Error submitting application.")
      setSaving(false)
      return
    }

    const applicationId = appData.id

    if (questions.length) {
      const answerRows = questions.map((q) => ({
        application_id: applicationId,
        question_id: q.id,
        answer: answers[q.id] || "",
      }))

      const { error: answerError } = await supabase
        .from("application_answers")
        .insert(answerRows)

      if (answerError) {
        console.log(answerError)
      }
    }

    setMessage("Application submitted successfully.")
    setForm({ full_name: "", email: "" })
    setAnswers({})
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="loading-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!job || !job.is_published) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Job not available</h1>
            <p className="muted">This position is not currently available.</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container" style={{ maxWidth: "700px" }}>
          <p className="section-label">Apply Now</p>
          <h1>{job.title}</h1>

          <p className="muted" style={{ marginBottom: "20px" }}>
            {[job.department, job.location, job.employment_type]
              .filter(Boolean)
              .join(" • ")}
          </p>

          {!job.applications_open ? (
            <div className="card">
              <h3>Applications are currently closed</h3>
              <p>Please check back later.</p>
            </div>
          ) : (
            <div className="card">
              <h3>Application Form</h3>

              <form onSubmit={handleSubmit}>
                <input
                  name="full_name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />

                {questions.map((q) => (
                  <div key={q.id}>
                    <label style={labelStyle}>
                      {q.label}
                      {q.is_required && " *"}
                    </label>

                    {q.help_text ? (
                      <p className="muted" style={{ marginTop: "-4px", marginBottom: "8px" }}>
                        {q.help_text}
                      </p>
                    ) : null}

                    <textarea
                      required={!!q.is_required}
                      onChange={(e) =>
                        handleAnswerChange(q.id, e.target.value)
                      }
                      style={textareaStyle}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? "Submitting..." : "Submit Application"}
                </button>
              </form>

              {message && (
                <p style={{ marginTop: "12px" }}>{message}</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
}

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
}

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
}
