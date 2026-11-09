import Link from "next/link"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "School Board",
  description:
    "Meet the Lamoille ISD school board and find meeting information and board announcements.",
}

function formatDate(value) {
  if (!value) return "Recently posted"

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function isMeetingNotice(title = "") {
  const normalized = title.toLowerCase()
  return normalized.includes("next board meeting") || normalized.includes("school board meeting")
}

function isBoardNotice(title = "") {
  const normalized = title.toLowerCase()
  return (
    normalized.startsWith("school board:") ||
    normalized.startsWith("board:") ||
    isMeetingNotice(normalized)
  )
}

function displayTitle(title = "School Board Update") {
  return title.replace(/^(school board|board):\s*/i, "")
}

export default async function SchoolBoardPage() {
  const [{ data: members }, { data: announcements }] = await Promise.all([
    supabase
      .from("leadership_members")
      .select("id, roleplay_name, title, image_url, fun_fact, display_order")
      .eq("leader_type", "board")
      .eq("is_published", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("announcements")
      .select("id, title, summary, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(30),
  ])

  const boardNotices = (announcements || []).filter((item) =>
    isBoardNotice(item.title)
  )
  const meetingNotice = boardNotices.find((item) =>
    isMeetingNotice(item.title)
  )

  return (
    <main>
      <section className="page-hero page-hero--board">
        <div className="container page-hero-inner">
          <p className="eyebrow">District governance</p>
          <h1>School Board</h1>
          <p>
            Meet the people who help guide Lamoille ISD and stay informed about
            upcoming meetings and board updates.
          </p>
        </div>
      </section>

      <section className="board-overview-section">
        <div className="container board-overview-grid">
          <div className="board-intro">
            <p className="section-label">Serving Lamoille</p>
            <h2>Leadership rooted in our school community.</h2>
            <p>
              The Lamoille ISD School Board supports the district’s direction,
              priorities, and commitment to student opportunity.
            </p>
          </div>

          <aside className="board-meeting-card" aria-labelledby="next-meeting-title">
            <p className="board-meeting-label">Next board meeting</p>
            <h2 id="next-meeting-title">
              {meetingNotice ? displayTitle(meetingNotice.title) : "Date and time to be announced"}
            </h2>
            <p>
              {meetingNotice?.summary ||
                "Meeting details will be posted here as soon as they are confirmed."}
            </p>
            {meetingNotice?.published_at ? (
              <small>Updated {formatDate(meetingNotice.published_at)}</small>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="board-members-section" aria-labelledby="board-members-title">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">Our board</p>
              <h2 id="board-members-title">Current school board members.</h2>
            </div>
            <p>Meet the board members currently serving the Lamoille community.</p>
          </div>

          {members?.length ? (
            <div className="board-member-grid">
              {members.map((member) => (
                <article className="board-member-card" key={member.id}>
                  <div className="board-member-photo">
                    <img
                      src={member.image_url || "/images/lamoille-logo.png"}
                      alt={member.image_url ? `${member.roleplay_name} portrait` : "Lamoille ISD logo"}
                      className={member.image_url ? undefined : "is-placeholder"}
                    />
                  </div>
                  <div className="board-member-copy">
                    <p>{member.title || "School Board Member"}</p>
                    <h3>{member.roleplay_name}</h3>
                    {member.fun_fact ? <span>{member.fun_fact}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="board-empty-state">
              <img src="/images/lamoille-logo.png" alt="" />
              <div>
                <h3>Board roster coming soon.</h3>
                <p>Current member names and photos will be published here.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="board-announcements-section" aria-labelledby="board-announcements-title">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-label">Board updates</p>
              <h2 id="board-announcements-title">School board announcements.</h2>
            </div>
            <Link href="/announcements" className="text-link">
              All school news <span aria-hidden="true">→</span>
            </Link>
          </div>

          {boardNotices.length ? (
            <div className="board-announcement-list">
              {boardNotices.map((item) => (
                <article className="board-announcement-card" key={item.id}>
                  <div>
                    <span>{isMeetingNotice(item.title) ? "Meeting update" : "Board announcement"}</span>
                    <time>{formatDate(item.published_at)}</time>
                  </div>
                  <h3>{displayTitle(item.title)}</h3>
                  <p>{item.summary || "More information will be shared soon."}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="board-empty-state board-empty-state--light">
              <div>
                <h3>No board announcements have been posted.</h3>
                <p>New meeting notices and board updates will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
