import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <section className="page-card">
        <h1>ECU Database</h1>
        <p className="muted">Browse manufacturers, cars, and ECU wiring data sourced from static JSON files.</p>
        <ul className="data-list">
          <li>
            <Link href="/manufacturers">Manufacturers</Link>
          </li>
          <li>
            <Link href="/cars">Cars</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
