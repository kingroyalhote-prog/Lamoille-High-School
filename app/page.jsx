export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>About Lamoille</h1>
        <p>
          Lamoille High School is committed to academic excellence,
          leadership, and a strong community.
        </p>
      </section>

      <main className="page-shell">
        <div className="info-grid">
          <div className="content-card">
            <h2>Our Mission</h2>
            <p>
              We support student growth through academics, leadership,
              and community.
            </p>
          </div>

          <div className="content-card">
            <h2>Our Community</h2>
            <p>
              Families, staff, and students work together to build a safe,
              successful environment.
            </p>
          </div>

          <div className="content-card">
            <h2>Student Success</h2>
            <p>
              We prepare students for college, careers, and responsible citizenship.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
