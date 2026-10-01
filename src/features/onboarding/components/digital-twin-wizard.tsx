"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Save, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type Path } from "react-hook-form";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/http/axios-client";
import {
  bodyTypeOptions,
  clothingFitOptions,
  eyeColorOptions,
  facialHairOptions,
  genderOptions,
  hairColorOptions,
  hairStyleOptions,
  lengthUnitOptions,
  skinToneOptions,
  weightUnitOptions
} from "@/features/onboarding/constants/onboarding-options";
import {
  convertLength,
  convertWeight,
  roundMeasurement
} from "@/features/onboarding/lib/unit-conversion";
import { MeasurementField } from "@/features/onboarding/components/measurement-field";
import { OnboardingReview } from "@/features/onboarding/components/onboarding-review";
import {
  OnboardingStepper,
  type OnboardingStep
} from "@/features/onboarding/components/onboarding-stepper";
import {
  digitalTwinSchema,
  type MeasurementsValues,
  type DigitalTwinValues
} from "@/features/onboarding/schemas/digital-twin.schema";
import {
  useCompleteDigitalTwinMutation,
  useDigitalTwin,
  useSaveAppearanceMutation,
  useSaveBasicInfoMutation,
  useSaveMeasurementsMutation
} from "@/features/onboarding/hooks/use-digital-twin";

const steps: readonly OnboardingStep[] = [
  { id: "welcome", label: "Welcome", description: "Create your fit profile before your first virtual try-on." },
  { id: "basic", label: "Basic Information", description: "Tell FitVerse how to personalize your Digital Twin." },
  { id: "measurements", label: "Body Measurements", description: "Add garment-critical measurements with unit conversion." },
  { id: "appearance", label: "Appearance", description: "Capture styling attributes for a complete fit profile." },
  { id: "review", label: "Review", description: "Confirm everything before saving your Digital Twin." }
];

const profileFields: Array<Path<DigitalTwinValues>> = [
  "profile.firstName",
  "profile.lastName",
  "profile.gender",
  "profile.dateOfBirth",
  "profile.country",
  "profile.preferredLength",
  "profile.preferredWeight"
];

const measurementFields: Array<Path<DigitalTwinValues>> = [
  "measurements.height",
  "measurements.weight",
  "measurements.chest",
  "measurements.waist",
  "measurements.hip",
  "measurements.shoulderWidth",
  "measurements.neck",
  "measurements.armLength",
  "measurements.forearm",
  "measurements.wrist",
  "measurements.thigh",
  "measurements.calf",
  "measurements.inseam",
  "measurements.footLength",
  "measurements.lengthUnit",
  "measurements.weightUnit"
];

const appearanceFields: Array<Path<DigitalTwinValues>> = [
  "appearance.skinTone",
  "appearance.hairColor",
  "appearance.hairStyle",
  "appearance.eyeColor",
  "appearance.facialHair",
  "appearance.bodyType",
  "appearance.preferredClothingFit"
];

const measurementMeta = [
  ["measurements.height", "Height", "Stand straight from floor to crown."],
  ["measurements.chest", "Chest", "Measure around the fullest part of the chest."],
  ["measurements.waist", "Waist", "Measure around the natural waistline."],
  ["measurements.hip", "Hip", "Measure around the fullest part of the hips."],
  ["measurements.shoulderWidth", "Shoulder Width", "Measure shoulder point to shoulder point."],
  ["measurements.neck", "Neck", "Measure around the base of the neck."],
  ["measurements.armLength", "Arm Length", "Measure shoulder point to wrist with arm relaxed."],
  ["measurements.forearm", "Forearm", "Measure around the widest part of the forearm."],
  ["measurements.wrist", "Wrist", "Measure around the wrist bone."],
  ["measurements.thigh", "Thigh", "Measure around the widest part of the thigh."],
  ["measurements.calf", "Calf", "Measure around the widest part of the calf."],
  ["measurements.inseam", "Inseam", "Measure crotch seam to floor along the inside leg."],
  ["measurements.footLength", "Foot Length", "Measure heel to longest toe."]
] as const;

