export default function Footer() {
  return (
    <footer
      style={{
        background: "#06101f",
        color: "white",
        marginTop: "80px",
        padding: "28px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
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
            gap: "14px",
          }}
        >
          <img
            src="/images/lamoille-logo.png"
            alt="Lamoille High School logo"
            style={{
              width: "52px",
              height: "52px",
              objectFit: "cover",
              borderRadius: "999px",
              flexShrink: 0,
            }}
          />

          <div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: "1.05rem",
                color: "white",
              }}
            >
              Lamoille High School
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.72)",
                fontSize: "0.9rem",
              }}
            >
              Excellence. Community. Opportunity.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "2px 0", color: "rgba(255,255,255,0.82)" }}>
            © 2026 Lamoille High School
          </p>
          <p style={{ margin: "2px 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.58)" }}>
            Website made by Josh Productions
          </p>
          <p style={{ margin: "2px 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.58)" }}>
            This website has no affiliation with any real school.
          </p>
        </div>
      </div>
    </footer>
  )
}
