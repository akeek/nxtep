"use client";

import { useState } from "react";
import { type UtslippInfo } from "../lib/utslippInfo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import Link from "next/link";

export const UtslippCard = ({
  item: {
    Virksomhet,
    Sektor,
    Fylke,
    Kommune,
    Tillatelser,
    Kontroller,
    PDFAnalysis,
  },
}: {
  item: UtslippInfo;
}) => {
  const [expandedKeywords, setExpandedKeywords] = useState<
    Record<string, boolean>
  >({});

  const hasPDFAnalysis = PDFAnalysis && Object.keys(PDFAnalysis).length > 0;

  if (!hasPDFAnalysis) {
    return null;
  }

  return (
    <Card className="bg-slate-50">
      <CardHeader>
        <CardTitle>
          <h2 className="font-bold pb-1">{Virksomhet}</h2>
        </CardTitle>
        <p>Fylke: {Fylke}</p>
        <p>Kommune: {Kommune}</p>

        {Kontroller && Kontroller !== "No Link Available" ? (
          <Button
            variant="outline"
            className="bg-green-200 hover:bg-green-500 hover:text-white w-56 mb-2"
          >
            <Link href={Kontroller} target="_blank" rel="noopener noreferrer">
              Gå til kontrollen som ble funnet
            </Link>
          </Button>
        ) : (
          <p>Kontrolldokument: Ikke funnet</p>
        )}
        <Button
          variant="outline"
          className="bg-green-200 hover:bg-green-500 hover:text-white w-56"
        >
          <Link href={Tillatelser} target="_blank" rel="noopener noreferrer">
            Gå til tillatelsen som ble funnet
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">PDF data:</h3>
        <div className="mt-2">
          {Object.entries(PDFAnalysis).map(([keyword, analysis]) => {
            // Ensure we check for analysis properties safely
            if (typeof analysis !== "object" || !analysis) return null;

            return (
              <div key={keyword} className="mb-4">
                <p className="pb-3">
                  <span>
                    {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                  </span>{" "}
                  funnet i {analysis.count ?? 0} setninger
                </p>
                <Button
                  variant="outline"
                  className="bg-green-200 hover:bg-green-500 hover:text-white"
                  onClick={() =>
                    setExpandedKeywords((prev) => ({
                      ...prev,
                      [keyword]: !prev[keyword],
                    }))
                  }
                >
                  {expandedKeywords[keyword]
                    ? `Skjul setninger for "${keyword}"`
                    : `Vis setninger for "${keyword}"`}
                </Button>
                {expandedKeywords[keyword] &&
                  analysis.sentences?.length > 0 && (
                    <ul className="list-disc list-inside mt-2">
                      {analysis.sentences?.map(
                        (sentence: string, idx: number) => (
                          <li key={idx}>{sentence}</li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
