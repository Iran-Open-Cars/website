import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Car = { id: number; manufacturerId: number; modelCode: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export default function CarsPage() {
  const cars = readJSON<Car[]>("cars.json");

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "خانه" }, { label: "خودروها" }]} />
      <Card>
        <CardHeader>
          <CardTitle>خودروها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>مدل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.id}</TableCell>
                  <TableCell>
                    <Link href={`/cars/${car.id}`}>
                      {car.titles["1"] ?? car.titles["2"] ?? car.modelCode ?? `#${car.id}`}
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
