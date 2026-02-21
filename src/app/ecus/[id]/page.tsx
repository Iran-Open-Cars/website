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

export default function EcuDetail({ params }: { params: { id: string } }) {
  const ecus = readJSON<Ecu[]>("ecus.json");
  const cables = readJSON<Cable[]>("cables.json");
  const cablesByEcu = readJSON<Record<string, number[]>>("maps/cables_by_ecu.json");

  const ecuId = Number(params.id);
  const ecu = ecus.find((e) => e.id === ecuId);
  const cableIds = cablesByEcu[String(ecuId)] ?? [];
  const cableList = cableIds.map((id) => cables.find((c) => c.id === id)).filter(Boolean) as Cable[];

  return (
    <main style={{ padding: 24 }}>
      <h1>{ecu?.titles["1"] ?? ecu?.titles["2"] ?? `ECU #${ecuId}`}</h1>

      <h2>PIN_State_Order</h2>
      <pre style={{ background: "#f3f3f3", padding: 12, overflowX: "auto" }}>
        {JSON.stringify(ecu?.pinStateOrder ?? [], null, 2)}
      </pre>

      <h2>Cables</h2>
      <ul>
        {cableList.map((c) => (
          <li key={c.id}>{c.name ?? `Cable #${c.id}`}</li>
        ))}
      </ul>
    </main>
  );
}