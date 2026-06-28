"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
 <header className="district-header">
      <div className="district-topbar">
        <Link href="/" className="district-brand">
          <Image
            src="/images/lamoille-logo.png"
            alt="Lamoille High School"
            width={64}
            height={64}
          />

          <div>
            <h1>Lamoille High School</h1>
            <p>Where Ambition Meets Opportunity</p>
          </div>
        </Link>

        <div className="district-actions">
          {user ? (
            <>
              <Link href="/admin" className="district-admin-btn">
                Admin Dashboard
              </Link>

              <button onClick={handleLogout} className="district-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="district-login-btn">
              Login
            </Link>
          )}
        </div>
      </div>

      <nav className="district-nav">
        <Link href="/about">About</Link>
        <Link href="/employment">Employment</Link>
        <Link href="/clubs">Clubs</Link>
        <Link href="/athletics">Athletics</Link>
        <Link href="/calendar">Calendar</Link>
      </nav>
    </header>
  )
}
