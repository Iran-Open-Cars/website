import Link from "next/link";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/manufacturers", label: "سازندگان" },
  { href: "/cars", label: "خودروها" },
];

export function TopNav() {
  return (
    <header className="top-nav-shell">
      <nav className="top-nav" aria-label="Main navigation">
        <Link href="/" className="brand">
          ECU Database
        </Link>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
