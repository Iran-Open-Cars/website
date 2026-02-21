import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "خانه" }]} />
      <section className="cards-grid">
        <Card>
          <CardHeader>
            <CardTitle>پایگاه داده ECU</CardTitle>
            <CardDescription>مرور سازندگان، خودروها و اطلاعات سیم‌کشی ECU از فایل‌های JSON.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="quick-links">
              <Link href="/manufacturers" className="button-link">
                مشاهده سازندگان
              </Link>
              <Link href="/cars" className="button-link secondary">
                مشاهده خودروها
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
