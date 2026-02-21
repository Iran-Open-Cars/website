import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Car = { id: number; manufacturerId: number; modelCode: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export default function CarsPage() {
  const cars = readJSON<Car[]>("cars.json");

  return (
    <main style={{ padding: 24 }}>
      <h1>Cars</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <Link href={`/cars/${car.id}`}>
              {car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `#${car.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
