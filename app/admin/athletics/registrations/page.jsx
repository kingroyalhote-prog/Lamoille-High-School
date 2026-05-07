import { supabase } from "../../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function AthleticRegistrationsPage() {
  const { data: registrations } = await supabase
    .from("athletic_registrations")
    .select(`
      *,
      athletics (
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Admin</p>

          <h1>Athletic Registrations</h1>

          <p className="muted">
            Review student athletic sign-ups and registration submissions.
          </p>

          <div style={{ marginTop: "30px" }}>
            {registrations?.length ? (
              registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="card"
                  style={{ marginBottom: "18px" }}
                >
                  <h3>
                    {registration.athletics?.name || "Unknown Sport"}
                  </h3>

                  <p>
                    <strong>Roblox Username:</strong>{" "}
                    {registration.roblox_username}
                  </p>

                  <p>
                    <strong>Discord Username:</strong>{" "}
                    {registration.discord_username}
                  </p>

                  <p>
                    <strong>Attendance Agreement:</strong>{" "}
                    {registration.attendance_agreement
                      ? "Confirmed"
                      : "Not Confirmed"}
                  </p>

                  <p className="muted" style={{ marginTop: "10px" }}>
                    Submitted{" "}
                    {new Date(
                      registration.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="card">
                <h3>No Registrations Yet</h3>

                <p>
                  Athletic registrations submitted by students will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
