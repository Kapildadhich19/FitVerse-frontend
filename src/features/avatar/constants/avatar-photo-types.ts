import type { AvatarPhotoType } from "@/features/avatar/schemas/avatar.schema";

export const avatarPhotoTypes: Array<{
  type: AvatarPhotoType;
  title: string;
  description: string;
}> = [
  { type: "front", title: "Front", description: "Face forward with full body visible." },
  { type: "left", title: "Left", description: "Turn 90 degrees to your left." },
  { type: "right", title: "Right", description: "Turn 90 degrees to your right." },
  { type: "back", title: "Back", description: "Face away with posture relaxed." }
];
