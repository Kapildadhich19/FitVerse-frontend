"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/http/axios-client";
import { useProductParserMutation } from "@/features/product-parser/hooks/use-product-parser";
import {
  parseProductSchema,
  type ParseProductValues
} from "@/features/product-parser/schemas/product-parser.schema";
import { ProductResult } from "@/features/product-parser/components/product-result";
import { ProductParserLoading } from "@/features/product-parser/components/product-parser-loading";

export function ProductParserForm() {
  const parserMutation = useProductParserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<ParseProductValues>({
    resolver: zodResolver(parseProductSchema),
    defaultValues: {
      url: ""
    }
  });

  function onSubmit(values: ParseProductValues) {
    parserMutation.mutate(values);
  }

  const isLoading = isSubmitting || parserMutation.isPending;

  return (
    <div className="space-y-6">
      <form className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <FormField id="productUrl" label="Shopping URL" error={errors.url?.message}>
            <Input
              id="productUrl"
              type="url"
              placeholder="https://www.store.com/product/..."
              autoComplete="url"
              {...register("url")}
            />
          </FormField>
          <div className="flex items-end gap-2">
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4" />
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
            {parserMutation.isError ? (
              <Button type="button" variant="outline" onClick={() => parserMutation.mutate(getValues())}>
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            ) : null}
          </div>
        </div>
        {parserMutation.isError ? (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {getApiErrorMessage(parserMutation.error)}
          </p>
        ) : null}
      </form>

      {isLoading ? <ProductParserLoading /> : null}
      {parserMutation.data ? <ProductResult product={parserMutation.data} /> : null}
    </div>
  );
}
