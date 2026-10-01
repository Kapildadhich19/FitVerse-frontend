import Image from "next/image";
import { ExternalLink, PackageSearch, Palette, Ruler } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ParsedProduct } from "@/features/product-parser/api/product-parser.api";

function formatPrice(price: number | null, currency: string | null) {
  if (price === null) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency ?? "USD"
    }).format(price);
  } catch {
    return `${currency ?? ""} ${price.toFixed(2)}`.trim();
  }
}

function DetailChips({ icon: Icon, title, values }: { icon: typeof Palette; title: string; values: string[] }) {
  return (
    <section className="rounded-lg border bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="rounded-md border bg-muted px-2.5 py-1 text-sm">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Not found on the product page.</p>
      )}
    </section>
  );
}

export function ProductResult({ product }: Readonly<{ product: ParsedProduct }>) {
  const primaryImage = product.images[0];

  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {primaryImage ? (
              <Image src={primaryImage} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 360px" />
            ) : (
              <PackageSearch className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image) => (
                <div key={image} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                  <Image src={image} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">{product.source}</span>
              {product.brand ? <span>{product.brand}</span> : null}
              {product.category ? <span>{product.category}</span> : null}
              {product.gender ? <span>{product.gender}</span> : null}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">{product.title}</h2>
            <p className="text-xl font-semibold">{formatPrice(product.price, product.currency)}</p>
          </div>

          {product.description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{product.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No product description was found.</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <DetailChips icon={Palette} title="Available colors" values={product.colors} />
            <DetailChips icon={Ruler} title="Available sizes" values={product.sizes} />
          </div>

          <Button asChild variant="outline">
            <a href={product.sourceUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open product page
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
