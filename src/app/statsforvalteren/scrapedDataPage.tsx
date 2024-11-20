import { useEffect, useState } from "react";

const ScrapedDataPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdfs, setShowPdfs] = useState<boolean>(false);
  const [visibleLinks, setVisibleLinks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/fetchScrapedData");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await res.json();
        console.log(result);
        setData(result);
      } catch (err) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleTogglePdfs = () => {
    setShowPdfs(!showPdfs);
  };

  const toggleLinks = (index: number) => {
    setVisibleLinks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="container mx-auto my-6">
      <div className="p-6">
        <h2 className="text-center text-3xl font-bold py-6">
          Saker hos statsforvalteren:
        </h2>

        <div>
          <ul className="pt-3 grid grid-cols-1 sm:grid-cols-2">
            {data.jsonData.map((item: any, index: number) => (
              <li key={index} className="m-4 border rounded-xl p-3 h-auto">
                {item.pageTitle && (
                  <div>
                    <h3 className="text-xl mb-2">{item.pageTitle}</h3>
                    <button
                      onClick={() => toggleLinks(index)}
                      className="bg-green-50 px-3 py-1 rounded hover:bg-green-500 hover:text-white relative"
                    >
                      {visibleLinks[index] ? "Gjem " : "Vis "}
                      {item.links.length} høringer
                    </button>
                  </div>
                )}

                {visibleLinks[index] && item.links.length > 0 && (
                  <div className="mt-3">
                    {item.links.map((link: any, linkIndex: number) => (
                      <div key={linkIndex}>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          - {link.hoeringTitle}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {!visibleLinks[index] && item.links.length === 0 && (
                  <p className="mt-2">No links available.</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* <div className="py-6">
        <h2 className="text-center text-xl font-bold">PDFs:</h2>
        <div className="p-6">
          {data.pdfs.length > 0 ? (
            <>
              <button
                onClick={handleTogglePdfs}
                className="text-blue-500 py-2 px-4 border rounded hover:bg-blue-100 mt-4"
              >
                {showPdfs ? "Hide PDFs" : `Show ${data.pdfs.length} PDF(s)`}
              </button>

              {showPdfs && (
                <ul className="mt-4">
                  {data.pdfs.map((pdf: string, index: number) => (
                    <li key={index} className="mb-2">
                      <a
                        href={`/data/pdfs/statsforvalteren/hoeringer/${pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {pdf}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>No PDFs available.</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ScrapedDataPage;
