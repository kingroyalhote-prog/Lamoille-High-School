"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { useParams } from "next/navigation"

export default function JobEditor() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: jobData } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single()

    const { data: questionData } = await supabase
      .from("application_questions")
      .select("*")
      .eq("job_id", id)

    setJob(jobData)
    setQuestions(questionData || [])
  }

  async function updateJob() {
    await supabase
      .from("jobs")
      .update({
        title: job.title,
        description: job.description,
      })
      .eq("id", id)

    alert("Saved")
  }

  async function addQuestion() {
    if (!newQuestion) return

    await supabase.from("application_questions").insert({
      job_id: id,
      question: newQuestion,
    })

    setNewQuestion("")
    fetchData()
  }

  async function deleteQuestion(qid) {
    await supabase
      .from("application_questions")
      .delete()
      .eq("id", qid)

    fetchData()
  }

  if (!job) return <p>Loading...</p>

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <h1>Edit Job</h1>

          {/* JOB INFO */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3>Job Details</h3>

            <input
              value={job.title}
              onChange={(e) =>
                setJob({ ...job, title: e.target.value })
              }
              placeholder="Job Title"
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              value={job.description}
              onChange={(e) =>
                setJob({ ...job, description: e.target.value })
              }
              placeholder="Description"
              style={{ width: "100%", height: "120px" }}
            />

            <button onClick={updateJob} className="btn-primary">
              Save Job
            </button>
          </div>

          {/* QUESTIONS */}
          <div className="card">
            <h3>Application Questions</h3>

            {questions.map((q) => (
              <div
                key={q.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>{q.question}</span>

                <button
                  onClick={() => deleteQuestion(q.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </div>
            ))}

            <div style={{ marginTop: "10px" }}>
              <input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="New question"
                style={{ width: "100%", marginBottom: "8px" }}
              />

              <button onClick={addQuestion} className="btn-primary">
                Add Question
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
