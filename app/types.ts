export type Platform = "instagram" | "twitter" | "youtube";

export type PostStatus = "draft" | "pending" | "approved" | "rejected";

export interface ScheduledPost {
  id: string;
  content: string;
  platform: Platform;
  scheduledAt: string; // ISO date string YYYY-MM-DD
  time: string; // HH:MM
  createdAt: string;
  imageUrl?: string;
  status?: PostStatus;
  tags?: string[];
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  instagram: {
    label: "Instagram",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    dot: "bg-pink-500",
  },
  twitter: {
    label: "Twitter / X",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  youtube: {
    label: "YouTube",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};
