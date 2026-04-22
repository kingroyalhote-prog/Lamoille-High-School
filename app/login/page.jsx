"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    const user = data.user

    // 🔒 check role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError || !profile) {
      setMessage("Access denied.")
      await supabase.auth.signOut()
      return
    }

    if (profile.role === "staff_admin" || profile.role === "master_admin") {
      // OPTIONAL: if not "remember me", clear session on tab close
      if (!remember) {
        // this makes session behave more like "temporary"
        window.addEventListener("beforeunload", async () => {
          await supabase.auth.signOut()
        })
      }

      window.location.href = "/admin"
    } else {
      setMessage("You do not have admin access.")
      await supabase.auth.signOut()
    }
  }

  return (
    <main className="page-shell">
      <div className="content-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
          />

          {/* ✅ KEEP ME SIGNED IN */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              fontSize: "14px",
              color: "#334155",
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Keep me signed in
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Login
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", color: "red" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
