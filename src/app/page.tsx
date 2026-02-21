import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>ECU Database</h1>
      <ul>
        <li><Link href="/manufacturers">Manufacturers</Link></li>
      </ul>
      <p style={{ opacity: 0.7 }}>Data is served statically from /public/data</p>
    </main>
  );
}