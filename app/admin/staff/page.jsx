"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminStaffPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [staff, setStaff] = useState([])
  const [photoFile, setPhotoFile] = useState(null)

  const [form, setForm] = useState({
    full_name: "",
    title: "",
    department: "",
    email: "",
    office_location: "",
    bio: "",
    category: "Teachers",
    is_active: true,
    image_url: "",
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

      await loadStaff()
      setLoading(false)
    }

    init()
  }, [router])

  async function loadStaff() {
    const { data, error } = await supabase
      .from("staff_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (!error) {
      setStaff(data || [])
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  async function uploadPhoto(file) {
    if (!file) return null

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `staff/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("staff-photos")
      .upload(filePath, file)

    if (uploadError) {
      console.log(uploadError)
      return null
    }

    const { data } = supabase.storage
      .from("staff-photos")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    let imageUrl = form.image_url || null

    if (photoFile) {
      const uploadedUrl = await uploadPhoto(photoFile)

      if (!uploadedUrl) {
        setMessage("Error uploading photo.")
        setSaving(false)
        return
      }

      imageUrl = uploadedUrl
    }

    const { error } = await supabase.from("staff_members").insert([
      {
        full_name: form.full_name,
        title: form.title,
        department: form.department,
        email: form.email,
        office_location: form.office_location,
        bio: form.bio,
        category: form.category,
        is_active: form.is_active,
        image_url: imageUrl,
      },
    ])

    if (error) {
      console.log(error)
      setMessage("Error adding staff member.")
      setSaving(false)
      return
    }

    setMessage("Staff member added successfully.")
    setForm({
      full_name: "",
      title: "",
      department: "",
      email: "",
      office_location: "",
      bio: "",
      category: "Teachers",
      is_active: true,
      image_url: "",
    })
    setPhotoFile(null)
    await loadStaff()
    setSaving(false)
  }

  async function deleteStaffMember(id) {
    const confirmed = window.confirm("Delete this staff member?")
    if (!confirmed) return

    const { error } = await supabase
      .from("staff_members")
      .delete()
      .eq("id", id)

    if (!error) {
      await loadStaff()
    }
  }

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
    <main className="content">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-label">Admin</p>
              <h1>Manage Staff Directory</h1>
              <p className="muted">
                Add staff, upload photos, assign categories, and control whether they appear publicly.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            <div className="card">
              <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Add Staff Member</h3>

              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />

                <label style={labelStyle}>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />

                <label style={labelStyle}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Administration">Administration</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Support Staff">Support Staff</option>
                </select>

                <label style={labelStyle}>Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>Office Location</label>
                <input
                  name="office_location"
                  value={form.office_location}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <label style={labelStyle}>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  style={textareaStyle}
                />

                <label style={labelStyle}>Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  style={{ marginBottom: "14px" }}
                />

                <label style={labelStyle}>Or Image URL</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  style={inputStyle}
                />

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "18px",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  Show on public directory
                </label>

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Adding..." : "Add Staff Member"}
                </button>
              </form>

              {message && (
                <p className="muted" style={{ marginTop: "14px" }}>
                  {message}
                </p>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Current Staff</h3>

              <div style={{ display: "grid", gap: "14px" }}>
                {staff.length ? (
                  staff.map((person) => (
                    <div
                      key={person.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "14px",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <img
                          src={person.image_url || "/images/lamoille-logo.png"}
                          alt={person.full_name}
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "999px",
                            objectFit: "cover",
                            background: "#e2e8f0",
                          }}
                        />

                        <div>
                          <strong style={{ display: "block" }}>{person.full_name}</strong>
                          <span style={{ color: "#475569", display: "block" }}>
                            {person.title || "Staff Member"}
                          </span>
                          <span style={{ color: "#6366f1", fontSize: "0.9rem" }}>
                            {person.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteStaffMember(person.id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="muted">No staff members yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
}

const inputStyle = {
  width: "100%",
  marginBottom: "14px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
}

const textareaStyle = {
  width: "100%",
  minHeight: "110px",
  marginBottom: "14px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
}

const deleteButtonStyle = {
  border: "none",
  background: "#fee2e2",
  color: "#991b1b",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
}
