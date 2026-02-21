import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Car = { id: number; manufacturerId: number; modelCode: string | null; titles: Record<string, string> };
type Ecu = {
  id: number;
  manufacturerName: string | null;
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

  const carName = car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `Car #${carId}`;
  const ecuIds = ecusByCar[String(carId)] ?? [];
  const ecuList = ecuIds.map((ecuId) => ecus.find((e) => e.id === ecuId)).filter(Boolean) as Ecu[];

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "خانه" }, { href: "/cars", label: "خودروها" }, { label: carName }]} />
      <Card>
        <CardHeader>
          <CardTitle>{carName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه ECU</TableHead>
                <TableHead>نام ECU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ecuList.map((ecu) => (
                <TableRow key={ecu.id}>
                  <TableCell>{ecu.id}</TableCell>
                  <TableCell>
                    <Link href={`/ecus/${ecu.id}`}>{ecu.titles["1"] ?? ecu.titles["2"] ?? `ECU #${ecu.id}`}</Link>
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
