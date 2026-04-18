"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase"

export default function NewJobPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function createJob() {
    if (!title.trim()) {
      alert("Title is required")
      return
    }

    setLoading(true)

    const slug =
      title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now()

    const { data, error } = await supabase
      .from("job_postings")
      .insert({
        title: title.trim(),
        slug,
        department: department || null,
        location: location || null,
        employment_type: employmentType || null,
        description: description || null,
        is_published: false,
        applications_open: true,
      })
      .select()
      .single()

    if (error) {
      console.log(error)
      alert(error.message || "Error creating job")
      setLoading(false)
      return
    }

    router.push(`/admin/jobs/${data.id}`)
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <h1>Create New Job</h1>

          <div className="card" style={{ maxWidth: "700px" }}>
            <input
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Employment Type"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              style={inputStyle}
            />

            <textarea
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={textareaStyle}
            />

            <button
              onClick={createJob}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Draft Job"}
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