const emptyDefaults: DigitalTwinValues = {
  profile: {
    firstName: "",
    lastName: "",
    gender: "PREFER_NOT_TO_SAY",
    dateOfBirth: "",
    country: "",
    preferredLength: "CM",
    preferredWeight: "KG"
  },
  measurements: {
    height: 0,
    weight: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    shoulderWidth: 0,
    neck: 0,
    armLength: 0,
    forearm: 0,
    wrist: 0,
    thigh: 0,
    calf: 0,
    inseam: 0,
    footLength: 0,
    lengthUnit: "CM",
    weightUnit: "KG"
  },
  appearance: {
    skinTone: "",
    hairColor: "",
    hairStyle: "",
    eyeColor: "",
    facialHair: "None",
    bodyType: "",
    preferredClothingFit: "REGULAR"
  }
};

function getMeasurementError(
  errors: Partial<Record<keyof MeasurementsValues, { message?: string }>>,
  name: keyof MeasurementsValues
) {
  return errors[name]?.message;
}

function isStepWithAutosave(step: number) {
  return step === 1 || step === 2 || step === 3;
}

function getStepFields(step: number) {
  if (step === 1) {
    return profileFields;
  }

  if (step === 2) {
    return measurementFields;
  }

  if (step === 3) {
    return appearanceFields;
  }

  return [];
}

