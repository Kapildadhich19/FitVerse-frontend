import { z } from "zod";

export const avatarPhotoTypeSchema = z.enum(["front", "left", "right", "back"]);
export const avatarStatusSchema = z.enum(["queued", "processing", "completed", "failed"]);

export type AvatarPhotoType = z.infer<typeof avatarPhotoTypeSchema>;
export type AvatarStatus = z.infer<typeof avatarStatusSchema>;
