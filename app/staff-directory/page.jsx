import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function StaffDirectory() {
  const { data: staff } = await supabase
    .from("staff_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const grouped = {
    Administration: [],
    Teachers: [],
    "Support Staff": [],
  }

  staff?.forEach((person) => {
    const category = person.category || "Teachers"
    if (!grouped[category]) grouped[category] = []
    grouped[category].push(person)
  })

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Our People</p>
        <h1>Staff Directory</h1>
        <p>Meet the team that supports the Lamoille High School community.</p>
      </section>

      <main className="page-shell">
        {Object.entries(grouped).map(([category, people]) =>
          people.length > 0 ? (
            <section key={category} className="staff-directory-section">
              <h2 className="staff-directory-section-title">{category}</h2>

              <div className="staff-directory-grid">
                {people.map((person) => (
                  <article key={person.id} className="staff-directory-card">
                    <img
                      src={person.image_url || "/images/lamoille-logo.png"}
                      alt={person.full_name}
                      className="staff-directory-photo"
                    />

                    <h3>{person.full_name}</h3>
                    <p className="staff-directory-role">
                      {person.title || "Staff Member"}
                    </p>
                    {person.email ? <p>{person.email}</p> : null}
                    {person.bio ? <p>{person.bio}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null
        )}
      </main>
    </>
  )
}
