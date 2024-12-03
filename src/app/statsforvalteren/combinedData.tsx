import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Link from "next/link";

interface WordsFound {
  [key: string]: {
    found: boolean;
    count: number;
  };
}

interface PDFData {
  wordsFound: WordsFound;
}

interface Result {
  county: string;
  createdDate: Date;
  høringsfrist: Date;
  hoeringUrl: string;
  pdfUrl: string;
  hoeringTitle: string;
  pageTitle: string;
  pageHeader: string;
  summary: string;
  pdfData: PDFData;
}

const CombinedData: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/json/statsforvalteren1.json");

        if (!response.ok) throw new Error("Failed to fetch data");

        const data: Result[] = await response.json();

        const processedData = data.map((result) => ({
          ...result,
          createdDate: new Date(result.createdDate),
          høringsfrist: new Date(result.høringsfrist),
        }));

        setResults(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterResultsByYear = (result: Result): boolean =>
    selectedYear
      ? result.createdDate.getFullYear().toString() === selectedYear
      : true;

  const filterResultsByCounty = (result: Result): boolean =>
    selectedCounty ? result.county === selectedCounty : true;

  const groupByCounty = (results: Result[]) => {
    return results.reduce((acc, result) => {
      if (!acc[result.county]) {
        acc[result.county] = [];
      }
      acc[result.county].push(result);
      return acc;
    }, {} as Record<string, Result[]>);
  };

  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) =>
    (2025 - i).toString()
  );

  const counties = [...new Set(results.map((result) => result.county))];

  const filteredResults = results
    .filter(filterResultsByYear)
    .filter(filterResultsByCounty);

  const groupedResults = groupByCounty(filteredResults);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center font-bold py-5">
        Høringssaker fra statsforvalteren
      </h1>

      {/* <div className="text-center pb-3">
        <Button
          variant="outline"
          className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
          asChild
        >
          <Link href="/statsforvalteren/nyesaker">Siste saker</Link>
        </Button>
      </div> */}

      <div className="bg-slate-50 border rounded-lg mb-6">
        <p className="text-center text-2xl font-semibold py-3">Sortering</p>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="pb-5 text-center">
            <label htmlFor="yearSelect" className="font-bold pr-3 block">
              Velg år:
            </label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border rounded cursor-pointer hover:bg-green-50"
            >
              <option value="">Alle år</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="pb-5 text-center">
            <label htmlFor="countySelect" className="font-bold pr-3 block">
              Velg fylke:
            </label>
            <select
              id="countySelect"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="p-2 border rounded cursor-pointer hover:bg-green-50"
            >
              <option value="">Alle fylker</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county.charAt(0).toUpperCase() + county.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {Object.entries(groupedResults).map(([county, countyResults]) => (
        <div key={county}>
          <h2 className="text-3xl font-semibold pb-3 text-center">
            {county.charAt(0).toUpperCase() + county.slice(1)}
          </h2>
          <div className="pb-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {countyResults.map((result, index) => (
              <div key={`result-${index}-${result.pdfUrl}`} className="pb-5">
                <div className="border p-3 rounded-lg hover:bg-green-50 min-h-[500px]">
                  <h3 className="text-lg font-semibold pb-3">
                    {result.hoeringTitle}
                  </h3>
                  <p>
                    Søknadsdato:{" "}
                    {result.createdDate.toLocaleDateString("nb-NO")}
                  </p>
                  <p className="pb-3">
                    Høringsfrist:{" "}
                    {result.høringsfrist.toLocaleDateString("nb-NO")}
                  </p>
                  <p className="pb-3">{result.summary}</p>

                  <div className="pb-5">
                    <Button
                      variant="outline"
                      className="bg-green-200 hover:bg-green-500 hover:text-white"
                    >
                      <Link
                        href={result.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gå til PDF
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-green-200 hover:bg-green-500 hover:text-white ml-2"
                    >
                      <Link
                        href={result.hoeringUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gå til høring
                      </Link>
                    </Button>
                  </div>

                  <h3 className="text-xl font-semibold pb-2">PDF data:</h3>
                  <div className="pb-5">
                    <ul>
                      {Object.entries(result.pdfData.wordsFound)
                        .filter(([_, { count }]) => count > 0)
                        .map(([word, { count }]) => (
                          <li key={word}>
                            <span className="font-thin">{word}</span> er funnet:{" "}
                            {count} ganger
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CombinedData;
