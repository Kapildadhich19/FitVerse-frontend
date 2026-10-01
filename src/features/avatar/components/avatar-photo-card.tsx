'use client';

import { ImagePlus, RefreshCcw, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, type DragEvent } from 'react';

import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/http/axios-client';
import { env } from '@/config/env';
import type { AvatarPhoto } from '@/features/avatar/api/avatar.api';
import type { AvatarPhotoType } from '@/features/avatar/schemas/avatar.schema';
import {
  useDeleteAvatarPhotoMutation,
  useUploadAvatarPhotoMutation,
} from '@/features/avatar/hooks/use-avatar';

type AvatarPhotoCardProps = {
  type: AvatarPhotoType;
  title: string;
  description: string;
  photo?: AvatarPhoto;
};

function resolveImageUrl(fileUrl: string) {
  if (fileUrl.startsWith('http')) {
    return fileUrl;
  }

  return `${env.NEXT_PUBLIC_API_ORIGIN}${fileUrl}`;
}

export function AvatarPhotoCard({
  type,
  title,
  description,
  photo,
}: AvatarPhotoCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = useUploadAvatarPhotoMutation();
  const deleteMutation = useDeleteAvatarPhotoMutation();

  function uploadFile(file: File) {
    setProgress(0);
    uploadMutation.mutate({
      type,
      file,
      onUploadProgress: (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files.item(0);

    if (file) {
      uploadFile(file);
    }
  }

  const isUploading = uploadMutation.isPending;
  const error = uploadMutation.error ?? deleteMutation.error;

  return (
    <article
      className="rounded-lg border bg-card p-4 text-card-foreground"
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <ImagePlus className="h-4 w-4" />
        </div>
      </div>

      <div
        className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/40 ${
          isDragging ? 'border-primary bg-primary/5' : ''
        }`}
      >
        {photo ? (
          <Image
            src={resolveImageUrl(photo.fileUrl)}
            alt={`${title} avatar reference`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="px-4 text-center text-sm text-muted-foreground">
            <Upload className="mx-auto mb-2 h-7 w-7" />
            Drag a photo here
          </div>
        )}
      </div>

      {isUploading ? (
        <div className="mt-3 h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.item(0);
          if (file) {
            uploadFile(file);
          }
          event.target.value = '';
        }}
      />

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <RefreshCcw className="h-4 w-4" />
          {photo ? 'Replace' : 'Upload'}
        </Button>
        {photo ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(photo.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </article>
  );
}
