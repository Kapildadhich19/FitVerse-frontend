import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { ProductParserForm } from "@/features/product-parser/components/product-parser-form";

export default function TryOnPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container space-y-8 py-8">
        <ProtectedRoute>
          <section className="space-y-2">
            <p className="text-sm font-medium text-primary">Universal Product Parser</p>
            <h1 className="text-3xl font-semibold tracking-tight">Analyze a shopping product</h1>
            <p className="max-w-2xl text-muted-foreground">
              Paste a product URL from a supported store. FitVerse will normalize the product data before future
              virtual try-on workflows.
            </p>
          </section>
          <ProductParserForm />
        </ProtectedRoute>
      </div>
    </main>
  );
}
