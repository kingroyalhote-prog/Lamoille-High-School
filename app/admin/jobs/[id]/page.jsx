"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { useParams } from "next/navigation"

export default function JobEditorPage() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  async function fetchData() {
    setLoading(true)

    const { data: jobData, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single()

    if (jobError) {
      console.log("Job load error:", jobError)
      setLoading(false)
      return
    }

    const { data: questionData, error: questionError } = await supabase
      .from("application_questions")
      .select("*")
      .eq("job_posting_id", id)
      .order("created_at", { ascending: true })

    if (questionError) {
      console.log("Question load error:", questionError)
    }

    setJob(jobData)
    setQuestions(questionData || [])
    setLoading(false)
  }

  async function saveJob() {
    if (!job) return

    const { error } = await supabase
      .from("job_postings")
      .update({
        title: job.title,
        department: job.department,
        location: job.location,
        employment_type: job.employment_type,
        description: job.description,
      })
      .eq("id", id)

    if (error) {
      console.log(error)
      setMessage("Error saving job.")
      return
    }

    setMessage("Job saved successfully.")
  }

  async function addQuestion() {
    if (!newQuestion.trim()) return

    const { error } = await supabase
      .from("application_questions")
      .insert({
        job_posting_id: id,
        question: newQuestion,
        question_type: "text",
      })

    if (error) {
      console.log(error)
      setMessage("Error adding question.")
      return
    }

    setNewQuestion("")
    fetchData()
  }

  async function deleteQuestion(questionId) {
    const { error } = await supabase
      .from("application_questions")
      .delete()
      .eq("id", questionId)

    if (error) {
      console.log(error)
      setMessage("Error deleting question.")
      return
    }

    fetchData()
  }

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

  if (!job) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Job not found</h1>
            <p className="muted">This posting could not be loaded.</p>
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
          <h1>Edit Job Posting</h1>

          {message && (
            <p className="muted" style={{ marginTop: "10px" }}>
              {message}
            </p>
          )}

          <div className="card" style={{ marginTop: "24px" }}>
            <h3>Job Details</h3>

            <input
              value={job.title || ""}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              placeholder="Job Title"
              style={inputStyle}
            />

            <input
              value={job.department || ""}
              onChange={(e) => setJob({ ...job, department: e.target.value })}
              placeholder="Department"
              style={inputStyle}
            />

            <input
              value={job.location || ""}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              placeholder="Location"
              style={inputStyle}
            />

            <input
              value={job.employment_type || ""}
              onChange={(e) =>
                setJob({ ...job, employment_type: e.target.value })
              }
              placeholder="Employment Type"
              style={inputStyle}
            />

            <textarea
              value={job.description || ""}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              placeholder="Job Description"
              style={textareaStyle}
            />

            <button className="btn-primary" onClick={saveJob}>
              Save Job
            </button>
          </div>

          <div className="card" style={{ marginTop: "24px" }}>
            <h3>Application Questions</h3>

            <div style={{ marginTop: "12px", marginBottom: "16px" }}>
              {questions.length ? (
                questions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #e2e8f0",
                      gap: "12px",
                    }}
                  >
                    <span>{q.question}</span>

                    <button
                      onClick={() => deleteQuestion(q.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="muted">No questions added yet.</p>
              )}
            </div>

            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Add a new application question"
              style={inputStyle}
            />

            <button className="btn-primary" onClick={addQuestion}>
              Add Question
            </button>
          </div>
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
  minHeight: "140px",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
}

const deleteButtonStyle = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
}
