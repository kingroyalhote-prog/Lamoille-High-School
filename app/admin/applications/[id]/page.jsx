import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export default async function ApplicationDetailPage({ params }) {
  const { id } = params
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single()

  if (applicationError) {
    console.log("Application load error:", applicationError)
  }

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

  const { data: job, error: jobError } = await supabase
    .from("job_postings")
    .select("title, department, location, employment_type")
    .eq("id", application.job_posting_id)
    .single()

  if (jobError) {
    console.log("Job load error:", jobError)
  }

  const { data: answersRaw, error: answersError } = await supabase
    .from("application_answers")
    .select("*")
    .eq("application_id", id)

  if (answersError) {
    console.log("Answers load error:", answersError)
  }

  const questionIds = (answersRaw || []).map((a) => a.question_id)

  let questions = []
  if (questionIds.length) {
    const { data: questionsData, error: questionsError } = await supabase
      .from("application_questions")
      .select("id, label, help_text, is_required, sort_order")
      .in("id", questionIds)

    if (questionsError) {
      console.log("Questions load error:", questionsError)
    }

    questions = questionsData || []
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]))

  const sortedAnswers = (answersRaw || [])
    .map((a) => ({
      ...a,
      question: questionMap.get(a.question_id) || null,
    }))
    .sort((a, b) => {
      const aOrder = a.question?.sort_order ?? 0
      const bOrder = b.question?.sort_order ?? 0
      return aOrder - bOrder
    })

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
              <strong>Position:</strong> {job?.title || "Unknown"}
            </p>

            <p className="muted">
              {[job?.department, job?.location, job?.employment_type]
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
                    {item.question?.label || "Question"}
                    {item.question?.is_required ? " *" : ""}
                  </p>

                  {item.question?.help_text ? (
                    <p className="muted" style={{ marginBottom: "8px" }}>
                      {item.question.help_text}
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
