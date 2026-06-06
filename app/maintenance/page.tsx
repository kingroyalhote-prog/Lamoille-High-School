import Link from "next/link";

export default function MaintenancePage() {
  return (
    <main className="maintenancePage">
      <div className="maintenanceCard">
        <h1>Website Down for Maintenance</h1>
        <p>We will be back soon. Thank you for your patience.</p>

        <Link href="/admin/login" className="adminLoginBtn">
          Admin Login
        </Link>
      </div>
    </main>
  );
}
