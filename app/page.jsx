import { supabase } from "../lib/supabase"

export default async function Home() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")

  console.log("DATA:", data)
  console.log("ERROR:", error)

  return (
    <main style={{ padding: "40px" }}>
      <h1>Supabase Connected ✅</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
