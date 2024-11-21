import { AuthGuard } from "../../components/authGuard";
import { UtslippCard } from "../../components/ustlippCard";
import { getInfo } from "../../lib/data";

export default async function NorskeUtslipp() {
  const items = await getInfo();

  console.log("Antall treff hentet: ", items.length);

  const sortedItems = items
    .filter((item) => {
      if (
        item.PDFAnalysis &&
        typeof item.PDFAnalysis === "object" &&
        !("error" in item.PDFAnalysis)
      ) {
        return Object.values(item.PDFAnalysis).some(
          (analysis) => analysis.count && analysis.count > 0
        );
      }
      return false;
    })
    .sort((a, b) => {
      const totalCountA = getTotalCount(a.PDFAnalysis);
      const totalCountB = getTotalCount(b.PDFAnalysis);
      return totalCountB - totalCountA;
    });

  console.log("Antall treff levert", sortedItems.length);

  return (
    <AuthGuard>
      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold py-6">
          Data fra Norske Utslipp
        </h1>
        <div className="grid grid-cols-2 gap-5">
          {sortedItems.map((i) => (
            <UtslippCard key={i.id} item={i} />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}

function getTotalCount(
  PDFAnalysis:
    | Record<string, { sentences?: string[]; count?: number }>
    | { error: string }
    | undefined
): number {
  if (!PDFAnalysis || "error" in PDFAnalysis) return 0;

  return Object.values(PDFAnalysis).reduce(
    (sum, analysis) => sum + (analysis.count ?? 0),
    0
  );
}
