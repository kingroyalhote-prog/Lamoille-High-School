"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminAnnouncementsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [announcements, setAnnouncements] = useState([])

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    is_published: false,
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

      await loadAnnouncements()
      setLoading(false)
    }

    init()
  }, [router])

  const loadAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, summary, content, is_published, published_at, created_at")
      .order("created_at", { ascending: false })

    if (!error) {
      setAnnouncements(data || [])
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
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

    const slug = createSlug(form.title) + "-" + Date.now()

    const payload = {
      title: form.title,
      slug,
      summary: form.summary,
      content: form.content,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    }

    const { error } = await supabase.from("announcements").insert([payload])

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Announcement created successfully.")
      setForm({
        title: "",
        summary: "",
        content: "",
        is_published: false,
      })
      await loadAnnouncements()
    }

    setSaving(false)
  }

  const togglePublish = async (item) => {
    const nextPublished = !item.is_published

    const { error } = await supabase
      .from("announcements")
      .update({
        is_published: nextPublished,
        published_at: nextPublished ? new Date().toISOString() : null,
      })
      .eq("id", item.id)

    if (!error) {
      await loadAnnouncements()
    }
  }

  const deleteAnnouncement = async (id) => {
    const confirmed = window.confirm("Delete this announcement?")
    if (!confirmed) return

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id)

    if (!error) {
      await loadAnnouncements()
    }
  }

  if (loading) {
    return (
      <main className="page-shell">
        <div className="content-card">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <p className="section-label">Admin</p>
        <h1 style={{ marginBottom: "8px" }}>Manage Announcements</h1>
        <p className="muted">
          Create updates, publish them to the homepage, or keep them saved as drafts.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div className="content-card" style={{ position: "sticky", top: "100px" }}>
          <h2 style={{ marginBottom: "18px" }}>Create Announcement</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Enter announcement title"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Summary</label>
              <input
                name="summary"
                value={form.summary}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Short summary for cards/homepage"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={7}
                style={textareaStyle}
                placeholder="Write the full announcement here"
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                Publish immediately
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Announcement"}
            </button>
          </form>

          {message ? (
            <p className="muted" style={{ marginTop: "14px" }}>
              {message}
            </p>
          ) : null}
        </div>

        <div className="content-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "6px" }}>Saved Announcements</h2>
              <p className="muted">
                {announcements.length} total
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {announcements.length ? (
              announcements.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #ffffff, #f8fafc)",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 18px",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: item.is_published ? "#4f46e5" : "#64748b",
                        }}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </p>

                      <p className="muted" style={{ margin: "6px 0 0" }}>
                        {item.is_published && item.published_at
                          ? `Published ${new Date(item.published_at).toLocaleDateString()}`
                          : `Created ${new Date(item.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: "18px" }}>
                    <h3 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>
                      {item.title}
                    </h3>

                    <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
                      {item.summary || "No summary provided."}
                    </p>

                    {item.content ? (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "14px 16px",
                          borderRadius: "14px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 6px",
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          Full Content
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#475569",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.65,
                          }}
                        >
                          {item.content}
                        </p>
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        className="btn-primary"
                        onClick={() => togglePublish(item)}
                        type="button"
                      >
                        {item.is_published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => deleteAnnouncement(item.id)}
                        type="button"
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: "18px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>No announcements yet</h3>
                <p className="muted">Your saved announcements will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: 700,
  color: "#0f172a",
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  background: "#ffffff",
}

const textareaStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  resize: "vertical",
  background: "#ffffff",
}

const deleteButtonStyle = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "12px 18px",
  borderRadius: "999px",
  fontWeight: 700,
  cursor: "pointer",
}
