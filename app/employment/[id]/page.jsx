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
    const loadData = async () => {
      const { data: jobData } = await supabase
        .from("jobs") // ✅ FIXED
        .select("*")
        .eq("id", jobId)
        .single()

      const { data: questionData } = await supabase
        .from("application_questions")
        .select("*")
        .eq("job_id", jobId) // ✅ FIXED

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

    // ✅ CREATE APPLICATION
    const { data: appData, error } = await supabase
      .from("applications")
      .insert([
        {
          job_id: jobId, // ✅ FIXED
          full_name: form.full_name,
          email: form.email,
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

    // ✅ SAVE ANSWERS
    if (questions.length) {
      const answerRows = questions.map((q) => ({
        application_id: applicationId,
        question_id: q.id,
        answer: answers[q.id] || "",
      }))

      await supabase.from("application_answers").insert(answerRows)
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

  if (!job) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Job not found</h1>
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
          <p className="muted">{job.description}</p>

          <div className="card" style={{ marginTop: "20px" }}>
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
                  <label>{q.question}</label>

                  <input
                    onChange={(e) =>
                      handleAnswerChange(q.id, e.target.value)
                    }
                    style={inputStyle}
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
              <p style={{ marginTop: "10px" }}>{message}</p>
            )}

          </div>

        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginTop: "10px",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
}
