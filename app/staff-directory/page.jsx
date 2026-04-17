export const dynamic = "force-dynamic"

import Image from "next/image"
import { supabase } from "../../lib/supabase"

export default async function StaffDirectoryPage() {
  const { data: staff } = await supabase
    .from("staff_members")
    .select("id, full_name, title, department, email, phone, image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Our People</p>
        <h1>Staff Directory</h1>
        <p>
          Meet the administrators, faculty, and support staff who serve the
          Lamoille community.
        </p>
      </section>

      <main className="page-shell">
        <div className="directory-grid">
          {staff?.length ? (
            staff.map((person) => (
              <article key={person.id} className="directory-card">
                <Image
                  src={person.image_url || "/images/lamoille-logo.png"}
                  alt={person.full_name}
                  width={72}
                  height={72}
                />
                <h3>{person.full_name}</h3>
                <p className="meta-text">{person.title}</p>
                <p>{person.department || "Department not listed"}</p>
                <p>{person.email || "Email not listed"}</p>
                <p>{person.phone || "Phone not listed"}</p>
              </article>
            ))
          ) : (
            <article className="directory-card empty-card">
              <h3>No staff entries yet</h3>
              <p>Your staff directory entries will appear here once added.</p>
            </article>
          )}
        </div>
      </main>
    </>
  )
}
