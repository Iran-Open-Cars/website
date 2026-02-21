import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Manufacturer = { id: number; code: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export default function ManufacturersPage() {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json");

  return (
    <main className="container">
      <section className="page-card">
        <h1>Manufacturers</h1>
        <ul className="data-list">
          {manufacturers.map((m) => (
            <li key={m.id}>
              <Link href={`/manufacturers/${m.id}`}>
                {m.titles["1"] ?? m.titles["2"] ?? m.code ?? `#${m.id}`}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
