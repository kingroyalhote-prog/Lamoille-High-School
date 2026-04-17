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
    return <p style={{ padding: "40px" }}>Loading...</p>
  }

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <h1>Manage Announcements</h1>
        <p>Create announcements and choose whether they appear on the homepage.</p>
      </div>

      <div className="info-grid" style={{ alignItems: "start" }}>
        <div className="content-card">
          <h2>Create Announcement</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Summary</label>
              <input
                name="summary"
                value={form.summary}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={6}
                style={textareaStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                Publish immediately
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Announcement"}
            </button>
          </form>

          {message && <p style={{ marginTop: "14px" }}>{message}</p>}
        </div>

        <div className="content-card">
          <h2>Saved Announcements</h2>

          <div style={{ display: "grid", gap: "14px" }}>
            {announcements.length ? (
              announcements.map((item) => (
                <div key={item.id} className="announcement-card" style={{ padding: "18px" }}>
                  <p className="announcement-date">
                    {item.is_published ? "Published" : "Draft"}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.summary || "No summary provided."}</p>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => togglePublish(item)}
                      type="button"
                    >
                      {item.is_published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteAnnouncement(item.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="announcement-card">
                <h3>No announcements yet</h3>
                <p>Your saved announcements will appear here.</p>
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
