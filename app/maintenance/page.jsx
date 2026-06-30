import Link from "next/link"
import { redirect } from "next/navigation"
import { supabase } from "../../lib/supabase"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
  const { data } = await supabase
    .from("site_settings")
    .select("maintenance_mode")
    .eq("id", 1)
    .single()

  if (data?.maintenance_mode !== true) {
    redirect("/")
  }

  return (
    <main className="maintenancePage">
      <div className="maintenanceCard">
        <h1>Website Down for Maintenance</h1>
        <p>We will be back soon. Thank you for your patience.</p>

        <Link href="/admin" className="adminLoginBtn">
          Admin Login
        </Link>
      </div>
    </main>
  )
}
