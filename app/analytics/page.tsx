"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { supabase } from "../../lib/supabase";
import { ScheduledPost } from "../types";
import type { User } from "@supabase/supabase-js";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c",
  twitter: "#1da1f2",
  youtube: "#ff0000",
};

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter/X",
  youtube: "YouTube",
};

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else setUser(data.user);
    });
  }, [router]);

  // Fetch posts
  useEffect(() => {
    if (!user) return;
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user!.id)
        .order("scheduled_at", { ascending: true });
      if (!error && data) {
        setPosts(data.map((row) => ({
          id: row.id,
          content: row.content,
          platform: row.platform,
          scheduledAt: row.scheduled_at,
          time: row.time,
          createdAt: row.created_at,
        })));
      }
      setLoading(false);
    }
    fetchPosts();
  }, [user]);

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 최근 6개월 데이터
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { key, label: `${MONTH_NAMES[d.getMonth()]}` };
  });

  const monthlyData = last6Months.map(({ key, label }) => ({
    label,
    instagram: posts.filter((p) => p.scheduledAt.startsWith(key) && p.platform === "instagram").length,
    twitter: posts.filter((p) => p.scheduledAt.startsWith(key) && p.platform === "twitter").length,
    youtube: posts.filter((p) => p.scheduledAt.startsWith(key) && p.platform === "youtube").length,
    total: posts.filter((p) => p.scheduledAt.startsWith(key)).length,
  }));

  // 플랫폼별 비율
  const platformData = ["instagram", "twitter", "youtube"].map((p) => ({
    name: PLATFORM_LABEL[p],
    value: posts.filter((post) => post.platform === p).length,
    color: PLATFORM_COLORS[p],
  })).filter((d) => d.value > 0);

  // 요일별 분포
  const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
  const dayData = DAY_NAMES.map((name, idx) => ({
    name,
    count: posts.filter((p) => new Date(p.scheduledAt).getDay() === idx).length,
  }));

  // 이번달 / 지난달 비교
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthCount = posts.filter((p) => p.scheduledAt.startsWith(thisMonth)).length;
  const lastMonthCount = posts.filter((p) => p.scheduledAt.startsWith(lastMonth)).length;
  const growthRate = lastMonthCount === 0 ? 100 : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

  // 다가오는 포스트 (7일 이내)
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcoming = posts
    .filter((p) => p.scheduledAt >= today && p.scheduledAt <= nextWeek.toISOString().split("T")[0])
    .slice(0, 5);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">Postly</span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50">분석</Link>
            <button className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">설정</button>
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-xs text-zinc-500 truncate max-w-[140px]">{user.email}</span>
            )}
            <button onClick={handleLogout} className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
              로그아웃
            </button>
            <button className="rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              업그레이드
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">분석 대시보드</h1>

        {/* 요약 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "전체 예약", value: posts.length, sub: "누적 포스트", color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "이번 달", value: thisMonthCount, sub: `지난달 대비 ${growthRate > 0 ? "+" : ""}${growthRate}%`, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "오늘 예정", value: posts.filter((p) => p.scheduledAt === today).length, sub: "오늘 발행", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "이번 주 예정", value: upcoming.length, sub: "7일 이내", color: "text-pink-600", bg: "bg-pink-50" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <p className="text-xs font-medium text-zinc-500 mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* 월별 포스트 차트 */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-zinc-800 mb-4">월별 예약 현황 (최근 6개월)</h2>
            {posts.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-zinc-400">데이터가 없습니다</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={14} barGap={2}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }}
                    cursor={{ fill: "#f4f4f5" }}
                  />
                  <Bar dataKey="instagram" name="Instagram" fill="#e1306c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="twitter" name="Twitter/X" fill="#1da1f2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="youtube" name="YouTube" fill="#ff0000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 플랫폼 비율 */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-zinc-800 mb-4">플랫폼 비율</h2>
            {platformData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-zinc-400">데이터가 없습니다</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {platformData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: "#71717a" }}>{value}</span>} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 요일별 분포 */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-zinc-800 mb-4">요일별 예약 분포</h2>
            {posts.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-zinc-400">데이터가 없습니다</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dayData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }} cursor={{ fill: "#f4f4f5" }} />
                  <Bar dataKey="count" name="포스트" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 다가오는 포스트 */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-zinc-800 mb-4">다가오는 포스트 (7일 이내)</h2>
            {upcoming.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-zinc-400">예정된 포스트가 없습니다</div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((post) => (
                  <li key={post.id} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: PLATFORM_COLORS[post.platform], marginTop: 5 }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-800 truncate">{post.content}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{post.scheduledAt} {post.time} · {PLATFORM_LABEL[post.platform]}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
