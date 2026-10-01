import { Button } from "@/components/ui/button";
import type { DigitalTwinValues } from "@/features/onboarding/schemas/digital-twin.schema";

type ReviewSectionProps = {
  title: string;
  items: Array<{ label: string; value: string | number }>;
  onEdit: () => void;
};

function ReviewSection({ title, items, onEdit }: ReviewSectionProps) {
  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type OnboardingReviewProps = {
  values: DigitalTwinValues;
  onEditStep: (step: number) => void;
};

export function OnboardingReview({ values, onEditStep }: OnboardingReviewProps) {
  return (
    <div className="space-y-4">
      <ReviewSection
        title="Basic information"
        onEdit={() => onEditStep(1)}
        items={[
          { label: "Name", value: `${values.profile.firstName} ${values.profile.lastName}` },
          { label: "Gender", value: values.profile.gender },
          { label: "Date of birth", value: values.profile.dateOfBirth },
          { label: "Country", value: values.profile.country },
          { label: "Length unit", value: values.profile.preferredLength },
          { label: "Weight unit", value: values.profile.preferredWeight }
        ]}
      />
      <ReviewSection
        title="Measurements"
        onEdit={() => onEditStep(2)}
        items={[
          { label: "Height", value: `${values.measurements.height} ${values.measurements.lengthUnit}` },
          { label: "Weight", value: `${values.measurements.weight} ${values.measurements.weightUnit}` },
          { label: "Chest", value: values.measurements.chest },
          { label: "Waist", value: values.measurements.waist },
          { label: "Hip", value: values.measurements.hip },
          { label: "Inseam", value: values.measurements.inseam }
        ]}
      />
      <ReviewSection
        title="Appearance"
        onEdit={() => onEditStep(3)}
        items={[
          { label: "Skin tone", value: values.appearance.skinTone },
          { label: "Hair", value: `${values.appearance.hairColor}, ${values.appearance.hairStyle}` },
          { label: "Eye color", value: values.appearance.eyeColor },
          { label: "Facial hair", value: values.appearance.facialHair },
          { label: "Body type", value: values.appearance.bodyType },
          { label: "Fit", value: values.appearance.preferredClothingFit }
        ]}
      />
    </div>
  );
}
