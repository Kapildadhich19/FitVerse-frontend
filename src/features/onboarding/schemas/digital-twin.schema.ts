import { z } from "zod";

export const genderSchema = z.enum(["FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]);
export const lengthUnitSchema = z.enum(["CM", "IN"]);
export const weightUnitSchema = z.enum(["KG", "LB"]);
export const clothingFitSchema = z.enum(["SLIM", "REGULAR", "RELAXED", "OVERSIZED"]);

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required.`);
const positiveNumber = (label: string) =>
  z.coerce.number({ invalid_type_error: `${label} is required.` }).positive(`${label} must be greater than 0.`);

export const basicInfoSchema = z.object({
  firstName: requiredText("First name").max(80),
  lastName: requiredText("Last name").max(80),
  gender: genderSchema,
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  country: requiredText("Country").max(80),
  preferredLength: lengthUnitSchema,
  preferredWeight: weightUnitSchema
});

export const measurementsSchema = z.object({
  height: positiveNumber("Height"),
  weight: positiveNumber("Weight"),
  chest: positiveNumber("Chest"),
  waist: positiveNumber("Waist"),
  hip: positiveNumber("Hip"),
  shoulderWidth: positiveNumber("Shoulder width"),
  neck: positiveNumber("Neck"),
  armLength: positiveNumber("Arm length"),
  forearm: positiveNumber("Forearm"),
  wrist: positiveNumber("Wrist"),
  thigh: positiveNumber("Thigh"),
  calf: positiveNumber("Calf"),
  inseam: positiveNumber("Inseam"),
  footLength: positiveNumber("Foot length"),
  lengthUnit: lengthUnitSchema,
  weightUnit: weightUnitSchema
});

export const appearanceSchema = z.object({
  skinTone: requiredText("Skin tone"),
  hairColor: requiredText("Hair color"),
  hairStyle: requiredText("Hair style"),
  eyeColor: requiredText("Eye color"),
  facialHair: requiredText("Facial hair"),
  bodyType: requiredText("Body type"),
  preferredClothingFit: clothingFitSchema
});

export const digitalTwinSchema = z.object({
  profile: basicInfoSchema,
  measurements: measurementsSchema,
  appearance: appearanceSchema
});

export type BasicInfoValues = z.infer<typeof basicInfoSchema>;
export type MeasurementsValues = z.infer<typeof measurementsSchema>;
export type AppearanceValues = z.infer<typeof appearanceSchema>;
export type DigitalTwinValues = z.infer<typeof digitalTwinSchema>;
