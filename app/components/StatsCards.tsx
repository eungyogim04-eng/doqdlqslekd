"use client";

import { ScheduledPost } from "../types";

interface StatsCardsProps {
  posts: ScheduledPost[];
  today: string;
  currentMonth: string;
  userPlan: "free" | "pro" | "business";
}

const PLAN_LIMITS = { free: 10, pro: 100, business: Infinity };

export default function StatsCards({ posts, today, currentMonth, userPlan }: StatsCardsProps) {
  const monthPosts = posts.filter((p) => p.scheduledAt.startsWith(currentMonth));
  const todayPosts = posts.filter((p) => p.scheduledAt === today);
  const instagramCount = monthPosts.filter((p) => p.platform === "instagram").length;
  const twitterCount   = monthPosts.filter((p) => p.platform === "twitter").length;
  const youtubeCount   = monthPosts.filter((p) => p.platform === "youtube").length;
  const limit = PLAN_LIMITS[userPlan];
  const usagePercent = limit === Infinity ? 0 : Math.min(100, (monthPosts.length / limit) * 100);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-5">
      {/* This month */}
      <div className="rounded-2xl p-4" style={{background:"var(--accent-bg)", border:"1px solid color-mix(in srgb, var(--accent) 20%, transparent)"}}>
        <p className="text-xl mb-0.5">✍️</p>
        <p className="text-2xl font-bold" style={{color:"var(--accent-text)"}}>{monthPosts.length}</p>
        <p className="text-xs font-medium mt-0.5" style={{color:"var(--accent-text)", opacity:0.8}}>이번 달 기록</p>
        <p className="text-[10px] mt-1" style={{color:"var(--accent-text)", opacity:0.55}}>
          {limit === Infinity ? "무제한" : `${limit}개 중`}
        </p>
        {limit !== Infinity && (
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{background:"color-mix(in srgb, var(--accent) 15%, transparent)"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${usagePercent}%`, background: usagePercent > 85 ? "#F87171" : "var(--accent)"}} />
          </div>
        )}
      </div>

      {/* Today */}
      <div className="rounded-2xl p-4" style={{background:"#F0FDF9", border:"1px solid #A7F3D0"}}>
        <p className="text-xl mb-0.5">📅</p>
        <p className="text-2xl font-bold" style={{color:"#059669"}}>{todayPosts.length}</p>
        <p className="text-xs font-medium mt-0.5" style={{color:"#059669", opacity:0.8}}>오늘 예정</p>
        <p className="text-[10px] mt-1" style={{color:"#059669", opacity:0.6}}>
          {todayPosts.length > 0 ? "오늘 파이팅 💪" : "아직 없어요"}
        </p>
      </div>

      {/* Instagram */}
      <div className="rounded-2xl p-4" style={{background:"var(--ig-bg)", border:"1px solid var(--ig-border)"}}>
        <p className="text-xl mb-0.5">📸</p>
        <p className="text-2xl font-bold" style={{color:"var(--ig-text)"}}>{instagramCount}</p>
        <p className="text-[11px] font-medium mt-0.5" style={{color:"var(--ig-text)", opacity:0.75}}>Instagram</p>
      </div>

      {/* Twitter */}
      <div className="rounded-2xl p-4" style={{background:"var(--tw-bg)", border:"1px solid var(--tw-border)"}}>
        <p className="text-xl mb-0.5">🐦</p>
        <p className="text-2xl font-bold" style={{color:"var(--tw-text)"}}>{twitterCount}</p>
        <p className="text-[11px] font-medium mt-0.5" style={{color:"var(--tw-text)", opacity:0.75}}>Twitter / X</p>
      </div>

      {/* YouTube */}
      <div className="rounded-2xl p-4" style={{background:"var(--yt-bg)", border:"1px solid var(--yt-border)"}}>
        <p className="text-xl mb-0.5">🎬</p>
        <p className="text-2xl font-bold" style={{color:"var(--yt-text)"}}>{youtubeCount}</p>
        <p className="text-[11px] font-medium mt-0.5" style={{color:"var(--yt-text)", opacity:0.75}}>YouTube</p>
      </div>
    </div>
  );
}
