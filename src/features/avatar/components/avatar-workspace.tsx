'use client';

import { Box, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiErrorMessage } from '@/lib/http/axios-client';
import { avatarPhotoTypes } from '@/features/avatar/constants/avatar-photo-types';
import { AvatarPhotoCard } from '@/features/avatar/components/avatar-photo-card';
import { AvatarStatusCard } from '@/features/avatar/components/avatar-status-card';
import { AvatarViewer } from '@/features/avatar/components/avatar-viewer';
import {
  useAvatar,
  useAvatarStatus,
  useGenerateAvatarMutation,
} from '@/features/avatar/hooks/use-avatar';

export function AvatarWorkspace() {
  const avatarQuery = useAvatar();
  const avatarStatus = useAvatarStatus();
  const generateMutation = useGenerateAvatarMutation();
  const avatar = avatarStatus.data?.avatar ?? avatarQuery.data ?? null;
  const status = avatarStatus.data?.status ?? avatar?.status ?? 'queued';
  const uploadedTypes = new Set(
    avatar?.photos.map((photo) => photo.type) ?? [],
  );
  const isCompletePhotoSet = avatarPhotoTypes.every((photoType) =>
    uploadedTypes.has(photoType.type),
  );
  const generateError = generateMutation.error
    ? getApiErrorMessage(generateMutation.error)
    : null;

  if (avatarQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-72" />
        <div className="grid gap-4 lg:grid-cols-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-lg border bg-card p-6 text-card-foreground md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Avatar infrastructure
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Upload avatar reference photos
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Add front, right, back, and left photos to build a textured 3D
            avatar from all four views.
          </p>
        </div>
        <Button
          type="button"
          disabled={
            !isCompletePhotoSet ||
            generateMutation.isPending ||
            status === 'processing'
          }
          onClick={() => generateMutation.mutate()}
        >
          <Sparkles className="h-4 w-4" />
          {generateMutation.isPending || status === 'processing'
            ? 'Generating...'
            : 'Generate Avatar'}
        </Button>
      </section>

      {generateError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {generateError}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {avatarPhotoTypes.map((photoType) => (
            <AvatarPhotoCard
              key={photoType.type}
              type={photoType.type}
              title={photoType.title}
              description={photoType.description}
              photo={avatar?.photos.find(
                (photo) => photo.type === photoType.type,
              )}
            />
          ))}
        </div>
        <aside className="space-y-6">
          <AvatarStatusCard status={status} />
          <section className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Photo set</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {uploadedTypes.size}/4 required angles uploaded. Complete all four
              to queue generation.
            </p>
          </section>
        </aside>
      </div>

      {avatar ? <AvatarViewer modelUrl={avatar.modelUrl} /> : null}
    </div>
  );
}
