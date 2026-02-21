import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Manufacturer = { id: number; code: string | null; titles: Record<string, string> };
type Car = { id: number; manufacturerId: number; modelCode: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function generateStaticParams() {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json");
  return manufacturers.map((m) => ({ id: String(m.id) }));
}

export default function ManufacturerDetail({ params }: { params: { id: string } }) {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json");
  const cars = readJSON<Car[]>("cars.json");

  const id = Number(params.id);
  const m = manufacturers.find((x) => x.id === id);
  const carsOfM = cars.filter((c) => c.manufacturerId === id);

  return (
    <main style={{ padding: 24 }}>
      <h1>{m?.titles["1"] ?? m?.titles["2"] ?? m?.code ?? `Manufacturer #${id}`}</h1>
      <h2>Cars</h2>
      <ul>
        {carsOfM.map((c) => (
          <li key={c.id}>
            <Link href={`/cars/${c.id}`}>
              {c.titles["1"] ?? c.titles["2"] ?? c.modelCode ?? `Car #${c.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}