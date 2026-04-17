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
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
  })

  useEffect(() => {
    const loadData = async () => {
      // load job
      const { data: jobData } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single()

      // load questions
      const { data: questionData } = await supabase
        .from("application_questions")
        .select("*")
        .eq("job_posting_id", jobId)

      setJob(jobData)
      setQuestions(questionData || [])
      setLoading(false)
    }

    if (jobId) loadData()
  }, [jobId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    // 1. create application
    const { data: appData, error } = await supabase
      .from("applications")
      .insert([
        {
          job_posting_id: jobId,
          applicant_name: form.applicant_name,
          applicant_email: form.applicant_email,
          applicant_phone: form.applicant_phone,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    const applicationId = appData.id

    // 2. insert answers
    if (questions.length) {
      const answerRows = questions.map((q) => ({
        application_id: applicationId,
        question_id: q.id,
        answer: answers[q.id] || "",
      }))

      await supabase.from("application_answers").insert(answerRows)
    }

    // reset
    setMessage("Application submitted successfully.")
    setForm({
      applicant_name: "",
      applicant_email: "",
      applicant_phone: "",
    })
    setAnswers({})
    setSaving(false)
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  if (!job) {
    return (
      <main className="page-shell">
        <div className="content-card">
          <h1>Job not found</h1>
        </div>
      </main>
    )
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Apply Now</p>
        <h1>{job.title}</h1>
        <p>
          {[job.department, job.location, job.employment_type]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </section>

      <main className="page-shell">
        <div className="content-card" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2>Application Form</h2>

          <form onSubmit={handleSubmit}>
            {/* BASIC INFO */}
            <div style={{ marginBottom: "14px" }}>
              <label>Full Name</label>
              <input
                name="applicant_name"
                value={form.applicant_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Email</label>
              <input
                name="applicant_email"
                value={form.applicant_email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Phone</label>
              <input
                name="applicant_phone"
                value={form.applicant_phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* CUSTOM QUESTIONS */}
            {questions.map((q) => (
              <div key={q.id} style={{ marginBottom: "14px" }}>
                <label>{q.question}</label>

                {q.question_type === "textarea" ? (
                  <textarea
                    onChange={(e) =>
                      handleAnswerChange(q.id, e.target.value)
                    }
                    style={textareaStyle}
                  />
                ) : (
                  <input
                    onChange={(e) =>
                      handleAnswerChange(q.id, e.target.value)
                    }
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Submitting..." : "Submit Application"}
            </button>
          </form>

          {message && <p style={{ marginTop: "16px" }}>{message}</p>}
        </div>
      </main>
    </>
  )
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
}

const textareaStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  resize: "vertical",
}
