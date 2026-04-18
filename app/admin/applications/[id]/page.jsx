import { supabase } from "../../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function ApplicationDetailPage({ params }) {
  const { id } = params

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      full_name,
      email,
      discord_username,
      roblox_username,
      status,
      job_posting_id,
      job_postings ( title, department, location, employment_type )
    `)
    .eq("id", id)
    .single()

  if (applicationError) {
    console.log("Application load error:", applicationError)
  }

  const { data: answers, error: answersError } = await supabase
    .from("application_answers")
    .select(`
      id,
      answer,
      question_id,
      application_questions (
        id,
        label,
        help_text,
        is_required,
        sort_order
      )
    `)
    .eq("application_id", id)

  if (answersError) {
    console.log("Answers load error:", answersError)
  }

  const sortedAnswers =
    answers?.sort((a, b) => {
      const aOrder = a.application_questions?.sort_order ?? 0
      const bOrder = b.application_questions?.sort_order ?? 0
      return aOrder - bOrder
    }) || []

  if (!application) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Application not found</h1>
            <p className="muted">This application could not be loaded.</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="content">
      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <p className="section-label">Admin</p>
          <h1>{application.full_name || "Applicant"}</h1>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Application Details</h3>

            <p>
              <strong>Email:</strong> {application.email || "Not provided"}
            </p>

            <p>
              <strong>Discord Username:</strong>{" "}
              {application.discord_username || "Not provided"}
            </p>

            <p>
              <strong>Roblox Username:</strong>{" "}
              {application.roblox_username || "Not provided"}
            </p>

            <p>
              <strong>Status:</strong> {application.status || "pending"}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {application.created_at
                ? new Date(application.created_at).toLocaleString()
                : "Unknown"}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {application.job_postings?.title || "Unknown"}
            </p>

            <p className="muted">
              {[
                application.job_postings?.department,
                application.job_postings?.location,
                application.job_postings?.employment_type,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Question Responses</h3>

            {sortedAnswers.length ? (
              sortedAnswers.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ fontWeight: 700, marginBottom: "6px" }}>
                    {item.application_questions?.label || "Question"}
                    {item.application_questions?.is_required ? " *" : ""}
                  </p>

                  {item.application_questions?.help_text ? (
                    <p className="muted" style={{ marginBottom: "8px" }}>
                      {item.application_questions.help_text}
                    </p>
                  ) : null}

                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {item.answer || "No response provided"}
                  </p>
                </div>
              ))
            ) : (
              <p className="muted">No answers found for this application.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
