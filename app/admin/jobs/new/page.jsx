"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

export default function NewJobPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function createJob() {
    if (!title) return alert("Title is required")

    setLoading(true)

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        description,
      })
      .select()
      .single()

    if (error) {
      alert("Error creating job")
      setLoading(false)
      return
    }

    // redirect to edit page after creating
    router.push(`/admin/jobs/${data.id}`)
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <h1>Create New Job</h1>

          <div className="card">

            <input
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", height: "120px" }}
            />

            <button
              onClick={createJob}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>

          </div>

        </div>
      </section>
    </main>
  )
}
