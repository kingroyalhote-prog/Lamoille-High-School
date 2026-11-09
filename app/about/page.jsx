import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "About",
  description: "Meet the mission, values, and student experience behind Lamoille ISD.",
}

const values = [
  ["01", "Ambition", "We set a high bar and give students the support to clear it."],
  ["02", "Belonging", "Every student deserves to be known, included, and heard."],
  ["03", "Leadership", "Students learn to take initiative and follow through."],
  ["04", "Opportunity", "School should open doors—in the classroom and beyond it."],
]

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero page-hero--about">
        <div className="container page-hero-inner">
          <p className="eyebrow">About Lamoille ISD</p>
          <h1>Small enough to know you. Bold enough to move you forward.</h1>
          <p>
            Lamoille Independent School District is one focused high school
            community built around excellence, leadership, and meaningful opportunity.
          </p>
        </div>
      </section>

      <section className="about-intro-section">
        <div className="container about-intro-grid">
          <div className="about-intro-copy">
            <p className="section-label">Our purpose</p>
            <h2>School should feel personal—and lead somewhere real.</h2>
          </div>
          <div className="about-intro-body">
            <p>
              At Lamoille, strong academics are only the beginning. Students
              build confidence by leading, collaborating, competing, and
              contributing to a community that takes their ideas seriously.
            </p>
            <p>
              Our virtual campus creates room for focused learning and genuine
              connection, with a weekly rhythm that keeps students engaged and moving forward.
            </p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container mission-grid">
          <div className="mission-image">
            <Image src="/images/LHS.png" alt="Lamoille High School campus" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="mission-copy">
            <div>
              <p className="section-label section-label--light">Our mission</p>
              <h2>Prepare every student to lead with purpose.</h2>
              <p>
                We pair academic growth with positive relationships, practical
                skills, and opportunities that help learners discover what they do well.
              </p>
            </div>
            <div className="mission-divider" />
            <div>
              <p className="section-label section-label--light">Our vision</p>
              <h2>A community where potential becomes momentum.</h2>
              <p>
                Every student feels known, challenged, supported, and ready to
                take the next step with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">What guides us</p>
              <h2>Values you can feel.</h2>
            </div>
            <p>These ideas shape how we learn, lead, and show up for one another.</p>
          </div>
          <div className="values-grid">
            {values.map(([number, title, copy]) => (
              <article className="value-card" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pathways-section">
        <div className="container pathways-grid">
          <div>
            <p className="section-label">Beyond the classroom</p>
            <h2>More ways to find what moves you.</h2>
            <p>
              Career and Technical Education pathways—including Health
              Sciences and Culinary Arts—help students build practical skills
              while clubs, service, and leadership turn interests into experience.
            </p>
            <Link href="/clubs" className="button button--navy">Explore student life <span aria-hidden="true">→</span></Link>
          </div>
          <div className="pathway-list">
            <Link href="/clubs"><span>Student clubs</span><strong>Connect & create</strong><i aria-hidden="true">↗</i></Link>
            <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer"><span>SIS portal</span><strong>Student access</strong><i aria-hidden="true">↗</i></a>
            <Link href="/employment"><span>Careers</span><strong>Join the team</strong><i aria-hidden="true">↗</i></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
