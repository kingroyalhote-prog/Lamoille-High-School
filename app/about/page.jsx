export default function AboutPage() {
  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <div
            style={{
              background:
                "linear-gradient(135deg, #06101f, #0b1f3f, #0f3d46)",
              color: "white",
              padding: "52px",
              borderRadius: "28px",
              marginBottom: "36px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            }}
          >
            <p
              style={{
                textTransform: "uppercase",
                fontWeight: 800,
                letterSpacing: "0.08em",
                opacity: 0.82,
                margin: "0 0 10px",
              }}
            >
              About Lamoille ISD
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              Where Ambition Meets Opportunity
            </h1>

            <p
              style={{
                maxWidth: "780px",
                margin: "22px 0 0",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                opacity: 0.92,
              }}
            >
              Lamoille Independent School District is built around Lamoille High
              School, a focused learning community where students are encouraged
              to grow through academics, leadership, student life, athletics,
              and meaningful school involvement.
            </p>
          </div>

          <div className="card-grid">
            <div className="card">
              <p className="section-label">Mission</p>
              <h2>Preparing students for what comes next.</h2>
              <p>
                Lamoille ISD supports students through strong academics,
                positive relationships, leadership development, and
                opportunities that help every learner build confidence and
                purpose.
              </p>
            </div>

            <div className="card">
              <p className="section-label">Vision</p>
              <h2>A connected school community.</h2>
              <p>
                Our vision is to create a district where students feel known,
                supported, challenged, and inspired to reach their goals inside
                and outside the classroom.
              </p>
            </div>
          </div>

          <div
            className="card"
            style={{
              marginTop: "30px",
            }}
          >
            <p className="section-label">Lamoille High School</p>
            <h2>One district, one campus, one shared standard.</h2>
            <p>
              Lamoille High School is the heart of Lamoille ISD. Students,
              staff, and families work together to create a positive school
              culture built on responsibility, participation, and community
              pride.
            </p>
          </div>

          <div
            className="card"
            style={{
              marginTop: "24px",
            }}
          >
            <p className="section-label">Student Experience</p>
            <h2>Growth beyond the classroom.</h2>
            <p>
              Students are encouraged to take part in clubs, athletics, events,
              and leadership opportunities that help them build relationships,
              discover interests, and prepare for future success.
            </p>
          </div>
<div
  className="card"
  style={{
    marginTop: "24px",
  }}
>
  <p className="section-label">Career & Technical Education</p>
  <h2>Hands-on pathways for real-world skills.</h2>
  <p>
    Lamoille ISD offers Career and Technical Education opportunities that help
    students explore future careers while building practical skills. Programs
    such as Health Sciences and Culinary Arts give students meaningful ways to
    learn, practice, and prepare for life after high school.
  </p>
</div>
          <div
            className="card"
            style={{
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <p className="section-label">Leadership</p>
                <h2 style={{ margin: 0 }}>Meet Our Leadership Team</h2>
              </div>

              <span
                style={{
                  background: "#e2e8f0",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Coming Soon
              </span>
            </div>

            <p style={{ marginTop: "16px" }}>
              Learn more about the administrators and department leaders guiding
              Lamoille ISD and supporting Lamoille High School students.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
