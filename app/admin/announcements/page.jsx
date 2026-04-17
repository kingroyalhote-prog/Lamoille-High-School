import { supabase } from "../../../lib/supabase"

export default async function AdminAnnouncementsPage() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, summary, is_published, published_at, created_at")
    .order("created_at", { ascending: false })

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Dashboard</p>
        <h1>Manage Announcements</h1>
        <p>Create, review, and publish announcements for the homepage.</p>
      </section>

      <main className="page-shell">
        <div className="content-card" style={{ marginBottom: "24px" }}>
          <h2>New announcement form coming next</h2>
          <p>
            This page is now connected to Supabase and showing saved announcements.
            Next we’ll add the form to create and publish them.
          </p>
        </div>

        <div className="announcement-grid">
          {announcements?.length ? (
            announcements.map((item) => (
              <article key={item.id} className="announcement-card">
                <p className="announcement-date">
                  {item.published_at
                    ? `Published ${new Date(item.published_at).toLocaleDateString()}`
                    : "Not published"}
                </p>
                <h3>{item.title}</h3>
                <p>{item.summary || "No summary provided."}</p>
                <p className="meta-text">
                  Status: {item.is_published ? "Published" : "Draft"}
                </p>
              </article>
            ))
          ) : (
            <article className="announcement-card empty-card">
              <h3>No announcements yet</h3>
              <p>Your saved announcements will appear here.</p>
            </article>
          )}
        </div>
      </main>
    </>
  )
}
