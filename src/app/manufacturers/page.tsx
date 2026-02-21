import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Manufacturer = { id: number; code: string | null; titles: Record<string, string> };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export default function ManufacturersPage() {
  const manufacturers = readJSON<Manufacturer[]>("manufacturers.json");

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "خانه" }, { label: "سازندگان" }]} />
      <Card>
        <CardHeader>
          <CardTitle>سازندگان</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>نام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturers.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.id}</TableCell>
                  <TableCell>
                    <Link href={`/manufacturers/${m.id}`}>
                      {m.titles["1"] ?? m.titles["2"] ?? m.code ?? `#${m.id}`}
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
