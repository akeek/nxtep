import { info } from "./utslippInfo";
import { z } from "zod";
import norskeUtslipp from "../../public/data/json/norskeUtslipp.json";

// Define the types for the data structure
type PDFAnalysisType = {
  sentences?: string[];
  count?: number;
  error?: string;
};

type UtslippItem = {
  id: string | number;
  Virksomhet: string;
  Sektor: string;
  Fylke: string;
  Kommune: string;
  Tillatelser: string;
  Kontroller: string;
  PDFAnalysis: PDFAnalysisType;
};

// Ensure TypeScript understands the shape of the imported JSON
export const getInfo = async () => {
  // Type assertion to indicate that norskeUtslipp is an array of UtslippItem
  const preprocessedData = (norskeUtslipp as UtslippItem[]).map((item) => ({
    ...item,
    id: String(item.id), // Ensures the id is a string
    Tillatelser: item.Tillatelser?.startsWith("http")
      ? item.Tillatelser
      : "No Link Available", // Validates the Tillatelser field
    PDFAnalysis: item.PDFAnalysis || { sentences: [], count: 0 }, // Fallback if PDFAnalysis is missing
  }));

  // Parse the preprocessed data using the Zod schema
  return z.array(info).parse(preprocessedData);
};
