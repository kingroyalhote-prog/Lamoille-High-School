import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Announcements",
  description: "The latest news and updates from Lamoille ISD.",
}

function formatDate(value) {
  if (!value) return "Recently posted"
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function AnnouncementsPage() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, summary, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  return (
    <main>
      <section className="page-hero page-hero--news">
        <div className="container page-hero-inner">
          <p className="eyebrow">District pulse</p>
          <h1>What’s happening at Lamoille.</h1>
          <p>Updates, opportunities, and important news from across our community.</p>
        </div>
      </section>

      <section className="announcement-list-section">
        <div className="container announcement-list">
          {announcements?.length ? announcements.map((item, index) => (
            <article className="announcement-row" key={item.id}>
              <div className="announcement-index">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <time>{formatDate(item.published_at)}</time>
                <h2>{item.title}</h2>
                <p>{item.summary || "More information will be shared soon."}</p>
              </div>
            </article>
          )) : (
            <div className="empty-state">
              <p className="section-label">Check back soon</p>
              <h2>No announcements have been published yet.</h2>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
