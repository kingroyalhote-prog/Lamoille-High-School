import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand">
          <Image
            src="/images/lamoille-logo.png"
            alt="Lamoille High School logo"
            width={42}
            height={42}
          />
          <span>Lamoille High School</span>
        </Link>

        <div className="site-nav-links">
          <Link href="/about">About</Link>
          <Link href="/staff-directory">Staff Directory</Link>
          <Link href="/employment">Employment</Link>
          <Link href="/login" className="site-nav-login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
