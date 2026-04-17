export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>Lamoille High School</h1>
        <p>Welcome to Lamoille High School, home of the Raiders.</p>
      </section>

      <section className="grid">
        <div className="card">
          <h2>Our Mission</h2>
          <p>We support student growth through academics, leadership, and community.</p>
        </div>
        <div className="card">
          <h2>School Community</h2>
          <p>Families, staff, and students work together to build a safe and successful school environment.</p>
        </div>
        <div className="card">
          <h2>Student Success</h2>
          <p>We aim to prepare students for college, careers, and responsible citizenship.</p>
        </div>
      </section>
    </main>
  );
}
