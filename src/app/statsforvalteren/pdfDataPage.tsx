import { useEffect, useState } from "react";

interface ParsedData {
  id: number;
  name: string;
  wordsFound: {
    [word: string]: {
      found: boolean;
      count: number;
    };
  };
  squareCubicMeterSentences: string[];
  mudringSentences: string[];
  moloSentences: string[];
  sjøarbeidSentences: string[];
  utdypingSentences: string[];
  tildekkingSentences: string[];
  utfyllingSentences: string[];
  dykkingSentences: string[];
  undervannsprengingSentences: string[];
  filePath: string;
}

export default function ScrapedDataPage() {
  const [parsedDataArray, setParsedDataArray] = useState<ParsedData[]>([]);
  const [showSentences, setShowSentences] = useState<{
    squareCubicMeter: boolean;
    mudring: boolean;
    molo: boolean;
    sjøarbeid: boolean;
    utdyping: boolean;
    tildekking: boolean;
    utfylling: boolean;
    dykking: boolean;
    undervannsprenging: boolean;
  }>({
    squareCubicMeter: false,
    mudring: false,
    molo: false,
    sjøarbeid: false,
    utdyping: false,
    tildekking: false,
    utfylling: false,
    dykking: false,
    undervannsprenging: false,
  });

  useEffect(() => {
    // Fetch data and sort based on the number of 'true' found in wordsFound
    fetch("/data/parseResults.json")
      .then((response) => response.json())
      .then((data: ParsedData[]) => {
        // Filter out objects where all wordsFound values are false
        const filteredData = data.filter((parsedData) =>
          Object.values(parsedData.wordsFound).some((word) => word.found)
        );

        // Sort by the count of 'true' values in wordsFound
        const sortedData = filteredData.sort((a, b) => {
          const aFoundCount = Object.values(a.wordsFound).filter(
            (word) => word.found
          ).length;
          const bFoundCount = Object.values(b.wordsFound).filter(
            (word) => word.found
          ).length;
          return bFoundCount - aFoundCount;
        });

        setParsedDataArray(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleToggleSentences = (type: keyof typeof showSentences) => {
    setShowSentences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (parsedDataArray.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {parsedDataArray.map((parsedData) => {
        const hasFoundWords = Object.values(parsedData.wordsFound).some(
          (word) => word.found
        );

        if (!hasFoundWords) {
          return null;
        }

        return (
          <div
            key={parsedData.id}
            className="container mx-auto p-6 border m-6 bg-slate-50 rounded-xl"
          >
            <h2 className="text-center text-xl font-bold">
              {parsedData.name || "Mangler overskrift"}
            </h2>

            {/* Display words found with count */}
            <div className="py-4">
              <h3 className="text-lg font-bold">Søkeord</h3>
              <ul>
                {Object.entries(parsedData.wordsFound).map(
                  ([word, { found, count }]) => (
                    <li
                      key={word}
                      className={`leading-loose ${
                        found ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span className="font-medium">{word}</span>
                      {found && count > 0 && `: ${count}`}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Button to download PDF */}
            <button
              className="bg-green-200 py-1 px-4 rounded mt-4 hover:bg-green-500 hover:text-white"
              onClick={() => {
                if (parsedData.filePath) {
                  window.open(parsedData.filePath, "_blank");
                } else {
                  console.error("File path is not defined");
                }
              }}
            >
              Last ned PDF
            </button>

            {/* Display square/cubic meter sentences */}
            <div className="py-4">
              <h3 className="text-lg font-bold">
                Kvadrat/Kubikk meter setninger
              </h3>
              {parsedData.squareCubicMeterSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("squareCubicMeter")}
                >
                  {showSentences.squareCubicMeter
                    ? "Skjul setninger"
                    : "Vis setninger"}
                </button>
              )}
              {showSentences.squareCubicMeter &&
              parsedData.squareCubicMeterSentences.length > 0 ? (
                <ul>
                  {parsedData.squareCubicMeterSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.squareCubicMeterSentences.length === 0 && (
                  <p className="text-red-600">Ingen verdier funnet.</p>
                )
              )}
            </div>

            {/* Display mudring sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'mudring'
              </h3>
              {parsedData.mudringSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("mudring")}
                >
                  {showSentences.mudring ? "Skjul setninger" : "Vis setninger"}
                </button>
              )}
              {showSentences.mudring &&
              parsedData.mudringSentences.length > 0 ? (
                <ul>
                  {parsedData.mudringSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.mudringSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display molo sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'molo'
              </h3>
              {parsedData.moloSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("molo")}
                >
                  {showSentences.molo ? "Skjul setninger" : "Vis setninger"}
                </button>
              )}
              {showSentences.molo && parsedData.moloSentences.length > 0 ? (
                <ul>
                  {parsedData.moloSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.moloSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display sjøarbeid sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'sjøarbeid'
              </h3>
              {parsedData.sjøarbeidSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("sjøarbeid")}
                >
                  {showSentences.sjøarbeid
                    ? "Skjul setninger"
                    : "Vis setninger"}
                </button>
              )}
              {showSentences.sjøarbeid &&
              parsedData.sjøarbeidSentences.length > 0 ? (
                <ul>
                  {parsedData.sjøarbeidSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.sjøarbeidSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display utdyping sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'utdyping'
              </h3>
              {parsedData.utdypingSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("utdyping")}
                >
                  {showSentences.utdyping ? "Skjul setninger" : "Vis setninger"}
                </button>
              )}
              {showSentences.utdyping &&
              parsedData.utdypingSentences.length > 0 ? (
                <ul>
                  {parsedData.utdypingSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.utdypingSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display tildekking sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'tildekking'
              </h3>
              {parsedData.tildekkingSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("tildekking")}
                >
                  {showSentences.tildekking
                    ? "Skjul setninger"
                    : "Vis setninger"}
                </button>
              )}
              {showSentences.tildekking &&
              parsedData.tildekkingSentences.length > 0 ? (
                <ul>
                  {parsedData.tildekkingSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.tildekkingSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display utfylling sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'utfylling'
              </h3>
              {parsedData.utfyllingSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("utfylling")}
                >
                  {showSentences.utfylling
                    ? "Skjul setninger"
                    : "Vis setninger"}
                </button>
              )}
              {showSentences.utfylling &&
              parsedData.utfyllingSentences.length > 0 ? (
                <ul>
                  {parsedData.utfyllingSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.utfyllingSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display dykking sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'dykking'
              </h3>
              {parsedData.dykkingSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("dykking")}
                >
                  {showSentences.dykking ? "Skjul setninger" : "Vis setninger"}
                </button>
              )}
              {showSentences.dykking &&
              parsedData.dykkingSentences.length > 0 ? (
                <ul>
                  {parsedData.dykkingSentences.map((sentence, idx) => (
                    <li className="leading-loose" key={idx}>
                      - {sentence}
                    </li>
                  ))}
                </ul>
              ) : (
                parsedData.dykkingSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>

            {/* Display undervannsprenging sentences */}
            <div className="pb-4">
              <h3 className="text-lg font-bold">
                Setninger som inneholder ordet 'undervannsprenging'
              </h3>
              {parsedData.undervannsprengingSentences.length > 0 && (
                <button
                  className="text-blue-500"
                  onClick={() => handleToggleSentences("undervannsprenging")}
                >
                  {showSentences.undervannsprenging
                    ? "Skjul setninger"
                    : "Vis setninger"}
                </button>
              )}
              {showSentences.undervannsprenging &&
              parsedData.undervannsprengingSentences.length > 0 ? (
                <ul>
                  {parsedData.undervannsprengingSentences.map(
                    (sentence, idx) => (
                      <li className="leading-loose" key={idx}>
                        - {sentence}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                parsedData.undervannsprengingSentences.length === 0 && (
                  <p className="text-red-600">Fant ingenting.</p>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
