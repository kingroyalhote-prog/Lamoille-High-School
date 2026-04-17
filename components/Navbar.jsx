import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">Lamoille High School</Link>
        <Link href="/staff">Staff</Link>
        <Link href="/employment">Employment</Link>
        <Link href="/admin">Administration</Link>
      </div>
    </nav>
  );
}
