import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ManufacturerCards } from "@/components/manufacturer-cards";

type Manufacturer = { id: number; code?: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export default function Home() {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json")
    .map((manufacturer) => ({
      id: manufacturer.id,
      faName: manufacturer.titles["1"] ?? manufacturer.code ?? `سازنده ${manufacturer.id}`,
      enName: manufacturer.titles["2"] ?? manufacturer.code ?? `Manufacturer ${manufacturer.id}`,
    }))
    .sort((a, b) => a.id - b.id);

  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "خانه | Home" }]} />
      <ManufacturerCards manufacturers={manufacturers} />
    </main>
  );
}
