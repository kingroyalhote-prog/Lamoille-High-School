import Image from "next/image"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export const dynamic = "force-dynamic"

const quickLinks = [
  { number: "01", title: "SIS student portal", copy: "Access student records, schedules, and school resources.", href: "https://lamoille-sis.vercel.app/", external: true },
  { number: "02", title: "Student clubs", copy: "Find people who share your interests.", href: "/clubs" },
  { number: "03", title: "District news", copy: "Read the latest updates from Lamoille ISD.", href: "/announcements" },
  { number: "04", title: "Careers", copy: "Help build an exceptional student experience.", href: "/employment" },
]

function formatDate(value) {
  if (!value) return "Recently posted"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function Home() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, summary, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-image" aria-hidden="true" />
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Lamoille Independent School District</p>
            <h1>
              Start here.
              <span>Go anywhere.</span>
            </h1>
            <p className="home-hero-lead">
              A student-first virtual school community where ambition turns
              into action—and every learner has room to lead.
            </p>
            <div className="home-hero-actions">
              <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer" className="button button--gold">
                Open SIS portal <span aria-hidden="true">↗</span>
              </a>
              <Link href="/about" className="text-link text-link--light">
                Discover Lamoille <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="home-stat-row" aria-label="District highlights">
              <div><strong>3</strong><span>weekly sessions</span></div>
              <div><strong>1</strong><span>unified campus</span></div>
              <div><strong>∞</strong><span>ways to grow</span></div>
            </div>
          </div>

          <aside className="home-week-card">
            <div className="week-card-topline">
              <span><i aria-hidden="true" /> Campus schedule</span>
              <strong>ET</strong>
            </div>
            <p className="week-card-kicker">One portal. Everything you need.</p>
            <h2>Your Lamoille school day starts in SIS.</h2>
            <div className="week-days" aria-label="SIS portal features">
              <span>GRADES</span><span>INFO</span><span>TOOLS</span>
            </div>
            <div className="week-time">
              <span>Student access</span>
              <strong>24 / 7</strong>
            </div>
            <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer">Launch the SIS portal <span aria-hidden="true">↗</span></a>
          </aside>
        </div>
      </section>

      <section className="quick-links-section" aria-labelledby="quick-links-title">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">Find your next move</p>
              <h2 id="quick-links-title">Everything you need, one click away.</h2>
            </div>
            <p>Explore the people, programs, and moments that make Lamoille feel like home.</p>
          </div>
          <div className="quick-link-grid">
            {quickLinks.map((item) => (
              <Link href={item.href} className="quick-link-card" key={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
                <span className="quick-link-number">{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
                <span className="quick-link-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="news-section" aria-labelledby="news-title">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">District pulse</p>
              <h2 id="news-title">News worth knowing.</h2>
            </div>
            <Link href="/announcements" className="text-link">All announcements <span aria-hidden="true">→</span></Link>
          </div>

          <div className="news-grid">
            {announcements?.length ? (
              announcements.map((item, index) => (
                <article className={`news-card${index === 0 ? " news-card--featured" : ""}`} key={item.id}>
                  <div className="news-card-meta">
                    <span>{index === 0 ? "Featured" : "District update"}</span>
                    <time>{formatDate(item.published_at)}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary || "More details will be shared soon."}</p>
                </article>
              ))
            ) : (
              <article className="news-card news-card--featured">
                <div className="news-card-meta"><span>District update</span></div>
                <h3>New announcements are on the way.</h3>
                <p>Check back soon for the latest from Lamoille ISD.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="container story-grid">
          <div className="story-image-wrap">
            <Image
              src="/images/LHS.png"
              alt="The Lamoille High School virtual campus courtyard"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <div className="story-image-stamp">
              <strong>LHS</strong>
              <span>Home of the Patriots</span>
            </div>
          </div>
          <div className="story-copy">
            <p className="section-label">One school. One community.</p>
            <h2>Built for students who want more from school.</h2>
            <p>
              Lamoille combines ambitious academics with real leadership,
              spirited competition, and a community that notices when you show
              up. Here, students do more than attend—they help shape what comes next.
            </p>
            <ul className="story-points">
              <li><span>01</span> Student leadership with real responsibility</li>
              <li><span>02</span> Clubs and programs that build belonging</li>
              <li><span>03</span> A connected SIS portal for daily student life</li>
            </ul>
            <Link href="/about" className="button button--navy">Our story <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container home-final-cta-inner">
          <div>
            <p className="section-label section-label--light">Make your mark</p>
            <h2>Your future looks good from here.</h2>
          </div>
          <div>
            <p>Grades, schedules, resources, and student information are always within reach.</p>
            <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer" className="button button--gold">Go to SIS portal <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
  )
}
