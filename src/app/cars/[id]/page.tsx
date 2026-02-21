import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

type Car = { id: number; manufacturerId: number; modelCode: string | null; titles: Record<string, string> };
type Ecu = {
  id: number;
  manufacturerId: number;
  typeId: number | null;
  sortOrder: number | null;
  pinStateOrderRaw: string | null;
  pinStateOrder: string[];
  titles: Record<string, string>;
};

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function generateStaticParams() {
  const cars = readJSON<Car[]>("cars.json");
  return cars.map((c) => ({ id: String(c.id) }));
}

export default async function CarDetail({ params }: { params: Promise<{ id: string }> }) {
  const cars = readJSON<Car[]>("cars.json");
  const ecus = readJSON<Ecu[]>("ecus.json");
  const ecusByCar = readJSON<Record<string, number[]>>("maps/ecus_by_car.json");

  const { id } = await params;
  const carId = Number(id);
  if (!Number.isFinite(carId)) {
    notFound();
  }

  const car = cars.find((c) => c.id === carId);
  if (!car) {
    notFound();
  }

  const ecuIds = ecusByCar[String(carId)] ?? [];
  const ecuList = ecuIds.map((ecuId) => ecus.find((e) => e.id === ecuId)).filter(Boolean) as Ecu[];

  return (
    <main style={{ padding: 24 }}>
      <h1>{car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `Car #${carId}`}</h1>
      <h2>ECUs</h2>
      <ul>
        {ecuList.map((e) => (
          <li key={e.id}>
            <Link href={`/ecus/${e.id}`}>
              {e.titles["1"] ?? e.titles["2"] ?? `ECU #${e.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
