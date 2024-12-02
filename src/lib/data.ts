import { info } from "./utslippInfo";
import { z } from "zod";
import norskeUtslipp from "../../public/data/json/norskeUtslipp.json";

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
  CreationDate: string;
  Tillatelser: string;
  Kontroller: string;
  PDFAnalysis: PDFAnalysisType;
};

export const getInfo = async () => {
  const preprocessedData = (norskeUtslipp as UtslippItem[]).map((item) => ({
    ...item,
    id: String(item.id),
    Tillatelser: item.Tillatelser?.startsWith("http")
      ? item.Tillatelser
      : "No Link Available",
    PDFAnalysis: item.PDFAnalysis || { sentences: [], count: 0 },
  }));

  return z.array(info).parse(preprocessedData);
};

type HavnemagasinetItem = {
  link: string;
  storytitle: string;
};

export const getHavnemagasinet = async () => {
  const data = await fetch("havnemagasinet.json")
    .then((res) => res.json())
    .then((res) => res as HavnemagasinetItem[]);

  return data;
};
