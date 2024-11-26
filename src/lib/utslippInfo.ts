import { z } from "zod";

const keywordAnalysis = z.object({
  sentences: z.string().array().optional(),
  count: z.number().optional(),
});

const pdfAnalysis = z
  .record(keywordAnalysis)
  .or(
    z.object({
      error: z.string(),
    })
  )
  .optional();

export const info = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  Virksomhet: z.string().min(1),
  Sektor: z.string().min(1),
  Fylke: z.string().min(1),
  Kommune: z.string().min(1),
  CreationDate: z
    .string()
    .nullable()
    .default(null)
    .transform((val) => {
      if (!val) {
        return new Date().toLocaleDateString("en-GB");
      }
      const [day, month, year] = val.split("-").map(Number);
      return new Date(year, month - 1, day).toLocaleDateString("en-GB");
    }),
  Tillatelser: z.string().url().or(z.literal("No Link Available")),
  Kontroller: z.string().url().or(z.literal("No Link Available")),
  PDFAnalysis: pdfAnalysis,
});

export type UtslippInfo = z.infer<typeof info>;
