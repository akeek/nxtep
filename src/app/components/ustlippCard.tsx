"use client";

import { useState } from "react";
import { Item } from "../norskeUtslipp/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import Link from "next/link";

export const UtslippCard = ({
  item: {
    Virksomhet,
    CreationDate,
    Fylke,
    Kommune,
    Tillatelser,
    Kontroller,
    PDFAnalysis,
  },
}: {
  item: Item;
}) => {
  const [expandedKeywords, setExpandedKeywords] = useState<
    Record<string, boolean>
  >({});

  const hasPDFAnalysis = PDFAnalysis && Object.keys(PDFAnalysis).length > 0;

  if (!hasPDFAnalysis) {
    return null;
  }

  return (
    <Card className="hover:bg-green-50">
      <CardHeader>
        <CardTitle>
          <h2 className="font-bold pb-1">{Virksomhet}</h2>
        </CardTitle>
        <p>Tillatelsedato: {CreationDate}</p>
        <p>Fylke: {Fylke}</p>
        <p>Kommune: {Kommune}</p>

        {Kontroller && Kontroller !== "No Link Available" ? (
          <Button
            variant="outline"
            className="bg-green-200 hover:bg-green-500 hover:text-white w-40 mb-2"
          >
            <Link href={Kontroller} target="_blank" rel="noopener noreferrer">
              Gå til kontrollen
            </Link>
          </Button>
        ) : (
          <p>Kontrolldokument: Ikke funnet</p>
        )}
        <Button
          variant="outline"
          className="bg-green-200 hover:bg-green-500 hover:text-white w-36"
        >
          <Link href={Tillatelser} target="_blank" rel="noopener noreferrer">
            Gå til tillatelsen
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">PDF data:</h3>
        <div className="mt-2">
          {Object.entries(PDFAnalysis).map(([keyword, analysis]) => {
            if (typeof analysis !== "object" || !analysis) return null;

            return (
              <div key={keyword} className="">
                <p className="">
                  <span>
                    {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                  </span>{" "}
                  funnet i {analysis.count ?? 0} setninger
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
