"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { useParams } from "next/navigation"

export default function JobQuestionsPage() {
  const { id } = useParams()

  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState("")
  const [type, setType] = useState("text")

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    const { data } = await supabase
      .from("application_questions")
      .select("*")
      .eq("job_posting_id", id)
      .order("created_at", { ascending: true })

    setQuestions(data || [])
  }

  const addQuestion = async () => {
    if (!newQuestion) return

    await supabase.from("application_questions").insert([
      {
        job_posting_id: id,
        question: newQuestion,
        question_type: type,
      },
    ])

    setNewQuestion("")
    setType("text")
    loadQuestions()
  }

  const updateQuestion = async (q) => {
    await supabase
      .from("application_questions")
      .update({
        question: q.question,
        question_type: q.question_type,
      })
      .eq("id", q.id)

    loadQuestions()
  }

  const deleteQuestion = async (qid) => {
    await supabase
      .from("application_questions")
      .delete()
      .eq("id", qid)

    loadQuestions()
  }

  return (
    <main className="page-shell">
      <div className="content-card">
        <h1>Application Questions</h1>
        <p>Create and manage questions for this job posting.</p>

        {/* ADD NEW QUESTION */}
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <input
            placeholder="Enter question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={inputStyle}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option value="text">Short Answer</option>
            <option value="textarea">Long Answer</option>
          </select>

          <button className="btn btn-primary" onClick={addQuestion}>
            Add Question
          </button>
        </div>

        {/* QUESTION LIST */}
        <div style={{ display: "grid", gap: "14px" }}>
          {questions.length ? (
            questions.map((q) => (
              <div key={q.id} className="announcement-card">
                <input
                  value={q.question}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, question: e.target.value }
                          : item
                      )
                    )
                  }
                  style={inputStyle}
                />

                <select
                  value={q.question_type}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, question_type: e.target.value }
                          : item
                      )
                    )
                  }
                  style={inputStyle}
                >
                  <option value="text">Short Answer</option>
                  <option value="textarea">Long Answer</option>
                </select>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={() => updateQuestion(q)}
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => deleteQuestion(q.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="announcement-card">
              <h3>No questions yet</h3>
              <p>Add questions for applicants to answer.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
}
