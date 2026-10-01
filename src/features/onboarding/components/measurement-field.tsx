import { Info } from "lucide-react";
import type { Path, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DigitalTwinValues } from "@/features/onboarding/schemas/digital-twin.schema";

type MeasurementFieldProps = {
  name: Path<DigitalTwinValues>;
  label: string;
  unitLabel: string;
  tooltip: string;
  error?: string;
  register: UseFormRegister<DigitalTwinValues>;
};

export function MeasurementField({ name, label, unitLabel, tooltip, error, register }: MeasurementFieldProps) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={name}>{label}</Label>
          <p className="text-xs text-muted-foreground">{unitLabel}</p>
        </div>
        <button
          type="button"
          title={tooltip}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`${label} measurement guidance`}
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-3 flex h-20 items-center justify-center rounded-md border border-dashed bg-muted/40 text-xs text-muted-foreground">
        Illustration placeholder
      </div>
      <Input id={name} inputMode="decimal" type="number" step="0.1" min="0" {...register(name, { valueAsNumber: true })} />
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
