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
              padding: "50px",
              borderRadius: "28px",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                textTransform: "uppercase",
                fontWeight: 800,
                letterSpacing: "0.08em",
                opacity: 0.8,
                marginBottom: "10px",
              }}
            >
              About Lamoille High School
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "3rem",
              }}
            >
              Where Ambition Meets Opportunity
            </h1>

            <p
              style={{
                maxWidth: "750px",
                marginTop: "20px",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                opacity: 0.92,
              }}
            >
              Lamoille High School is a modern educational community focused on
              leadership, involvement, academic excellence, and meaningful
              opportunities for every student.
            </p>
          </div>

          <div className="card-grid">

            <div className="card">
              <h2>🎯 Our Mission</h2>

              <p>
                We prepare students for future success through strong academics,
                positive relationships, leadership development, and meaningful
                opportunities both inside and outside the classroom.
              </p>
            </div>

            <div className="card">
              <h2>🌟 Our Vision</h2>

              <p>
                To create a welcoming school community where every student feels
                supported, challenged, and inspired to achieve their goals.
              </p>
            </div>

          </div>

          <div
            className="card"
            style={{
              marginTop: "30px",
            }}
          >
            <h2>🏫 Our Community</h2>

            <p>
              At Lamoille High School, students, staff, and families work
              together to build a positive and engaging learning environment.
              Through clubs, athletics, events, and leadership opportunities,
              students are encouraged to become active members of the school
              community.
            </p>
          </div>

          <div
            className="card"
            style={{
              marginTop: "24px",
            }}
          >
            <h2>📚 Student Growth</h2>

            <p>
              We believe education extends beyond the classroom. Students are
              encouraged to develop leadership skills, build lasting
              relationships, participate in extracurricular activities, and
              prepare for future success.
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
              <h2 style={{ margin: 0 }}>
                👥 Meet Our Leadership Team
              </h2>

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
              Learn more about the leadership team guiding Lamoille High School,
              including school administrators and department leaders.
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}
