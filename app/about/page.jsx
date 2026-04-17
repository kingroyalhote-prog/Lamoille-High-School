export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>About Lamoille</h1>
        <p>
          Lamoille High School is committed to academic achievement, leadership,
          and a strong sense of community for every student.
        </p>
      </section>

      <main className="page-shell">
        <div className="info-grid">
          <div className="content-card">
            <h2>Our Mission</h2>
            <p>
              We prepare students for future success through strong academics,
              positive relationships, and meaningful opportunities.
            </p>
          </div>

          <div className="content-card">
            <h2>Our Community</h2>
            <p>
              Families, staff, and students work together to build a safe,
              supportive, and ambitious school environment.
            </p>
          </div>

          <div className="content-card">
            <h2>Student Growth</h2>
            <p>
              We believe in helping students grow as learners, leaders, and
              active members of their communities.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
