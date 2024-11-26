"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";

interface WordsFound {
  [key: string]: {
    found: boolean;
    count: number;
  };
}

interface PDFData {
  squareCubicMeter: string[];
  mudring: string[];
  molo: string[];
  sjøarbeid: string[];
  utdyping: string[];
  tildekking: string[];
  utfylling: string[];
  dykking: string[];
  undervannsprenging: string[];
  wordsFound: WordsFound;
}

interface Result {
  county: string;
  createdDate: Date; // Updated to Date
  hoeringUrl: string;
  pdfUrl: string;
  hoeringTitle: string;
  pageTitle: string;
  pageHeader: string;
  summary: string;
  pdfData: PDFData;
}

interface CountyData {
  county: string;
  results: Result[];
}

const NyeSaker: React.FC = () => {
  const [groupedResults, setGroupedResults] = useState<CountyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  // Get yesterday's date
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };

  const yesterdayDate = getYesterdayDate();

  // Fetch and process data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/json/statsforvalteren.json");
        const data: CountyData[] = await response.json();

        // Convert createdDate to Date object
        const processedData = data.map((countyData) => ({
          ...countyData,
          results: countyData.results.map((result) => ({
            ...result,
            createdDate: new Date(result.createdDate),
          })),
        }));

        setGroupedResults(processedData);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter results by year and date (newer than yesterday)
  const filterResults = (results: Result[]): Result[] =>
    results.filter(
      (result) =>
        (selectedYear
          ? result.createdDate.getFullYear().toString() === selectedYear
          : true) && result.createdDate > yesterdayDate // Only include results created after yesterday
    );

  // Generate year and county options
  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) =>
    (2025 - i).toString()
  );

  const counties = groupedResults.map((countyData) => countyData.county);

  // Filter grouped results
  const filteredGroupedResults = groupedResults.filter((countyData) =>
    selectedCounty ? countyData.county === selectedCounty : true
  );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center font-bold py-5">Siste saker</h1>

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
      {filteredGroupedResults.map((countyData, countyIndex) => (
        <div key={`county-${countyIndex}`} className="pb-5">
          <h2 className="text-3xl font-semibold pb-3 text-center">
            {countyData.county.charAt(0).toUpperCase() +
              countyData.county.slice(1)}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filterResults(countyData.results).map((result, resultIndex) => (
              <div
                key={`result-${resultIndex}-${result.pdfUrl}`}
                className="border p-3 rounded-lg bg-slate-50"
              >
                <h3 className="text-lg font-semibold pb-3">
                  {result.hoeringTitle}
                </h3>
                <p className="pb-3">
                  {result.createdDate.toLocaleDateString("nb-NO")}
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
                      .filter(([_, { count }]) => count > 0) // Filter out words with count 0
                      .map(([word, { count }]) => (
                        <li key={word}>
                          <span className="font-thin">{word} </span>
                          er funnet: {count} ganger
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NyeSaker;
