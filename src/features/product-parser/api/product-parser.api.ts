import { api } from "@/lib/http/axios-client";
import type { ParseProductValues } from "@/features/product-parser/schemas/product-parser.schema";

export type ParsedProduct = {
  id: string;
  title: string;
  brand: string | null;
  category: string | null;
  gender: string | null;
  description: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  price: number | null;
  currency: string | null;
  source: string;
  sourceUrl: string;
};

export function parseProduct(payload: ParseProductValues) {
  return api.post<ParsedProduct>("/products/parse", payload).then((response) => response.data);
}
