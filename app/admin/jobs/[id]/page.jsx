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
    loadQuestions()
  }

  const deleteQuestion = async (qid) => {
    await supabase.from("application_questions").delete().eq("id", qid)
    loadQuestions()
  }

  return (
    <main className="page-shell">
      <div className="content-card">
        <h1>Application Questions</h1>

        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Enter question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={inputStyle}
          />

          <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
            <option value="text">Short Answer</option>
            <option value="textarea">Long Answer</option>
          </select>

          <button className="btn btn-primary" onClick={addQuestion}>
            Add Question
          </button>
        </div>

        {questions.map((q) => (
          <div key={q.id} className="announcement-card">
            <p>{q.question}</p>
            <button className="btn btn-secondary" onClick={() => deleteQuestion(q.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ccc",
}
