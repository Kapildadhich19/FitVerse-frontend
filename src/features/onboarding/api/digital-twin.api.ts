import { api } from "@/lib/http/axios-client";
import type {
  AppearanceValues,
  BasicInfoValues,
  DigitalTwinValues,
  MeasurementsValues
} from "@/features/onboarding/schemas/digital-twin.schema";

export type DigitalTwinProfile = BasicInfoValues & {
  id: string;
  userId: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DigitalTwinMeasurements = MeasurementsValues & {
  id: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type DigitalTwinAppearance = AppearanceValues & {
  id: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type DigitalTwin = DigitalTwinProfile & {
  measurements: DigitalTwinMeasurements | null;
  appearance: DigitalTwinAppearance | null;
};

type DigitalTwinResponse = {
  digitalTwin: DigitalTwin | null;
};

export function getDigitalTwin() {
  return api.get<DigitalTwinResponse>("/digital-twin").then((response) => response.data.digitalTwin);
}

export function saveBasicInfo(payload: BasicInfoValues) {
  return api.put<DigitalTwinResponse>("/digital-twin/profile", payload).then((response) => response.data.digitalTwin);
}

export function saveMeasurements(payload: MeasurementsValues) {
  return api.put<DigitalTwinResponse>("/digital-twin/measurements", payload).then((response) => response.data.digitalTwin);
}

export function saveAppearance(payload: AppearanceValues) {
  return api.put<DigitalTwinResponse>("/digital-twin/appearance", payload).then((response) => response.data.digitalTwin);
}

export function completeDigitalTwin(payload: DigitalTwinValues) {
  return api.put<DigitalTwinResponse>("/digital-twin/complete", payload).then((response) => response.data.digitalTwin);
}
