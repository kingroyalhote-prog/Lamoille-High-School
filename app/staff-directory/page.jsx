import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

const GROUP_ORDER = [
  "Ownership",
  "Administration",
  "Student Services",
  "Teachers",
  "Faculty",
]

export default async function StaffDirectory() {
  const { data: staff, error } = await supabase
    .from("staff_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const grouped = {
    Ownership: [],
    Administration: [],
    "Student Services": [],
    Teachers: [],
    Faculty: [],
  }

  staff?.forEach((person) => {
    const category = person.category || "Faculty"

    if (grouped[category]) {
      grouped[category].push(person)
    } else {
      grouped.Faculty.push(person)
    }
  })

  return (
    <main className="content">
      <section className="section">
        <div className="container">
          <p className="section-label">Directory</p>
          <h1>Staff Directory</h1>

          {error && (
            <p style={{ marginTop: "20px", color: "#b91c1c" }}>
              Staff directory could not be loaded.
            </p>
          )}

          {GROUP_ORDER.map((group) => {
            const members = grouped[group]

            if (!members || members.length === 0) return null

            return (
              <div key={group} style={{ marginTop: "40px" }}>
                <h2>{group}</h2>

                <div className="card-grid">
                  {members.map((person) => (
                    <div
                      key={person.id}
                      className="card"
                      style={{ textAlign: "center" }}
                    >
                      <img
                        src={person.image_url || "/images/lamoille-logo.png"}
                        alt={person.full_name || "Staff member"}
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius: "999px",
                          objectFit: "cover",
                          marginBottom: "12px",
                        }}
                      />

                      <h3>{person.full_name}</h3>

                      {person.title && <p>{person.title}</p>}

                      {person.roblox_username && (
                        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                          @{person.roblox_username}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
