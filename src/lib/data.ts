import { info } from "./utslippInfo";
import { z } from "zod";
import norskeUtslipp from "../../public/data/json/norskeUtslipp.json";

export const getInfo = async () => {
  const preprocessedData = norskeUtslipp.map((item: any) => ({
    ...item,
    id: String(item.id),
    Tillatelser: item.Tillatelser?.startsWith("http")
      ? item.Tillatelser
      : "No Link Available",
    PDFAnalysis: item.PDFAnalysis || { sentences: [], count: 0 },
  }));

  return z.array(info).parse(preprocessedData);
};
