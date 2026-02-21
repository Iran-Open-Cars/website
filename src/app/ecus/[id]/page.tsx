import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

type Ecu = {
  id: number;
  manufacturerId: number;
  typeId: number | null;
  sortOrder: number | null;
  pinStateOrderRaw: string | null;
  pinStateOrder: string[];
  titles: Record<string, string>;
};

type Cable = { id: number; name: string | null };

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

  const cableIds = cablesByEcu[String(ecuId)] ?? [];
  const cableList = cableIds.map((cableId) => cables.find((c) => c.id === cableId)).filter(Boolean) as Cable[];

  return (
    <main className="container">
      <section className="page-card">
        <h1>{ecu.titles["1"] ?? ecu.titles["2"] ?? `ECU #${ecuId}`}</h1>

        <h2 className="section-title">PIN_State_Order</h2>
        <pre className="code-block">{JSON.stringify(ecu.pinStateOrder ?? [], null, 2)}</pre>

        <h2 className="section-title">Cables</h2>
        <ul className="data-list">
          {cableList.map((c) => (
            <li key={c.id}>{c.name ?? `Cable #${c.id}`}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
