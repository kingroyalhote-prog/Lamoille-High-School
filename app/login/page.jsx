export default function LoginPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Admin Access</p>
        <h1>Login</h1>
        <p>
          Secure staff login for announcements, directory management, and
          employment administration.
        </p>
      </section>

      <main className="page-shell">
        <div className="content-card">
          <h2>Admin login coming next</h2>
          <p>
            The next step is wiring Supabase Auth so master and staff admins can
            sign in and manage the site.
          </p>
        </div>
      </main>
    </>
  )
}
