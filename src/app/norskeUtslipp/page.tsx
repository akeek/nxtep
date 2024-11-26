import { getInfo } from "../../lib/data";
import { AuthGuard } from "../components/authGuard";
import { ClientComponent } from "../components/ClientComponents";

export interface Item {
  id: number;
  Virksomhet: string;
  CreationDate: string | null;
  Fylke: string;
  Kommune: string;
  Tillatelser: string;
  Kontroller: string;
  Sektor: string;
  PDFAnalysis?:
    | Record<string, { sentences?: string[]; count?: number }>
    | { error: string }
    | undefined;
}

export default async function NorskeUtslipp() {
  const items: Item[] = (await getInfo()).map((item) => ({
    ...item,
    id: parseInt(item.id, 10),
  }));

  const uniqueYears: number[] = Array.from(
    new Set(
      items
        .map((item) => {
          const year = getYear(item.CreationDate);
          return year;
        })
        .filter((year) => year > 0)
    )
  ).sort((a, b) => b - a);

  return (
    <AuthGuard>
      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold py-6">
          Data fra Norske Utslipp
        </h1>

        <ClientComponent items={items} uniqueYears={uniqueYears} />
      </div>
    </AuthGuard>
  );
}

function getYear(dateStr: string | null): number {
  if (!dateStr) return 0;

  const parts = dateStr.split("/");

  if (parts.length !== 3) return 0;

  const year = parseInt(parts[2], 10);
  return isNaN(year) ? 0 : year;
}
