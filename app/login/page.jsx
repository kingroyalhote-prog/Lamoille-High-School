"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setMessage("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (!remember) {
      window.addEventListener("beforeunload", async () => supabase.auth.signOut())
    }

    window.location.href = "/admin"
  }

  return (
    <main className="login-page">
      <section className="login-panel login-panel--brand">
        <div className="login-brand-mark">
          <Image src="/images/lamoille-logo.png" alt="" width={84} height={84} />
          <span>Lamoille ISD</span>
        </div>
        <div>
          <p className="eyebrow">Staff portal</p>
          <h1>The work behind a great student experience starts here.</h1>
          <p>Manage district news, programs, events, applications, and community information.</p>
        </div>
        <Link href="/">← Return to the district site</Link>
      </section>

      <section className="login-panel login-panel--form">
        <form className="login-form" onSubmit={handleLogin}>
          <p className="section-label">Authorized staff</p>
          <h2>Welcome back.</h2>
          <p>Sign in with your Lamoille administrator account.</p>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@lamoilleisd.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((value) => !value)}
            />
            Keep me signed in
          </label>

          {message && <p className="form-error" role="alert">{message}</p>}

          <button type="submit" className="button button--navy" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  )
}
