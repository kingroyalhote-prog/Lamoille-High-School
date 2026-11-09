"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const navigation = [
  { href: "/about", label: "About" },
  { href: "/clubs", label: "Clubs" },
  { href: "/announcements", label: "News" },
  { href: "/calendar", label: "Calendar", disabled: true },
  { href: "/employment", label: "Careers" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user || null)
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="district-header">
      <div className="district-topbar">
        <Link href="/" className="district-brand" aria-label="Lamoille ISD home">
          <Image
            src="/images/lamoille-logo.png"
            alt=""
            width={70}
            height={70}
            priority
          />
          <div>
            <span className="district-name">Lamoille ISD</span>
            <span className="district-motto">Where ambition meets opportunity</span>
          </div>
        </Link>

        <button
          className="district-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="district-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="district-actions">
          {user ? (
            <>
              <Link href="/admin" className="district-admin-btn">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="district-logout-btn">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="district-login-btn">
              Staff login
            </Link>
          )}
        </div>
      </div>

      <nav
        id="district-navigation"
        className="district-nav"
        data-open={menuOpen ? "true" : "false"}
        aria-label="Primary navigation"
      >
        <div className="district-nav-inner">
          <a
            href="https://lamoille-sis.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="nav-portal"
          >
            SIS Portal <span aria-hidden="true">↗</span>
          </a>
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {item.label}{item.disabled ? <small> Soon</small> : null}
              </Link>
            )
          })}
          <Link href="/employment" className="nav-cta">
            Join our team <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
