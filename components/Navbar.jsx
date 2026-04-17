"use client"

import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        
        {/* Logo + Title */}
        <Link href="/" className="nav-left">
          <Image
            src="/lamoille-logo.png"
            alt="Lamoille High School Logo"
            width={40}
            height={40}
            className="nav-logo"
          />
          <span className="nav-title">Lamoille High School</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/staff-directory">Staff Directory</Link>
          <Link href="/employment">Employment</Link>
          <Link href="/login">Login</Link>
        </nav>

      </div>
    </header>
  )
}
