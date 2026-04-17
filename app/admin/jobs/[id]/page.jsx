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
      console.log("Job error:", jobError)
      setLoading(false)
      return
    }

    const { data: questionData, error: questionError } = await supabase
      .from("application_questions")
      .select("*")
      .eq("job_posting_id", id)
      .order("display_order", { ascending: true })

    if (questionError) {
      console.log("Question error:", questionError)
    }

    setJob(jobData)
    setQuestions(questionData || [])
    setLoading(false)
  }

  async function saveJob() {
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

    setMessage("Saved successfully.")
  }

  async function addQuestion() {
    const trimmed = newQuestion.trim()
    if (!trimmed) return

    const nextOrder = questions.length

    const { data, error } = await supabase
      .from("application_questions")
      .insert([
        {
          job_posting_id: id,
          question: trimmed,
          question_type: "textarea",
          is_required: true,
          display_order: nextOrder,
        },
      ])
      .select()

    console.log("Insert result:", data)
    console.log("Insert error:", error)

    if (error) {
      setMessage(error.message || "Error adding question.")
      return
    }

    if (!data || !data.length) {
      setMessage("Question did not save.")
      return
    }

    setNewQuestion("")
    setMessage("Question added.")
    await fetchData()
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

    await fetchData()
  }

  async function saveQuestion(q) {
    const { error } = await supabase
      .from("application_questions")
      .update({
        question: q.question,
        is_required: q.is_required,
        display_order: q.display_order,
      })
      .eq("id", q.id)

    if (error) {
      console.log(error)
      setMessage("Error saving question.")
      return
    }

    setMessage("Question updated.")
    await fetchData()
  }

  async function moveQuestion(index, direction) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= questions.length) return

    const reordered = [...questions]
    const temp = reordered[index]
    reordered[index] = reordered[newIndex]
    reordered[newIndex] = temp

    const updated = reordered.map((q, i) => ({
      ...q,
      display_order: i,
    }))

    setQuestions(updated)

    for (let q of updated) {
      await supabase
        .from("application_questions")
        .update({ display_order: q.display_order })
        .eq("id", q.id)
    }

    await fetchData()
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

          {message && <p className="muted">{message}</p>}

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Job Details</h3>

            <input
              value={job.title || ""}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              style={inputStyle}
              placeholder="Title"
            />

            <input
              value={job.department || ""}
              onChange={(e) => setJob({ ...job, department: e.target.value })}
              style={inputStyle}
              placeholder="Department"
            />

            <input
              value={job.location || ""}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              style={inputStyle}
              placeholder="Location"
            />

            <input
              value={job.employment_type || ""}
              onChange={(e) =>
                setJob({ ...job, employment_type: e.target.value })
              }
              style={inputStyle}
              placeholder="Employment Type"
            />

            <textarea
              value={job.description || ""}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              style={textareaStyle}
              placeholder="Description"
            />

            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={!!job.is_published}
                onChange={(e) =>
                  setJob({ ...job, is_published: e.target.checked })
                }
              />
              Published (visible on site)
            </label>

            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={!!job.applications_open}
                onChange={(e) =>
                  setJob({ ...job, applications_open: e.target.checked })
                }
              />
              Applications Open
            </label>

            <button className="btn-primary" onClick={saveJob}>
              Save Job
            </button>
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Application Questions</h3>

            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="New question..."
              style={textareaStyle}
            />

            <button className="btn-primary" onClick={addQuestion}>
              Add Question
            </button>

            {questions.map((q, index) => (
              <div key={q.id} style={questionCard}>
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    updateLocalQuestion(q.id, "question", e.target.value)
                  }
                  style={textareaStyle}
                />

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <label style={toggleStyle}>
                    <input
                      type="checkbox"
                      checked={!!q.is_required}
                      onChange={(e) =>
                        updateLocalQuestion(q.id, "is_required", e.target.checked)
                      }
                    />
                    Required
                  </label>

                  <button onClick={() => moveQuestion(index, -1)}>↑</button>
                  <button onClick={() => moveQuestion(index, 1)}>↓</button>
                  <button onClick={() => saveQuestion(q)}>Save</button>
                  <button onClick={() => deleteQuestion(q.id)}>Delete</button>
                </div>
              </div>
            ))}
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
  minHeight: "100px",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
}

const toggleStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "10px",
  alignItems: "center",
}

const questionCard = {
  border: "1px solid #e2e8f0",
  padding: "12px",
  borderRadius: "10px",
  marginTop: "10px",
}
