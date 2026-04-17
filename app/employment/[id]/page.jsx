"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useParams } from "next/navigation"

export default function JobApplicationPage() {
  const params = useParams()
  const jobId = params.id

  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    notes: "",
  })

  useEffect(() => {
    const loadJob = async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single()

      if (!error) {
        setJob(data)
      }

      setLoading(false)
    }

    if (jobId) loadJob()
  }, [jobId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const { error } = await supabase.from("applications").insert([
      {
        job_posting_id: jobId,
        applicant_name: form.applicant_name,
        applicant_email: form.applicant_email,
        applicant_phone: form.applicant_phone,
        review_notes: form.notes,
        status: "pending",
      },
    ])

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Application submitted successfully.")
      setForm({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        notes: "",
      })
    }

    setSaving(false)
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  if (!job) {
    return (
      <main className="page-shell">
        <div className="content-card">
          <h1>Job not found</h1>
        </div>
      </main>
    )
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Apply Now</p>
        <h1>{job.title}</h1>
        <p>{[job.department, job.location, job.employment_type].filter(Boolean).join(" • ")}</p>
      </section>

      <main className="page-shell">
        <div className="content-card" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2>Application Form</h2>
          <p style={{ marginBottom: "20px" }}>{job.description}</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label>Full Name</label>
              <input name="applicant_name" value={form.applicant_name} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Email</label>
              <input name="applicant_email" value={form.applicant_email} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Phone</label>
              <input name="applicant_phone" value={form.applicant_phone} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Additional Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={6} style={textareaStyle} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Submitting..." : "Submit Application"}
            </button>
          </form>

          {message && <p style={{ marginTop: "16px" }}>{message}</p>}
        </div>
      </main>
    </>
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
