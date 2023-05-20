import { z } from "zod";

export const StockSchema = z.object({
  mill: z.string(),
  quality: z.string().trim(),
  breadth: z.number().positive(),
  length: z.number().nonnegative().nullable(),
  weight: z.number().positive(),
  gsm: z.number().positive().min(100),
  sheets: z.number().nonnegative().min(10),
  quantity: z.number().nonnegative().min(0),
});

export const StockArrSchema = z.array(StockSchema);

export type Stock = z.infer<typeof StockSchema>;
export type StockArr = z.infer<typeof StockArrSchema>;
