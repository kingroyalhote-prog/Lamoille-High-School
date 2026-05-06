"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // get current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">

        {/* LOGO */}
        <Link href="/" className="site-brand">
          <Image
            src="/images/lamoille-logo.png"
            alt="Lamoille High School logo"
            width={42}
            height={42}
          />
          <span>Lamoille High School</span>
        </Link>

        {/* LINKS */}
        <div className="site-nav-links">
          <Link href="/about">About</Link>
          <Link href="/employment">Employment</Link>
          <Link href="/clubs">Clubs</Link>
          <Link href="/calendar">Calendar</Link>

          {user ? (
            <>
              <Link href="/admin" className="site-nav-admin">
                Admin
              </Link>

              <button onClick={handleLogout} className="site-nav-logout">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="site-nav-login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
