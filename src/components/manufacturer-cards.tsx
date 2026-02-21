"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ManufacturerCardItem = {
  id: number;
  faName: string;
  enName: string;
};

type ManufacturerCardsProps = {
  manufacturers: ManufacturerCardItem[];
};

export function ManufacturerCards({ manufacturers }: ManufacturerCardsProps) {
  const [query, setQuery] = useState("");

  const filteredManufacturers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return manufacturers;
    }

    return manufacturers.filter((manufacturer) => {
      return [manufacturer.faName, manufacturer.enName, `${manufacturer.id}`]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [manufacturers, query]);

  return (
    <section className="cards-grid">
      <Card>
        <CardHeader>
          <CardTitle>سازندگان خودرو | Car Manufacturers</CardTitle>
          <CardDescription>
            برند موردنظر را با نام فارسی، English name یا شناسه جستجو کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="search-label" htmlFor="manufacturer-search">
            جستجو / Search
          </label>
          <input
            id="manufacturer-search"
            className="search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="مثال: ایران خودرو، SAIPA، 12"
          />
        </CardContent>
      </Card>

      <div className="manufacturer-card-grid">
        {filteredManufacturers.map((manufacturer) => (
          <Link
            key={manufacturer.id}
            href={`/manufacturers/${manufacturer.id}`}
            className="manufacturer-card"
          >
            <span className="manufacturer-id">#{manufacturer.id}</span>
            <h3>{manufacturer.faName}</h3>
            <p>{manufacturer.enName}</p>
          </Link>
        ))}
      </div>

      {filteredManufacturers.length === 0 ? (
        <Card>
          <CardContent>
            <p className="empty-state">نتیجه‌ای پیدا نشد. عبارت دیگری وارد کنید / No results found.</p>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
