import type { AxiosProgressEvent } from "axios";

import { api } from "@/lib/http/axios-client";
import type { AvatarPhotoType, AvatarStatus } from "@/features/avatar/schemas/avatar.schema";

export type AvatarPhoto = {
  id: string;
  avatarId: string;
  type: AvatarPhotoType;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type Avatar = {
  id: string;
  userId: string;
  status: AvatarStatus;
  thumbnailUrl: string | null;
  modelUrl: string | null;
  photos: AvatarPhoto[];
  createdAt: string;
  updatedAt: string;
};

type AvatarResponse = {
  avatar: Avatar | null;
};

type UploadAvatarPhotoResponse = {
  avatar: Avatar | null;
  photo: AvatarPhoto;
};

type AvatarStatusResponse = {
  status: AvatarStatus;
  avatar: Avatar | null;
};

export function getAvatar() {
  return api.get<AvatarResponse>("/avatar").then((response) => response.data.avatar);
}

export function uploadAvatarPhoto(
  input: { type: AvatarPhotoType; file: File },
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
  const formData = new FormData();
  formData.append("type", input.type);
  formData.append("photo", input.file);

  return api
    .post<UploadAvatarPhotoResponse>("/avatar/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    })
    .then((response) => response.data);
}

export function deleteAvatarPhoto(photoId: string) {
  return api.delete<AvatarResponse>(`/avatar/photos/${photoId}`).then((response) => response.data.avatar);
}

export function generateAvatar() {
  return api.post<AvatarResponse>("/avatar/generate").then((response) => response.data.avatar);
}

export function getAvatarStatus() {
  return api.get<AvatarStatusResponse>("/avatar/status").then((response) => response.data);
}
