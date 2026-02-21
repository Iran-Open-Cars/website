import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  const manufacturerName = manufacturer.titles["1"] ?? manufacturer.titles["2"] ?? manufacturer.code ?? `Manufacturer #${manufacturerId}`;
  const carsOfManufacturer = cars.filter((c) => c.manufacturerId === manufacturerId);

  return (
    <main className="container">
      <Breadcrumbs
        items={[
          { href: "/", label: "خانه" },
          { href: "/manufacturers", label: "سازندگان" },
          { label: manufacturerName },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>{manufacturerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه خودرو</TableHead>
                <TableHead>نام خودرو</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carsOfManufacturer.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.id}</TableCell>
                  <TableCell>
                    <Link href={`/cars/${car.id}`}>
                      {car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `Car #${car.id}`}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
