export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* LEFT SIDE */}
        <div className="footer-left">
          <img src="/images/lamoille-logo.png" alt="Lamoille Logo" />
          <div>
            <h3>Lamoille High School</h3>
            <p>Excellence. Community. Opportunity.</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Lamoille High School</p>
          <p className="footer-small">
            Website made by Josh Productions
          </p>
          <p className="footer-small">
            This website has no affiliation with any real school.
          </p>
        </div>

      </div>
    </footer>
  )
}
