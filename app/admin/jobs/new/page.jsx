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
  const [loading, setLoading] = useState(false)

  async function createJob() {
    if (!title) {
      alert("Title is required")
      return
    }

    setLoading(true)

    const slug =
      title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()

    const { data, error } = await supabase
      .from("job_postings")
      .insert({
        title,
        slug,
        department: department || "General",
        location: location || "Not specified",
        employment_type: employmentType || "Full-time",
        is_published: false,
        applications_open: true,
      })
      .select()
      .single()

    if (error) {
      console.log(error)
      alert("Error creating job")
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

          <div className="card" style={{ maxWidth: "600px" }}>
            <input
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Department (optional)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Location (optional)"
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
