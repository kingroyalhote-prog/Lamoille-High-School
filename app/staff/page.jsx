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
    phone: "",
    office_location: "",
    bio: "",
    is_active: true,
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

  const loadStaff = async () => {
    const { data, error } = await supabase
      .from("staff_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (!error) {
      setStaff(data || [])
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setPhotoFile(file || null)
  }

  const uploadPhoto = async () => {
    if (!photoFile) return null

    const fileExt = photoFile.name.split(".").pop()
    const safeName = form.full_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")

    const filePath = `${safeName || "staff"}-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from("staff-photos")
      .upload(filePath, photoFile, {
        upsert: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from("staff-photos")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      let image_url = null

      if (photoFile) {
        image_url = await uploadPhoto()
      }

      const payload = {
        ...form,
        image_url,
        display_order: 0,
      }

      const { error } = await supabase.from("staff_members").insert([payload])

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Staff member added successfully.")
        setForm({
          full_name: "",
          title: "",
          department: "",
          email: "",
          phone: "",
          office_location: "",
          bio: "",
          is_active: true,
        })
        setPhotoFile(null)
        await loadStaff()
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong uploading the photo.")
    }

    setSaving(false)
  }

  const toggleActive = async (person) => {
    const { error } = await supabase
      .from("staff_members")
      .update({ is_active: !person.is_active })
      .eq("id", person.id)

    if (!error) {
      await loadStaff()
    }
  }

  const deleteStaff = async (person) => {
    const confirmed = window.confirm("Delete this staff member?")
    if (!confirmed) return

    const { error } = await supabase
      .from("staff_members")
      .delete()
      .eq("id", person.id)

    if (!error) {
      await loadStaff()
    }
  }

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading...</p>
  }

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <h1>Manage Staff Directory</h1>
        <p>Add staff, upload photos, and control whether they appear publicly.</p>
      </div>

      <div className="info-grid" style={{ alignItems: "start" }}>
        <div className="content-card">
          <h2>Add Staff Member</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label>Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

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
              <label>Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Office Location</label>
              <input
                name="office_location"
                value={form.office_location}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                style={textareaStyle}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "block", marginTop: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Show on public directory
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Add Staff Member"}
            </button>
          </form>

          {message && <p style={{ marginTop: "14px" }}>{message}</p>}
        </div>

        <div className="content-card">
          <h2>Current Staff</h2>

          <div style={{ display: "grid", gap: "14px" }}>
            {staff.length ? (
              staff.map((person) => (
                <div key={person.id} className="announcement-card" style={{ padding: "18px" }}>
                  <p className="announcement-date">
                    {person.is_active ? "Visible" : "Hidden"}
                  </p>
                  <h3>{person.full_name}</h3>
                  <p>{person.title}</p>
                  <p>{person.department || "No department listed"}</p>
                  <p>{person.email || "No email listed"}</p>

                  {person.image_url ? (
                    <img
                      src={person.image_url}
                      alt={person.full_name}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "999px",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  ) : null}

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => toggleActive(person)}
                    >
                      {person.is_active ? "Hide" : "Show"}
                    </button>

                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => deleteStaff(person)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="announcement-card">
                <h3>No staff yet</h3>
                <p>Your saved staff members will appear here.</p>
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
