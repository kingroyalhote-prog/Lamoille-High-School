import Image from "next/image"
import Link from "next/link"
import { supabase } from "../lib/supabase"

export const dynamic = "force-dynamic"

const quickLinks = [
  { title: "SIS student portal", copy: "Grades, schedules, records, and student resources.", href: "https://lamoille-sis.vercel.app/", external: true },
  { title: "Student clubs", copy: "Explore clubs and get involved at Lamoille.", href: "/clubs" },
  { title: "School news", copy: "Read current announcements and updates.", href: "/announcements" },
  { title: "Careers", copy: "View opportunities to join the Lamoille team.", href: "/employment" },
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
            <p className="eyebrow">Lamoille High School</p>
            <h1>Where ambition meets opportunity.</h1>
            <p className="home-hero-lead">
              Home of the Raiders. Find school resources, student programs,
              district news, and SIS access in one place.
            </p>
            <div className="home-hero-actions">
              <a href="https://lamoille-sis.vercel.app/" target="_blank" rel="noreferrer" className="button button--gold">
                Open SIS portal <span aria-hidden="true">↗</span>
              </a>
              <Link href="/about" className="text-link text-link--light">
                About our school <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-links-section" aria-labelledby="quick-links-title">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">Quick links</p>
              <h2 id="quick-links-title">Everything in one place.</h2>
            </div>
            <p>Simple access to the pages students, families, and staff use most.</p>
          </div>
          <div className="quick-link-grid">
            {quickLinks.map((item) => (
              <Link href={item.href} className="quick-link-card" key={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
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
              <p className="section-label">School news</p>
              <h2 id="news-title">Latest from Lamoille.</h2>
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
              <span>Home of the Raiders</span>
            </div>
          </div>
          <div className="story-copy">
            <p className="section-label">Home of the Raiders</p>
            <h2>A school community built to belong.</h2>
            <p>
              Lamoille High School brings academics, student leadership, clubs,
              and community programs together in one connected virtual campus.
            </p>
            <ul className="story-points">
              <li>Student leadership with real responsibility</li>
              <li>Clubs and programs that build belonging</li>
              <li>A connected SIS portal for daily student life</li>
            </ul>
            <Link href="/about" className="button button--navy">Our story <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container home-final-cta-inner">
          <div>
            <p className="section-label section-label--light">Student access</p>
            <h2>Your school information, ready when you need it.</h2>
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
