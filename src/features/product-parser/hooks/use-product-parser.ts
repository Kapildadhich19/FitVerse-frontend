import { useMutation } from "@tanstack/react-query";

import { parseProduct } from "@/features/product-parser/api/product-parser.api";

export function useProductParserMutation() {
  return useMutation({
    mutationFn: parseProduct
  });
}
