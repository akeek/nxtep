"use client";

import { useState } from "react";
import { UtslippCard } from "./ustlippCard";
import { Item } from "../norskeUtslipp/page";

export function ClientComponent({
  items,
  uniqueYears,
}: {
  items: Item[];
  uniqueYears: number[];
}) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year =
      event.target.value === "all" ? null : parseInt(event.target.value, 10);
    setSelectedYear(year);
  };

  const filteredItems = selectedYear
    ? items.filter((item) => getYear(item.CreationDate) === selectedYear)
    : items;

  return (
    <div className="flex flex-col">
      <div className="text-center p-6">
        <select
          className="border p-3 rounded"
          onChange={handleYearChange}
          value={selectedYear ?? "all"}
        >
          <option value="all">Alle år</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <UtslippCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function getYear(dateStr: string | null): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return 0;
  return parseInt(parts[2], 10);
}
