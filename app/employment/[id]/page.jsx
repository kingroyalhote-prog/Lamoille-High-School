import { supabase } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function JobDetailPage({ params }) {
  const { id } = params

  // 🔹 Get job
  const { data: job } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .single()

  // 🔴 If job doesn't exist or is not published
  if (!job || !job.is_published) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <h1>Job not available</h1>
            <p className="muted">
              This position is not currently available.
            </p>
          </div>
        </section>
      </main>
    )
  }

  // 🔹 Get questions
  const { data: questions } = await supabase
    .from("application_questions")
    .select("*")
    .eq("job_posting_id", id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  return (
    <main className="content">
      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>

          <p className="section-label">Employment</p>
          <h1>{job.title}</h1>

          <p className="muted" style={{ marginBottom: "10px" }}>
            {job.department} • {job.location} • {job.employment_type}
          </p>

          {job.description && (
            <div className="card" style={{ marginBottom: "24px" }}>
              <p>{job.description}</p>
            </div>
          )}

          {/* 🔴 APPLICATION CLOSED */}
          {!job.applications_open ? (
            <div className="card">
              <h3>Applications are closed</h3>
              <p>Please check back later.</p>
            </div>
          ) : (
            <div className="card">
              <h3>Apply for this position</h3>

              <form
                action="/api/applications"
                method="POST"
                style={{ marginTop: "16px" }}
              >
                <input type="hidden" name="job_posting_id" value={job.id} />

                {/* Basic Info */}
                <input
                  name="name"
                  placeholder="Full Name"
                  required
                  style={inputStyle}
                />

                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  style={inputStyle}
                />

                {/* Dynamic Questions */}
                {questions?.map((q) => (
                  <div key={q.id}>
                    <label style={labelStyle}>
                      {q.question}
                      {q.is_required && " *"}
                    </label>

                    <textarea
                      name={`question_${q.id}`}
                      required={q.is_required}
                      style={textareaStyle}
                    />
                  </div>
                ))}

                <button type="submit" className="btn-primary">
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
}

const textareaStyle = {
  width: "100%",
  minHeight: "110px",
  marginBottom: "14px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
}

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
}
