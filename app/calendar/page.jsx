import Link from "next/link"

export const metadata = {
  title: "Calendar Coming Soon",
  description: "The Lamoille ISD calendar is temporarily unavailable while it is being updated.",
}

export default function CalendarPage() {
  return (
    <main className="calendar-disabled-page">
      <section className="calendar-disabled-card">
        <p className="eyebrow">District calendar</p>
        <span className="calendar-status">Temporarily offline</span>
        <h1>A better calendar is on the way.</h1>
        <p>
          We’re refreshing the district calendar experience. In the meantime,
          students can use the SIS portal for the information and resources they need.
        </p>
        <div>
          <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer" className="button button--gold">
            Open SIS portal <span aria-hidden="true">↗</span>
          </a>
          <Link href="/" className="text-link text-link--light">Return home <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  )
}
