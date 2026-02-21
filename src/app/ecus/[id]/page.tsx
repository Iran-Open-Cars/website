import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Ecu = {
  id: number;
  manufacturerName: string | null;
  typeId: number | null;
  sortOrder: number | null;
  pinStateOrderRaw: string | null;
  pinStateOrder: string[];
  titles: Record<string, string>;
};

type Cable = { id: number; description: string | null };

function readJSON<T>(rel: string): T {
  const p = path.join(process.cwd(), "public", "data", rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function generateStaticParams() {
  const ecus = readJSON<Ecu[]>("ecus.json");
  return ecus.map((e) => ({ id: String(e.id) }));
}

export default async function EcuDetail({ params }: { params: Promise<{ id: string }> }) {
  const ecus = readJSON<Ecu[]>("ecus.json");
  const cables = readJSON<Cable[]>("cables.json");
  const cablesByEcu = readJSON<Record<string, number[]>>("maps/cables_by_ecu.json");

  const { id } = await params;
  const ecuId = Number(id);
  if (!Number.isFinite(ecuId)) {
    notFound();
  }

  const ecu = ecus.find((e) => e.id === ecuId);
  if (!ecu) {
    notFound();
  }

  const ecuName = ecu.titles["1"] ?? ecu.titles["2"] ?? `ECU #${ecuId}`;
  const cableIds = cablesByEcu[String(ecuId)] ?? [];
  const cableList = cableIds.map((cableId) => cables.find((c) => c.id === cableId)).filter(Boolean) as Cable[];

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "خانه" }, { href: "/cars", label: "خودروها" }, { label: ecuName }]} />
      <Card>
        <CardHeader>
          <CardTitle>{ecuName}</CardTitle>
          <CardDescription>ترتیب پین‌ها: {ecu.pinStateOrder.join("، ") || "-"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه کابل</TableHead>
                <TableHead>نام کابل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cableList.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.description ?? `Cable #${c.id}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
