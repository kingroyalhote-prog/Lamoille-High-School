import { supabase } from "../../../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function ApplicationDetail({ params }) {
  const { id } = params

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single()

  const { data: answers } = await supabase
    .from("application_answers")
    .select(`
      id,
      answer,
      application_questions ( question )
    `)
    .eq("application_id", id)

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <h1>{application.full_name}</h1>
          <p className="muted">{application.email}</p>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Application Answers</h3>

            {answers?.length ? (
              answers.map((a) => (
                <div key={a.id} style={{ marginBottom: "12px" }}>
                  <strong>{a.application_questions?.question}</strong>
                  <p>{a.answer}</p>
                </div>
              ))
            ) : (
              <p>No answers submitted.</p>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
