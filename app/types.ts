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

// Platform character limits
export const PLATFORM_CHAR_LIMIT: Record<Platform, number> = {
  instagram: 2200,
  twitter: 280,
  youtube: 5000,
};

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  instagram: {
    label: "Instagram",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-900",
    dot: "bg-pink-500",
  },
  twitter: {
    label: "Twitter / X",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-900",
    dot: "bg-sky-500",
  },
  youtube: {
    label: "YouTube",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900",
    dot: "bg-red-500",
  },
};
