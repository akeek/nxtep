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

const CombinedData: React.FC = () => {
  const [groupedResults, setGroupedResults] = useState<CountyData[]>([]);
  const [showSentences, setShowSentences] = useState<{
    [countyIndex: number]: {
      [resultIndex: number]: { [key: string]: boolean };
    };
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/json/statsforvalteren.json");
        const data = await response.json();
        setGroupedResults(data);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };

    fetchData();
  }, []);

  const handleToggleSentences = (
    countyIndex: number,
    resultIndex: number,
    type: string
  ) => {
    setShowSentences((prev) => ({
      ...prev,
      [countyIndex]: {
        ...prev[countyIndex],
        [resultIndex]: {
          ...prev[countyIndex]?.[resultIndex],
          [type]: !prev[countyIndex]?.[resultIndex]?.[type],
        },
      },
    }));
  };

  const isSentenceVisible = (
    countyIndex: number,
    resultIndex: number,
    type: string
  ) => {
    return !!showSentences[countyIndex]?.[resultIndex]?.[type];
  };

  const filterResults = (results: Result[]): Result[] => {
    return results.filter((result) => {
      const { wordsFound } = result.pdfData;
      return Object.values(wordsFound).some((word) => word.found);
    });
  };

  console.log(groupedResults);

  return (
    <div className="container mx-auto p-5">
      {groupedResults.map((countyData, countyIndex) => {
        const filteredResults = filterResults(countyData.results);
        if (filteredResults.length === 0) {
          return null;
        }
        return (
          <div key={`county-${countyIndex}`} className="pb-5">
            <h2 className="text-3xl font-bold pb-3 text-center">
              {countyData.county.charAt(0).toUpperCase() +
                countyData.county.slice(1)}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResults.map((result, resultIndex) => (
                <div
                  key={`result-${resultIndex}-${result.pdfUrl}`}
                  style={{ marginBottom: "20px" }}
                  className="border p-3 rounded-lg bg-slate-50"
                >
                  <h3 className="text-lg font-bold pb-3">
                    {result.hoeringTitle}
                  </h3>
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
                        .filter(([_, { found }]) => found)
                        .map(([word, { count }]) => (
                          <li key={word}>
                            <span className="font-thin">{word} </span>
                            er funnet{count > 0 && `: ${count}`} ganger
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="flex-col">
                    {Object.entries(result.pdfData).map(([key, sentences]) => {
                      if (!Array.isArray(sentences) || sentences.length === 0) {
                        return null;
                      }
                      const isVisible = isSentenceVisible(
                        countyIndex,
                        resultIndex,
                        key
                      );

                      return (
                        <div key={key} className="pb-4 flex-col">
                          <Button
                            variant="outline"
                            className="bg-green-200 hover:bg-green-500 hover:text-white"
                            onClick={() =>
                              handleToggleSentences(
                                countyIndex,
                                resultIndex,
                                key
                              )
                            }
                          >
                            {isVisible ? (
                              <p>Skjul setninger som inneholder {key}</p>
                            ) : (
                              <p>Vis setninger som inneholder {key}</p>
                            )}
                          </Button>
                          <div
                            className={`overflow-hidden ${
                              isVisible ? "animate-expand" : "animate-collapse"
                            }`}
                          >
                            {isVisible && (
                              <ul>
                                {sentences.map(
                                  (sentence: string, idx: number) => (
                                    <li className="py-3" key={idx}>
                                      - {sentence}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CombinedData;
