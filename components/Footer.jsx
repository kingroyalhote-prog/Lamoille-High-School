import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div>
          <p className="section-label section-label--light">Your next chapter starts here</p>
          <h2>Find your place at Lamoille.</h2>
        </div>
        <div className="footer-cta-actions">
          <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer" className="button button--light">Open SIS portal ↗</a>
          <Link href="/employment" className="button button--outline-light">Join our team</Link>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="Lamoille ISD home">
            <Image src="/images/lamoille-logo.png" alt="" width={78} height={78} />
            <span>
              <strong>Lamoille ISD</strong>
              <small>Where ambition meets opportunity</small>
            </span>
          </Link>
          <p>
            A focused virtual school community where students learn, lead,
            compete, and belong.
          </p>
        </div>

        <div className="footer-column">
          <h3>Discover</h3>
          <Link href="/about">About the district</Link>
          <Link href="/clubs">Student clubs</Link>
          <Link href="/announcements">District news</Link>
          <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer">Student SIS portal ↗</a>
        </div>

        <div className="footer-column">
          <h3>Stay connected</h3>
          <Link href="/calendar">Calendar — coming soon</Link>
          <Link href="/announcements">Announcements</Link>
          <Link href="/employment">Careers</Link>
          <Link href="/login">Staff login</Link>
        </div>

        <div className="footer-schedule">
          <span className="footer-live-dot" aria-hidden="true" />
          <div>
            <h3>Weekly sessions</h3>
            <p>Student records, schedules, and resources</p>
            <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer"><strong>Launch SIS portal ↗</strong></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lamoille Independent School District</p>
        <p>Home of Lamoille High School · Built by Josh Productions</p>
      </div>
    </footer>
  )
}
