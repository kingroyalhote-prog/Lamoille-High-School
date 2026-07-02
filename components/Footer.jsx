export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        background: "linear-gradient(90deg, #071426, #0b2f4f)",
        color: "white",
        marginTop: "80px",
        padding: "34px 20px",
        borderTop: "5px solid #c9972b",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src="/images/lamoille-logo.png"
            alt="Lamoille ISD logo"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              borderRadius: 0,
              flexShrink: 0,
            }}
          />

          <div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: "1.15rem",
                color: "white",
              }}
            >
              Lamoille ISD
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.76)",
                fontSize: "0.92rem",
                fontWeight: 700,
              }}
            >
              Where Ambition Meets Opportunity
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "2px 0", color: "rgba(255,255,255,0.84)" }}>
            © 2026 Lamoille Independent School District
          </p>

          <p
            style={{
              margin: "2px 0",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Home of Lamoille High School
          </p>

          <p
            style={{
              margin: "2px 0",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Website made by Josh Productions
          </p>
        </div>
      </div>
    </footer>
  )
}
