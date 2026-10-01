import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductParserLoading() {
  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <div>
          <h2 className="font-semibold">Analyzing product page</h2>
          <p className="text-sm text-muted-foreground">Fetching metadata, images, price, sizes, and colors.</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-80" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
