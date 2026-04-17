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
    if (id) fetchData()
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
      .order("display_order", { ascending: true })
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
        is_published: job.is_published,
        applications_open: job.applications_open,
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
    const trimmed = newQuestion.trim()
    if (!trimmed) return

    const nextOrder = questions.length

    const { error } = await supabase
      .from("application_questions")
      .insert({
        job_posting_id: id,
        question: trimmed,
        question_type: "textarea",
        is_required: true,
        display_order: nextOrder,
      })

    if (error) {
      console.log("Add question error:", error)
      setMessage("Error adding question.")
      return
    }

    setNewQuestion("")
    setMessage("Question added.")
    fetchData()
  }

  async function saveQuestion(updatedQuestion) {
    const { error } = await supabase
      .from("application_questions")
      .update({
        question: updatedQuestion.question,
        question_type: "textarea",
        is_required: updatedQuestion.is_required,
        display_order: updatedQuestion.display_order,
      })
      .eq("id", updatedQuestion.id)

    if (error) {
      console.log("Save question error:", error)
      setMessage("Error saving question.")
      return
    }

    setMessage("Question updated.")
    fetchData()
  }

  async function deleteQuestion(questionId) {
    const { error } = await supabase
      .from("application_questions")
      .delete()
      .eq("id", questionId)

    if (error) {
      console.log("Delete question error:", error)
      setMessage("Error deleting question.")
      return
    }

    const remaining = questions.filter((q) => q.id !== questionId)
    await normalizeDisplayOrder(remaining)
    setMessage("Question deleted.")
    fetchData()
  }

  async function moveQuestion(index, direction) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= questions.length) return

    const reordered = [...questions]
    const temp = reordered[index]
    reordered[index] = reordered[newIndex]
    reordered[newIndex] = temp

    const withOrder = reordered.map((q, i) => ({
      ...q,
      display_order: i,
    }))

    setQuestions(withOrder)
    await normalizeDisplayOrder(withOrder)
    setMessage("Question order updated.")
    fetchData()
  }

  async function normalizeDisplayOrder(questionList) {
    const updates = questionList.map((q, index) =>
      supabase
        .from("application_questions")
        .update({ display_order: index })
        .eq("id", q.id)
    )

    const results = await Promise.all(updates)
    const failed = results.find((r) => r.error)
    if (failed?.error) {
      console.log("Reorder error:", failed.error)
      setMessage("Error reordering questions.")
    }
  }

  function updateLocalQuestion(id, field, value) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
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

            <label style={toggleLabelStyle}>
              <input
                type="checkbox"
                checked={!!job.is_published}
                onChange={(e) =>
                  setJob({ ...job, is_published: e.target.checked })
                }
              />
              Publish this job to the website
            </label>

            <label style={toggleLabelStyle}>
              <input
                type="checkbox"
                checked={!!job.applications_open}
                onChange={(e) =>
                  setJob({ ...job, applications_open: e.target.checked })
                }
              />
              Applications open
            </label>

            <button className="btn-primary" onClick={saveJob}>
              Save Job
            </button>
          </div>

          <div className="card" style={{ marginTop: "24px" }}>
            <h3>Application Questions</h3>
            <p className="muted" style={{ marginBottom: "16px" }}>
              All questions are long-answer responses.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type a new application question"
                style={textareaStyle}
              />
              <button className="btn-primary" onClick={addQuestion}>
                Add Question
              </button>
            </div>

            {questions.length ? (
              questions.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "14px",
                    background: "#fff",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Question {index + 1}
                  </label>

                  <textarea
                    value={q.question || ""}
                    onChange={(e) =>
                      updateLocalQuestion(q.id, "question", e.target.value)
                    }
                    style={textareaStyle}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    <label style={toggleLabelStyle}>
                      <input
                        type="checkbox"
                        checked={!!q.is_required}
                        onChange={(e) =>
                          updateLocalQuestion(q.id, "is_required", e.target.checked)
                        }
                      />
                      Required
                    </label>

                    <button
                      onClick={() => moveQuestion(index, -1)}
                      style={smallButtonStyle}
                      disabled={index === 0}
                    >
                      Move Up
                    </button>

                    <button
                      onClick={() => moveQuestion(index, 1)}
                      style={smallButtonStyle}
                      disabled={index === questions.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      onClick={() => saveQuestion(q)}
                      style={smallButtonStyle}
                    >
                      Save
                    </button>

                    <button
                      onClick={() => deleteQuestion(q.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted">No questions added yet.</p>
            )}
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
  minHeight: "110px",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
}

const toggleLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
  fontWeight: 500,
}

const smallButtonStyle = {
  border: "none",
  background: "#e2e8f0",
  color: "#0f172a",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
}

const deleteButtonStyle = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
}
