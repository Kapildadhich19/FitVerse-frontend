import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  completeDigitalTwin,
  getDigitalTwin,
  saveAppearance,
  saveBasicInfo,
  saveMeasurements
} from "@/features/onboarding/api/digital-twin.api";
import type {
  AppearanceValues,
  BasicInfoValues,
  MeasurementsValues
} from "@/features/onboarding/schemas/digital-twin.schema";
import { useToast } from "@/components/ui/toast";

export const digitalTwinQueryKeys = {
  all: ["digital-twin"] as const,
  detail: ["digital-twin", "detail"] as const
};

export function useDigitalTwin() {
  return useQuery({
    queryKey: digitalTwinQueryKeys.detail,
    queryFn: getDigitalTwin,
    retry: false,
    staleTime: 30_000
  });
}

function useStepMutation<TInput>(mutationFn: (input: TInput) => Promise<unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (digitalTwin) => {
      queryClient.setQueryData(digitalTwinQueryKeys.detail, digitalTwin);
    }
  });
}

export function useSaveBasicInfoMutation() {
  return useStepMutation<BasicInfoValues>(saveBasicInfo);
}

export function useSaveMeasurementsMutation() {
  return useStepMutation<MeasurementsValues>(saveMeasurements);
}

export function useSaveAppearanceMutation() {
  return useStepMutation<AppearanceValues>(saveAppearance);
}

export function useCompleteDigitalTwinMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: completeDigitalTwin,
    onSuccess: (digitalTwin) => {
      queryClient.setQueryData(digitalTwinQueryKeys.detail, digitalTwin);
      toast({ title: "Digital Twin complete", description: "Your fit profile is ready." });
      router.replace("/dashboard");
    }
  });
}
