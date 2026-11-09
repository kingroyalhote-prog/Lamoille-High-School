export const dynamic = "force-dynamic"

export const metadata = {
  title: "Careers",
  description: "Join the team shaping the student experience at Lamoille High School.",
}

const reasons = [
  ["Purpose that shows", "Make a visible difference in a growing student community."],
  ["Room to lead", "Bring ideas, take ownership, and help shape what comes next."],
  ["A team that cares", "Work alongside people who take students—and each other—seriously."],
]

export default function EmploymentPage() {
  return (
    <main>
      <section className="page-hero page-hero--careers">
        <div className="container page-hero-inner">
          <p className="eyebrow">Careers at Lamoille</p>
          <h1>Do work that helps students become more.</h1>
          <p>
            Join a collaborative team creating an ambitious, welcoming, and
            memorable school experience for every learner.
          </p>
          <a href="#apply" className="button button--gold">Start your application <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="career-reasons-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">Why Lamoille</p>
              <h2>Bring your strengths. Build something meaningful.</h2>
            </div>
            <p>We’re looking for dependable, creative people who care about student growth.</p>
          </div>
          <div className="career-reasons-grid">
            {reasons.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="application-section" id="apply">
        <div className="container application-layout">
          <aside className="application-sidebar">
            <p className="section-label section-label--light">Apply now</p>
            <h2>Ready to make an impact?</h2>
            <p>Complete the application and our leadership team will review your submission.</p>
            <ol>
              <li><span>1</span> Tell us about yourself</li>
              <li><span>2</span> Share your experience</li>
              <li><span>3</span> Submit for review</li>
            </ol>
            <small>Applications are reviewed by Lamoille ISD leadership.</small>
          </aside>
          <div className="application-form-card">
            <iframe
              title="Lamoille High School employment application"
              src="https://docs.google.com/forms/d/e/1FAIpQLSccCZgXiBrMM0uMAm4isK7uXSq2fQIu9tOICO6eLkJsDZKgqQ/viewform?embedded=true"
              width="100%"
              height="1182"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading application…
            </iframe>
          </div>
        </div>
      </section>
    </main>
  )
}
