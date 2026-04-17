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
    const category = person.category || "Support Staff"
    if (grouped[category]) {
      grouped[category].push(person)
    } else {
      grouped["Support Staff"].push(person)
    }
  })

  return (
    <main className="content">
      <section className="section">
        <div className="container">

          <p className="section-label">Directory</p>
          <h1>Staff Directory</h1>

          {Object.entries(grouped).map(([group, members]) =>
            members.length > 0 && (
              <div key={group} style={{ marginTop: "40px" }}>
                <h2>{group}</h2>

                <div className="card-grid">
                  {members.map((person) => (
                    <div key={person.id} className="card" style={{ textAlign: "center" }}>
                      <img
                        src={person.image_url || "/images/lamoille-logo.png"}
                        alt={person.full_name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "999px",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />

                      <h3>{person.full_name}</h3>
                      <p>{person.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

        </div>
      </section>
    </main>
  )
}
