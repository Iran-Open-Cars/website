// scripts/export.mjs
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, "data", "ecu_public.db");
const OUT_DIR = path.join(ROOT, "public", "data");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJSON(relPath, data) {
  const full = path.join(OUT_DIR, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
  console.log("✅ wrote", path.relative(ROOT, full), Array.isArray(data) ? `(${data.length})` : "(obj)");
}

function parsePinStateOrder(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split("$")
    .map((s) => s.trim())
    .filter(Boolean);
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("❌ DB not found:", DB_PATH);
    process.exit(1);
  }

  ensureDir(OUT_DIR);
  const db = new Database(DB_PATH, { readonly: true });

  // ---------- Manufacturers ----------
  // CarManufacturer: (ID, Order)
  // CarManufacturerString: (ID, Language, String, ManufacturerID)
  const manufacturersRaw = db
    .prepare(
      `
      SELECT
        cm.ID as id,
        cm."Order" as sortOrder,
        cms.Language as lang,
        cms.String as title
      FROM CarManufacturer cm
      LEFT JOIN CarManufacturerString cms ON cms.ManufacturerID = cm.ID
      ORDER BY cm.ID, cms.Language
    `
    )
    .all();

  const manufacturersMap = new Map();
  for (const r of manufacturersRaw) {
    const m = manufacturersMap.get(r.id) ?? { id: r.id, sortOrder: r.sortOrder ?? null, titles: {} };
    if (r.lang != null && r.title != null) m.titles[String(r.lang)] = r.title;
    manufacturersMap.set(r.id, m);
  }
  const manufacturers = Array.from(manufacturersMap.values());
  writeJSON("manufacturers.json", manufacturers);

  // ---------- Cars ----------
  // Car: (ID, ManufacturerID, Order)
  // CarString: (ID, Language, String, CarID)
  const carsRaw = db
    .prepare(
      `
      SELECT
        c.ID as id,
        c.ManufacturerID as manufacturerId,
        c."Order" as sortOrder,
        cs.Language as lang,
        cs.String as title
      FROM Car c
      LEFT JOIN CarString cs ON cs.CarID = c.ID
      ORDER BY c.ID, cs.Language
    `
    )
    .all();

  const carsMap = new Map();
  for (const r of carsRaw) {
    const car = carsMap.get(r.id) ?? {
      id: r.id,
      manufacturerId: r.manufacturerId ?? null,
      sortOrder: r.sortOrder ?? null,
      titles: {},
    };
    if (r.lang != null && r.title != null) car.titles[String(r.lang)] = r.title;
    carsMap.set(r.id, car);
  }
  const cars = Array.from(carsMap.values());
  writeJSON("cars.json", cars);

  // ---------- ECU Types ----------
  // ECUTypes: (Id, Name, Order, Grouping)
  // ECUTypeString: (Id, EcuTypeId, Language, String)
  const ecuTypesRaw = db
    .prepare(
      `
      SELECT
        t.Id as id,
        t.Name as code,
        t."Order" as sortOrder,
        t.Grouping as grouping,
        ts.Language as lang,
        ts.String as title
      FROM ECUTypes t
      LEFT JOIN ECUTypeString ts ON ts.EcuTypeId = t.Id
      ORDER BY t.Id, ts.Language
    `
    )
    .all();

  const ecuTypesMap = new Map();
  for (const r of ecuTypesRaw) {
    const t = ecuTypesMap.get(r.id) ?? {
      id: r.id,
      code: r.code ?? null,
      sortOrder: r.sortOrder ?? null,
      grouping: r.grouping ?? null,
      titles: {},
    };
    if (r.lang != null && r.title != null) t.titles[String(r.lang)] = r.title;
    ecuTypesMap.set(r.id, t);
  }
  const ecuTypes = Array.from(ecuTypesMap.values());
  writeJSON("ecu_types.json", ecuTypes);

  // ---------- ECUs ----------
  // ECU: (ID, Manufacturer, Order, Type, PIN_State_Order)
  // ECUString: (ID, Language, String, ECUID)
  const ecusRaw = db
    .prepare(
      `
      SELECT
        e.ID as id,
        e.Manufacturer as manufacturerId,
        e.Type as typeId,
        e."Order" as sortOrder,
        e.PIN_State_Order as pinStateOrder,
        es.Language as lang,
        es.String as title
      FROM ECU e
      LEFT JOIN ECUString es ON es.ECUID = e.ID
      ORDER BY e.ID, es.Language
    `
    )
    .all();

  const ecusMap = new Map();
  for (const r of ecusRaw) {
    const ecu = ecusMap.get(r.id) ?? {
      id: r.id,
      manufacturerId: r.manufacturerId ?? null,
      typeId: r.typeId ?? null,
      sortOrder: r.sortOrder ?? null,
      pinStateOrderRaw: r.pinStateOrder ?? null,
      pinStateOrder: parsePinStateOrder(r.pinStateOrder),
      titles: {},
    };
    if (r.lang != null && r.title != null) ecu.titles[String(r.lang)] = r.title;
    ecusMap.set(r.id, ecu);
  }
  const ecus = Array.from(ecusMap.values());
  writeJSON("ecus.json", ecus);

  // ---------- Mapping: cars -> ecus ----------
  // CarEcuMapper: (CarID, EcuID)
  const carEcuRows = db.prepare(`SELECT CarID as carId, EcuID as ecuId FROM CarEcuMapper`).all();
  const ecusByCar = {};
  for (const r of carEcuRows) {
    const k = String(r.carId);
    (ecusByCar[k] ??= []).push(r.ecuId);
  }
  writeJSON("maps/ecus_by_car.json", ecusByCar);

  // ---------- Mapping: ecus -> cables ----------
  // CableEcuMapper: (CableId, EcuId)
  const ecuCableRows = db.prepare(`SELECT EcuId as ecuId, CableId as cableId FROM CableEcuMapper`).all();
  const cablesByEcu = {};
  for (const r of ecuCableRows) {
    const k = String(r.ecuId);
    (cablesByEcu[k] ??= []).push(r.cableId);
  }
  writeJSON("maps/cables_by_ecu.json", cablesByEcu);

  // ---------- Cables ----------
  // Cables: (Id, Description, HardwareTypeIds)
  const cables = db
    .prepare(`SELECT Id as id, Description as description, HardwareTypeIds as hardwareTypeIds FROM Cables ORDER BY Id`)
    .all();
  writeJSON("cables.json", cables);

  // ---------- Meta ----------
  writeJSON("meta.json", {
    exportedAt: new Date().toISOString(),
    counts: {
      manufacturers: manufacturers.length,
      cars: cars.length,
      ecus: ecus.length,
      ecuTypes: ecuTypes.length,
      cables: cables.length,
      carEcuLinks: carEcuRows.length,
      ecuCableLinks: ecuCableRows.length,
    },
  });

  db.close();
  console.log("🎯 Export done.");
}

main();