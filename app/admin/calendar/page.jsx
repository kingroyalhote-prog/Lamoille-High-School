"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminCalendarPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [events, setEvents] = useState([])
  const [editingId, setEditingId] = useState(null)

  const emptyForm = {
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    is_all_day: false,
    recurrence_type: "none",
    recurrence_interval: 1,
    recurrence_end_date: "",
  }

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      await loadEvents()
      setLoading(false)
    }

    init()
  }, [router])

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })

    if (!error) {
      setEvents(data || [])
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setMessage("")
  }

  function startEdit(event) {
    setEditingId(event.id)
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      is_all_day: !!event.is_all_day,
      recurrence_type: event.recurrence_type || "none",
      recurrence_interval: event.recurrence_interval || 1,
      recurrence_end_date: event.recurrence_end_date || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const payload = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      start_time: form.is_all_day ? null : form.start_time || null,
      end_time: form.is_all_day ? null : form.end_time || null,
      is_all_day: form.is_all_day,
      recurrence_type: form.recurrence_type,
      recurrence_interval: Number(form.recurrence_interval) || 1,
      recurrence_end_date:
        form.recurrence_type === "none" ? null : form.recurrence_end_date || null,
    }

    let error = null

    if (editingId) {
      const result = await supabase
        .from("events")
        .update(payload)
        .eq("id", editingId)

      error = result.error
    } else {
      const result = await supabase.from("events").insert([payload])
      error = result.error
    }

    if (error) {
      setMessage(error.message || "Could not save event.")
    } else {
      setMessage(editingId ? "Event updated." : "Event created.")
      resetForm()
      await loadEvents()
    }

    setSaving(false)
  }

  async function deleteEvent(id) {
    const confirmed = window.confirm("Delete this event?")
    if (!confirmed) return

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (!error) {
      if (editingId === id) resetForm()
      await loadEvents()
    }
  }

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateCompare = (a.start_date || "").localeCompare(b.start_date || "")
      if (dateCompare !== 0) return dateCompare
      return (a.start_time || "").localeCompare(b.start_time || "")
    })
  }, [events])

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading...</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <p className="section-label">Admin</p>
        <h1 style={{ marginBottom: "8px" }}>Manage Calendar</h1>
        <p className="muted">
          Add, edit, delete, and schedule recurring school events.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 430px) minmax(0, 1fr)",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div className="content-card" style={{ position: "sticky", top: "100px" }}>
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Event" : "Create Event"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={textareaStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  name="is_all_day"
                  checked={form.is_all_day}
                  onChange={handleChange}
                />
                All Day Event
              </label>
            </div>

            {!form.is_all_day && (
              <>
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Recurrence</label>
              <select
                name="recurrence_type"
                value={form.recurrence_type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="none">Does Not Repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {form.recurrence_type !== "none" && (
              <>
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Repeat Every</label>
                  <input
                    type="number"
                    min="1"
                    name="recurrence_interval"
                    value={form.recurrence_interval}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Repeat Until</label>
                  <input
                    type="date"
                    name="recurrence_end_date"
                    value={form.recurrence_end_date}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  style={secondaryButtonStyle}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {message ? (
            <p className="muted" style={{ marginTop: "14px" }}>
              {message}
            </p>
          ) : null}
        </div>

        <div className="content-card">
          <h2 style={{ marginTop: 0 }}>Saved Events</h2>

          <div style={{ display: "grid", gap: "14px" }}>
            {sortedEvents.length ? (
              sortedEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "linear-gradient(180deg, #ffffff, #f8fafc)",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px" }}>{event.title}</h3>

                  <p className="muted" style={{ margin: "0 0 8px" }}>
                    {event.start_date}
                    {event.start_time ? ` • ${event.start_time}` : ""}
                    {event.end_time ? ` – ${event.end_time}` : ""}
                    {event.location ? ` • ${event.location}` : ""}
                  </p>

                  {event.description ? (
                    <p style={{ marginTop: 0 }}>{event.description}</p>
                  ) : null}

                  <p className="muted" style={{ marginTop: "8px" }}>
                    {event.recurrence_type === "none"
                      ? "Does not repeat"
                      : `Repeats ${event.recurrence_type} every ${event.recurrence_interval}`}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => startEdit(event)}
                      className="btn-primary"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteEvent(event.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No events yet</h3>
                <p>Calendar events will appear here once added.</p>
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
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  background: "#ffffff",
}

const textareaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  resize: "vertical",
  background: "#ffffff",
}

const secondaryButtonStyle = {
  border: "none",
  background: "#e2e8f0",
  color: "#0f172a",
  padding: "12px 18px",
  borderRadius: "999px",
  fontWeight: 700,
  cursor: "pointer",
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
