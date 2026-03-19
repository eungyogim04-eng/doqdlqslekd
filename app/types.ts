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

// Diary pastel theme — all values are CSS variable references for dynamic theming
export const PLATFORM_CONFIG: Record<
  Platform,
  {
    label: string;
    color: string;   // Tailwind text class
    bg: string;      // Tailwind bg class
    border: string;  // Tailwind border class
    dot: string;     // Tailwind bg class for the dot
    emoji: string;
  }
> = {
  instagram: {
    label: "Instagram",
    emoji: "📸",
    color: "text-rose-600 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-400",
  },
  twitter: {
    label: "Twitter / X",
    emoji: "🐦",
    color: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-800",
    dot: "bg-teal-400",
  },
  youtube: {
    label: "YouTube",
    emoji: "🎬",
    color: "text-red-600 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-400",
  },
};
