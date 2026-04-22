import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  return d
}

function addWeeks(dateStr, weeks) {
  return addDays(dateStr, weeks * 7)
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr + "T00:00:00")
  d.setMonth(d.getMonth() + months)
  return d
}

function toDateInputString(date) {
  return date.toISOString().split("T")[0]
}

function expandRecurringEvents(events) {
  const today = new Date()
  const rangeStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const rangeEnd = new Date(today.getFullYear(), today.getMonth() + 3, 0)

  const expanded = []

  for (const event of events || []) {
    if (event.recurrence_type === "none") {
      expanded.push({
        ...event,
        occurrence_date: event.start_date,
      })
      continue
    }

    let currentDate = event.start_date
    const recurrenceEnd = event.recurrence_end_date || toDateInputString(rangeEnd)
    const interval = Math.max(Number(event.recurrence_interval) || 1, 1)

    while (currentDate <= recurrenceEnd) {
      const currentJsDate = new Date(currentDate + "T00:00:00")

      if (currentJsDate >= rangeStart && currentJsDate <= rangeEnd) {
        expanded.push({
          ...event,
          occurrence_date: currentDate,
        })
      }

      if (event.recurrence_type === "daily") {
        currentDate = toDateInputString(addDays(currentDate, interval))
      } else if (event.recurrence_type === "weekly") {
        currentDate = toDateInputString(addWeeks(currentDate, interval))
      } else if (event.recurrence_type === "monthly") {
        currentDate = toDateInputString(addMonths(currentDate, interval))
      } else {
        break
      }
    }
  }

  return expanded.sort((a, b) => {
    const dateCompare = a.occurrence_date.localeCompare(b.occurrence_date)
    if (dateCompare !== 0) return dateCompare
    return (a.start_time || "").localeCompare(b.start_time || "")
  })
}

function formatEventDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function groupByDate(events) {
  return events.reduce((acc, event) => {
    const key = event.occurrence_date
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})
}

export default async function CalendarPage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true })

  if (error) {
    console.log("Calendar query error:", error)
  }

  const expandedEvents = expandRecurringEvents(events || [])
  const groupedEvents = groupByDate(expandedEvents)
  const groupedEntries = Object.entries(groupedEvents)

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">School Calendar</p>
          <h1>Upcoming Events</h1>
          <p className="muted" style={{ marginBottom: "24px" }}>
            Stay up to date with upcoming school events, activities, and important dates.
          </p>

          {groupedEntries.length ? (
            <div style={{ display: "grid", gap: "20px" }}>
              {groupedEntries.map(([date, items]) => (
                <div key={date} className="card">
                  <h2 style={{ marginTop: 0, marginBottom: "16px" }}>
                    {formatEventDate(date)}
                  </h2>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {items.map((event) => (
                      <div
                        key={`${event.id}-${event.occurrence_date}`}
                        style={{
                          padding: "16px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "16px",
                          background: "#fff",
                        }}
                      >
                        <h3 style={{ margin: "0 0 8px" }}>{event.title}</h3>

                        <p className="muted" style={{ margin: "0 0 8px" }}>
                          {event.is_all_day
                            ? "All Day"
                            : `${event.start_time || ""}${event.end_time ? ` – ${event.end_time}` : ""}`}
                          {event.location ? ` • ${event.location}` : ""}
                        </p>

                        {event.description ? (
                          <p style={{ margin: 0 }}>{event.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <h3>No events yet</h3>
              <p>Events will appear here once added.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
