import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function ManufacturerDetail({ params }: { params: Promise<{ id: string }> }) {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json");
  const cars = readJSON<Car[]>("cars.json");

  const { id } = await params;
  const manufacturerId = Number(id);
  if (!Number.isFinite(manufacturerId)) {
    notFound();
  }

  const manufacturer = manufacturers.find((x) => x.id === manufacturerId);
  if (!manufacturer) {
    notFound();
  }

  const carsOfManufacturer = cars.filter((c) => c.manufacturerId === manufacturerId);

  return (
    <main className="container">
      <section className="page-card">
        <h1>{manufacturer.titles["1"] ?? manufacturer.titles["2"] ?? manufacturer.code ?? `Manufacturer #${manufacturerId}`}</h1>
        <h2 className="section-title">Cars</h2>
        <ul className="data-list">
          {carsOfManufacturer.map((car) => (
            <li key={car.id}>
              <Link href={`/cars/${car.id}`}>
                {car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `Car #${car.id}`}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
