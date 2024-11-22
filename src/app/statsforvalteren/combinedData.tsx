import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";

// Interface for the result structure
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

  // Fetch and process data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/json/statsforvalteren1.json");

        if (!response.ok) throw new Error("Failed to fetch data");

        const data: Result[] = await response.json();

        // Convert createdDate and høringsfrist to Date object
        const processedData = data.map((result) => ({
          ...result,
          createdDate: new Date(result.createdDate),
          høringsfrist: new Date(result.høringsfrist), // Convert to Date
        }));

        setResults(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter results by year
  const filterResultsByYear = (result: Result): boolean =>
    selectedYear
      ? result.createdDate.getFullYear().toString() === selectedYear
      : true;

  // Filter results by county
  const filterResultsByCounty = (result: Result): boolean =>
    selectedCounty ? result.county === selectedCounty : true;

  // Group results by county
  const groupByCounty = (results: Result[]) => {
    return results.reduce((acc, result) => {
      if (!acc[result.county]) {
        acc[result.county] = [];
      }
      acc[result.county].push(result);
      return acc;
    }, {} as Record<string, Result[]>);
  };

  // Generate year options dynamically (2025-2010)
  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) =>
    (2025 - i).toString()
  );

  // Get unique counties from results
  const counties = [...new Set(results.map((result) => result.county))];

  const filteredResults = results
    .filter(filterResultsByYear)
    .filter(filterResultsByCounty);

  // Group filtered results by county
  const groupedResults = groupByCounty(filteredResults);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center font-bold py-5">
        Høringssaker fra statsforvalteren
      </h1>

      {/* Button for navigating to the latest cases */}
      <div className="text-center pb-3">
        <Button
          variant="outline"
          className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
          asChild
        >
          <Link href="/statsforvalteren/nyesaker">Siste saker</Link>
        </Button>
      </div>

      {/* Sorting Filters */}
      <div className="bg-slate-50 border rounded mb-6">
        <p className="text-center text-2xl font-semibold py-3">Sortering</p>
        <div className="grid grid-cols-2">
          {/* Year Selector */}
          <div className="pb-5 text-center">
            <label htmlFor="yearSelect" className="font-bold pr-3">
              Velg år:
            </label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Alle år</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* County Selector */}
          <div className="pb-5 text-center">
            <label htmlFor="countySelect" className="font-bold pr-3">
              Velg fylke:
            </label>
            <select
              id="countySelect"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="p-2 border rounded"
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

      {/* Display Results */}
      {Object.entries(groupedResults).map(([county, countyResults]) => (
        <div key={county}>
          <h2 className="text-3xl font-semibold pb-3 text-center">
            {county.charAt(0).toUpperCase() + county.slice(1)}
          </h2>
          <div className="pb-5 grid grid-cols-3 gap-5">
            {/* Iterate over the results for this county */}
            {countyResults.map((result, index) => (
              <div key={`result-${index}-${result.pdfUrl}`} className="pb-5">
                <div className="border p-3 rounded-lg bg-slate-50 min-h-[500px]">
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

                  {/* PDF and hearing links */}
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

                  {/* PDF Data */}
                  <h3 className="text-xl font-semibold pb-2">PDF data:</h3>
                  <div className="pb-5">
                    <ul>
                      {Object.entries(result.pdfData.wordsFound)
                        .filter(([_, { count }]) => count > 0) // Filter out words with count 0
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