export function DigitalTwinWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const digitalTwinQuery = useDigitalTwin();
  const saveProfile = useSaveBasicInfoMutation();
  const saveMeasurements = useSaveMeasurementsMutation();
  const saveAppearance = useSaveAppearanceMutation();
  const completeDigitalTwin = useCompleteDigitalTwinMutation();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<DigitalTwinValues>({
    resolver: zodResolver(digitalTwinSchema),
    defaultValues: emptyDefaults,
    mode: "onBlur"
  });

  const watchedValues = useWatch({ control: form.control });
  const lengthUnit = form.watch("measurements.lengthUnit");
  const weightUnit = form.watch("measurements.weightUnit");

  useEffect(() => {
    const digitalTwin = digitalTwinQuery.data;

    if (!digitalTwin) {
      return;
    }

    form.reset({
      profile: {
        firstName: digitalTwin.firstName,
        lastName: digitalTwin.lastName,
        gender: digitalTwin.gender,
        dateOfBirth: digitalTwin.dateOfBirth.slice(0, 10),
        country: digitalTwin.country,
        preferredLength: digitalTwin.preferredLength,
        preferredWeight: digitalTwin.preferredWeight
      },
      measurements: digitalTwin.measurements ?? emptyDefaults.measurements,
      appearance: digitalTwin.appearance ?? emptyDefaults.appearance
    });
  }, [digitalTwinQuery.data, form]);

  const saveCurrentStep = useCallback(async (step = currentStep) => {
    const values = form.getValues();

    if (step === 1) {
      await saveProfile.mutateAsync(values.profile);
    }

    if (step === 2) {
      await saveMeasurements.mutateAsync(values.measurements);
    }

    if (step === 3) {
      await saveAppearance.mutateAsync(values.appearance);
    }
  }, [currentStep, form, saveAppearance, saveMeasurements, saveProfile]);

  useEffect(() => {
    if (!isStepWithAutosave(currentStep)) {
      return;
    }

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
      void (async () => {
        const isValid = await form.trigger(getStepFields(currentStep), { shouldFocus: false });

        if (!isValid) {
          return;
        }

        setSaveStatus("saving");

        try {
          await saveCurrentStep(currentStep);
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      })();
    }, 900);

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [watchedValues, currentStep, form, saveCurrentStep]);

  function convertLengthUnits(nextUnit: "CM" | "IN") {
    const previousUnit = form.getValues("measurements.lengthUnit");
    measurementMeta.forEach(([name]) => {
      const value = form.getValues(name);
      if (typeof value === "number" && value > 0) {
        form.setValue(name, roundMeasurement(convertLength(value, previousUnit, nextUnit)), { shouldDirty: true });
      }
    });
    form.setValue("measurements.lengthUnit", nextUnit, { shouldDirty: true });
    form.setValue("profile.preferredLength", nextUnit, { shouldDirty: true });
  }

  function convertWeightUnits(nextUnit: "KG" | "LB") {
    const previousUnit = form.getValues("measurements.weightUnit");
    const value = form.getValues("measurements.weight");
    if (value > 0) {
      form.setValue("measurements.weight", roundMeasurement(convertWeight(value, previousUnit, nextUnit)), { shouldDirty: true });
    }
    form.setValue("measurements.weightUnit", nextUnit, { shouldDirty: true });
    form.setValue("profile.preferredWeight", nextUnit, { shouldDirty: true });
  }

  async function goNext() {
    const fields = getStepFields(currentStep);

    if (fields.length > 0) {
      const isValid = await form.trigger(fields, { shouldFocus: true });

      if (!isValid) {
        return;
      }

      setSaveStatus("saving");
      await saveCurrentStep();
      setSaveStatus("saved");
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  async function finish() {
    const isValid = await form.trigger(undefined, { shouldFocus: true });

    if (!isValid) {
      return;
    }

    await completeDigitalTwin.mutateAsync(form.getValues());
  }

  const formError = useMemo(() => {
    const error = saveProfile.error ?? saveMeasurements.error ?? saveAppearance.error ?? completeDigitalTwin.error;
    return error ? getApiErrorMessage(error) : null;
  }, [saveProfile.error, saveMeasurements.error, saveAppearance.error, completeDigitalTwin.error]);

  if (digitalTwinQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <OnboardingStepper steps={steps} currentStep={currentStep} />
      <form className="rounded-lg border bg-background p-5 shadow-sm md:p-8" onSubmit={(event) => event.preventDefault()}>
        <div className="mb-5 flex min-h-6 items-center justify-between gap-4 text-sm">
          <div className="text-muted-foreground">
            {saveStatus === "saving" ? "Autosaving..." : null}
            {saveStatus === "saved" ? "Autosaved" : null}
            {saveStatus === "error" ? <span className="text-destructive">Autosave failed</span> : null}
          </div>
          {formError ? <p className="text-destructive">{formError}</p> : null}
        </div>

        {currentStep === 0 ? (
          <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">Build your Digital Twin Profile</h2>
              <p className="max-w-2xl text-muted-foreground">
                FitVerse uses body measurements and appearance preferences to prepare accurate virtual try-on
                experiences. You can review everything before saving.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5 text-sm text-card-foreground">
              <p className="font-medium">What you will complete</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>Basic identity and preferred units</li>
                <li>Garment-critical body measurements</li>
                <li>Appearance and clothing fit preferences</li>
                <li>Final review before dashboard</li>
              </ul>
            </div>
          </section>
        ) : null}

        {currentStep === 1 ? (
          <section className="grid gap-5 md:grid-cols-2">
            <FormField id="firstName" label="First Name" error={form.formState.errors.profile?.firstName?.message}>
              <Input id="firstName" {...form.register("profile.firstName")} />
            </FormField>
            <FormField id="lastName" label="Last Name" error={form.formState.errors.profile?.lastName?.message}>
              <Input id="lastName" {...form.register("profile.lastName")} />
            </FormField>
            <FormField id="gender" label="Gender" error={form.formState.errors.profile?.gender?.message}>
              <Select id="gender" options={genderOptions} {...form.register("profile.gender")} />
            </FormField>
            <FormField id="dateOfBirth" label="Date of Birth" error={form.formState.errors.profile?.dateOfBirth?.message}>
              <Input id="dateOfBirth" type="date" {...form.register("profile.dateOfBirth")} />
            </FormField>
            <FormField id="country" label="Country" error={form.formState.errors.profile?.country?.message}>
              <Input id="country" autoComplete="country-name" {...form.register("profile.country")} />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="preferredLength" label="Length Unit" error={form.formState.errors.profile?.preferredLength?.message}>
                <Select id="preferredLength" options={lengthUnitOptions} {...form.register("profile.preferredLength")} />
              </FormField>
              <FormField id="preferredWeight" label="Weight Unit" error={form.formState.errors.profile?.preferredWeight?.message}>
                <Select id="preferredWeight" options={weightUnitOptions} {...form.register("profile.preferredWeight")} />
              </FormField>
            </div>
          </section>
        ) : null}

        {currentStep === 2 ? (
          <section className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <Select
                aria-label="Length unit"
                className="w-48"
                options={lengthUnitOptions}
                value={lengthUnit}
                onChange={(event) => convertLengthUnits(event.target.value as "CM" | "IN")}
              />
              <Select
                aria-label="Weight unit"
                className="w-48"
                options={weightUnitOptions}
                value={weightUnit}
                onChange={(event) => convertWeightUnits(event.target.value as "KG" | "LB")}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MeasurementField
                name="measurements.weight"
                label="Weight"
                unitLabel={weightUnit}
                tooltip="Use a recent body weight measurement."
                register={form.register}
                error={form.formState.errors.measurements?.weight?.message}
              />
              {measurementMeta.map(([name, label, tooltip]) => (
                <MeasurementField
                  key={name}
                  name={name}
                  label={label}
                  unitLabel={lengthUnit}
                  tooltip={tooltip}
                  register={form.register}
                  error={getMeasurementError(
                    form.formState.errors.measurements ?? {},
                    name.replace("measurements.", "") as keyof MeasurementsValues
                  )}
                />
              ))}
            </div>
          </section>
        ) : null}

        {currentStep === 3 ? (
          <section className="grid gap-5 md:grid-cols-2">
            <FormField id="skinTone" label="Skin Tone" error={form.formState.errors.appearance?.skinTone?.message}>
              <Select id="skinTone" options={skinToneOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.skinTone")} placeholder="Select skin tone" />
            </FormField>
            <FormField id="hairColor" label="Hair Color" error={form.formState.errors.appearance?.hairColor?.message}>
              <Select id="hairColor" options={hairColorOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.hairColor")} placeholder="Select hair color" />
            </FormField>
            <FormField id="hairStyle" label="Hair Style" error={form.formState.errors.appearance?.hairStyle?.message}>
              <Select id="hairStyle" options={hairStyleOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.hairStyle")} placeholder="Select hair style" />
            </FormField>
            <FormField id="eyeColor" label="Eye Color" error={form.formState.errors.appearance?.eyeColor?.message}>
              <Select id="eyeColor" options={eyeColorOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.eyeColor")} placeholder="Select eye color" />
            </FormField>
            <FormField id="facialHair" label="Facial Hair" error={form.formState.errors.appearance?.facialHair?.message}>
              <Select id="facialHair" options={facialHairOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.facialHair")} />
            </FormField>
            <FormField id="bodyType" label="Body Type" error={form.formState.errors.appearance?.bodyType?.message}>
              <Select id="bodyType" options={bodyTypeOptions.map((value) => ({ value, label: value }))} {...form.register("appearance.bodyType")} placeholder="Select body type" />
            </FormField>
            <FormField id="preferredClothingFit" label="Preferred Clothing Fit" error={form.formState.errors.appearance?.preferredClothingFit?.message}>
              <Select id="preferredClothingFit" options={clothingFitOptions} {...form.register("appearance.preferredClothingFit")} />
            </FormField>
          </section>
        ) : null}

        {currentStep === 4 ? <OnboardingReview values={form.getValues()} onEditStep={setCurrentStep} /> : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={() => void goNext()}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" disabled={completeDigitalTwin.isPending} onClick={() => void finish()}>
              {completeDigitalTwin.isPending ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {completeDigitalTwin.isPending ? "Saving..." : "Finish"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
