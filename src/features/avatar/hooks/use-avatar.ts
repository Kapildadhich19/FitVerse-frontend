import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosProgressEvent } from 'axios';

import {
  deleteAvatarPhoto,
  generateAvatar,
  getAvatar,
  getAvatarStatus,
  uploadAvatarPhoto,
} from '@/features/avatar/api/avatar.api';
import type { AvatarPhotoType } from '@/features/avatar/schemas/avatar.schema';
import { useToast } from '@/components/ui/toast';

export const avatarQueryKeys = {
  all: ['avatar'] as const,
  detail: ['avatar', 'detail'] as const,
  status: ['avatar', 'status'] as const,
};

export function useAvatar() {
  return useQuery({
    queryKey: avatarQueryKeys.detail,
    queryFn: getAvatar,
    retry: false,
    staleTime: 15_000,
  });
}

export function useAvatarStatus() {
  return useQuery({
    queryKey: avatarQueryKeys.status,
    queryFn: getAvatarStatus,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'queued' || status === 'processing' ? 5000 : false;
    },
  });
}

export function useUploadAvatarPhotoMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: {
      type: AvatarPhotoType;
      file: File;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => uploadAvatarPhoto(input, input.onUploadProgress),
    onSuccess: (data) => {
      queryClient.setQueryData(avatarQueryKeys.detail, data.avatar);
      queryClient.invalidateQueries({ queryKey: avatarQueryKeys.status });
      toast({
        title: 'Photo uploaded',
        description: 'Your avatar photo set has been updated.',
      });
    },
  });
}

export function useDeleteAvatarPhotoMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteAvatarPhoto,
    onSuccess: (avatar) => {
      queryClient.setQueryData(avatarQueryKeys.detail, avatar);
      queryClient.invalidateQueries({ queryKey: avatarQueryKeys.status });
      toast({
        title: 'Photo deleted',
        description: 'The photo was removed from your avatar set.',
      });
    },
  });
}

export function useGenerateAvatarMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: generateAvatar,
    onSuccess: (avatar) => {
      queryClient.setQueryData(avatarQueryKeys.detail, avatar);
      queryClient.invalidateQueries({ queryKey: avatarQueryKeys.status });
      toast({
        title: 'Avatar generation started',
        description: 'Your four photos are being processed.',
      });
    },
  });
}
