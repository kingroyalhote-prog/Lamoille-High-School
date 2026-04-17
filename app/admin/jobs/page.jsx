"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminJobsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [jobs, setJobs] = useState([])

  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "",
    description: "",
    status: "draft",
  })

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      await loadJobs()
      setLoading(false)
    }

    init()
  }, [router])

  const loadJobs = async () => {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setJobs(data || [])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const payload = {
      ...form,
      slug: `${createSlug(form.title)}-${Date.now()}`,
    }

    const { error } = await supabase.from("job_postings").insert([payload])

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Job created successfully.")
      setForm({
        title: "",
        department: "",
        location: "",
        employment_type: "",
        description: "",
        status: "draft",
      })
      await loadJobs()
    }

    setSaving(false)
  }

  const toggleStatus = async (job) => {
    const nextStatus =
      job.status === "open" ? "closed" : job.status === "closed" ? "draft" : "open"

    const { error } = await supabase
      .from("job_postings")
      .update({ status: nextStatus })
      .eq("id", job.id)

    if (!error) {
      await loadJobs()
    }
  }

  const deleteJob = async (id) => {
    const confirmed = window.confirm("Delete this job posting?")
    if (!confirmed) return

    const { error } = await supabase
      .from("job_postings")
      .delete()
      .eq("id", id)

    if (!error) {
      await loadJobs()
    }
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <h1>Manage Job Postings</h1>
        <p>Create job postings and control whether they are open to applications.</p>
      </div>

      <div className="info-grid" style={{ alignItems: "start" }}>
        <div className="content-card">
          <h2>Create Job Posting</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Department</label>
              <input name="department" value={form.department} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Employment Type</label>
              <input
                name="employment_type"
                value={form.employment_type}
                onChange={handleChange}
                placeholder="Full-time, Part-time, Seasonal..."
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                style={textareaStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Job"}
            </button>
          </form>

          {message && <p style={{ marginTop: "14px" }}>{message}</p>}
        </div>

        <div className="content-card">
          <h2>Current Job Postings</h2>

          <div style={{ display: "grid", gap: "14px" }}>
            {jobs.length ? (
              jobs.map((job) => (
                <div key={job.id} className="announcement-card" style={{ padding: "18px" }}>
                  <p className="announcement-date">Status: {job.status}</p>
                  <h3>{job.title}</h3>
                  <p>{[job.department, job.location, job.employment_type].filter(Boolean).join(" • ")}</p>
                  <p>{job.description}</p>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                    <button className="btn btn-primary" type="button" onClick={() => toggleStatus(job)}>
                      Change Status
                    </button>

                    <button className="btn btn-secondary" type="button" onClick={() => deleteJob(job.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="announcement-card">
                <h3>No jobs yet</h3>
                <p>Your saved job postings will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
}

const textareaStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  resize: "vertical",
}
