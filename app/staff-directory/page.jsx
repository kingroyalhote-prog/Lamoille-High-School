import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function StaffDirectory() {
  const { data: staff } = await supabase
    .from("staff_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  // Group staff by category
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
    <main className="page-container">
      <h1>Staff Directory</h1>

      {Object.entries(grouped).map(([category, people]) => (
        people.length > 0 && (
          <section key={category} className="staff-section">
            <h2 className="staff-section-title">{category}</h2>

            <div className="staff-grid">
              {people.map((person) => (
                <div key={person.id} className="staff-card">
                  <img
                    src={person.image_url || "/images/lamoille-logo.png"}
                    alt={person.full_name}
                    className="staff-photo"
                  />
                  <h3>{person.full_name}</h3>
                  <p>{person.title}</p>
                </div>
              ))}
            </div>
          </section>
        )
      ))}
    </main>
  )
}
