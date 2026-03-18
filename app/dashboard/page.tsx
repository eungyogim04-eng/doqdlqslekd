"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Calendar from "../components/Calendar";
import StatsCards from "../components/StatsCards";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import EditPostModal from "../components/EditPostModal";
import { ScheduledPost } from "../types";
import { supabase } from "../../lib/supabase";
import { useDarkMode } from "../components/ThemeProvider";
import type { User } from "@supabase/supabase-js";

const MONTH_NAMES = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export default function Home() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "business">("free");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { dark, toggle: toggleDark } = useDarkMode();

  const PLAN_LIMITS = {
    free: { posts: 10, platforms: ["instagram", "twitter"] },
    pro: { posts: 100, platforms: ["instagram", "twitter", "youtube"] },
    business: { posts: Infinity, platforms: ["instagram", "twitter", "youtube"] },
  };

  const today = now.toISOString().split("T")[0];
  const currentMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
      } else {
        setUser(data.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // Load user plan
  useEffect(() => {
    if (!user) return;
    supabase.from("user_plans").select("plan").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.plan) setUserPlan(data.plan as "free" | "pro" | "business");
    });
  }, [user]);

  // Load posts from Supabase
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
        const mapped: ScheduledPost[] = data.map((row) => ({
          id: row.id,
          content: row.content,
          platform: row.platform,
          scheduledAt: row.scheduled_at,
          time: row.time,
          createdAt: row.created_at,
          imageUrl: row.image_url ?? undefined,
        }));
        setPosts(mapped);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  }

  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(today);
  }

  async function handleAddPost(post: ScheduledPost) {
    const limit = PLAN_LIMITS[userPlan];
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthPosts = posts.filter((p) => p.scheduledAt.startsWith(thisMonth));

    if (monthPosts.length >= limit.posts) {
      alert(`${userPlan === "free" ? "Free" : "Pro"} 플랜은 월 ${limit.posts}개까지 예약 가능합니다.\n업그레이드하려면 /pricing 페이지를 방문하세요!`);
      return;
    }

    if (!limit.platforms.includes(post.platform)) {
      alert(`Free 플랜은 Instagram, Twitter만 사용 가능합니다.\nYouTube를 사용하려면 Pro 플랜으로 업그레이드하세요!`);
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        content: post.content,
        platform: post.platform,
        scheduled_at: post.scheduledAt,
        time: post.time,
        user_id: user!.id,
        image_url: post.imageUrl ?? null,
      })
      .select()
      .single();

    if (!error && data) {
      const saved: ScheduledPost = {
        id: data.id,
        content: data.content,
        platform: data.platform,
        scheduledAt: data.scheduled_at,
        time: data.time,
        createdAt: data.created_at,
        imageUrl: data.image_url ?? undefined,
      };
      setPosts((prev) => [...prev, saved]);
      setSelectedDate(saved.scheduledAt);
    }
  }

  async function handleMovePost(postId: string, newDate: string) {
    const { error } = await supabase
      .from("posts")
      .update({ scheduled_at: newDate })
      .eq("id", postId);

    if (!error) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, scheduledAt: newDate } : p));
      setSelectedDate(newDate);
    }
  }

  async function handleDuplicatePost(post: ScheduledPost) {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        content: post.content,
        platform: post.platform,
        scheduled_at: post.scheduledAt,
        time: post.time,
        user_id: user!.id,
        image_url: post.imageUrl ?? null,
      })
      .select()
      .single();

    if (!error && data) {
      const duplicated: ScheduledPost = {
        id: data.id,
        content: data.content,
        platform: data.platform,
        scheduledAt: data.scheduled_at,
        time: data.time,
        createdAt: data.created_at,
        imageUrl: data.image_url ?? undefined,
      };
      setPosts((prev) => [...prev, duplicated]);
    }
  }

  async function handleUpdatePost(updated: ScheduledPost) {
    const { error } = await supabase
      .from("posts")
      .update({
        content: updated.content,
        platform: updated.platform,
        scheduled_at: updated.scheduledAt,
        time: updated.time,
      })
      .eq("id", updated.id);

    if (!error) {
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedDate(updated.scheduledAt);
    }
  }

  async function handleDeletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
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
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Postly</span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">분석</Link>
            <Link href="/team" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">팀</Link>
            <Link href="/approvals" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">승인</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              title={dark ? "라이트 모드" : "다크 모드"}
            >
              {dark ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            {/* Search toggle button */}
            <button
              onClick={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${showSearch ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950 text-indigo-600" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700"}`}
              title="검색"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {user && (
              <span className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              로그아웃
            </button>
            {userPlan === "free" && (
              <Link href="/pricing" className="rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                업그레이드 ✨
              </Link>
            )}
            {userPlan !== "free" && (
              <span className="rounded-xl bg-indigo-100 dark:bg-indigo-950 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 capitalize">
                {userPlan} 플랜 ✓
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Search bar */}
      {showSearch && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="포스트 내용, 플랫폼으로 검색..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 pl-9 pr-4 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <>
            <StatsCards posts={posts} today={today} currentMonth={currentMonth} userPlan={userPlan} />

            {/* Search results */}
            {showSearch && searchQuery.trim() && (() => {
              const q = searchQuery.trim().toLowerCase();
              const results = posts.filter(
                (p) =>
                  p.content.toLowerCase().includes(q) ||
                  p.platform.toLowerCase().includes(q)
              );
              return (
                <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      검색 결과 <span className="text-indigo-600">&ldquo;{searchQuery}&rdquo;</span>
                      <span className="ml-2 text-xs font-normal text-zinc-400">{results.length}개</span>
                    </h3>
                  </div>
                  {results.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">검색 결과가 없습니다.</p>
                  ) : (
                    <ul className="divide-y divide-zinc-100">
                      {results.map((post) => {
                        const platformColors: Record<string, string> = {
                          instagram: "text-pink-500",
                          twitter: "text-sky-500",
                          youtube: "text-red-500",
                        };
                        const platformLabels: Record<string, string> = {
                          instagram: "Instagram",
                          twitter: "Twitter/X",
                          youtube: "YouTube",
                        };
                        const highlighted = post.content.replace(
                          new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
                          "<mark class=\"bg-yellow-100 text-yellow-800 rounded px-0.5\">$1</mark>"
                        );
                        return (
                          <li
                            key={post.id}
                            className="flex items-start gap-3 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedDate(post.scheduledAt);
                              // navigate calendar to the post's month
                              const [y, m] = post.scheduledAt.split("-").map(Number);
                              setYear(y);
                              setMonth(m - 1);
                              setShowSearch(false);
                              setSearchQuery("");
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs font-semibold ${platformColors[post.platform] ?? "text-zinc-500"}`}>
                                  {platformLabels[post.platform] ?? post.platform}
                                </span>
                                <span className="text-xs text-zinc-400">{post.scheduledAt} {post.time}</span>
                              </div>
                              <p
                                className="text-sm text-zinc-700 break-words"
                                dangerouslySetInnerHTML={{ __html: highlighted }}
                              />
                            </div>
                            <svg className="h-4 w-4 shrink-0 mt-1 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })()}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">‹</button>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{year}년 {MONTH_NAMES[month]}</h2>
                <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">›</button>
              </div>
              <button onClick={goToday} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">오늘</button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Calendar
                  year={year}
                  month={month}
                  posts={posts}
                  today={today}
                  onDayClick={(d) => setSelectedDate((prev) => (prev === d ? null : d))}
                  onMovePost={handleMovePost}
                />
              </div>

              <div className="flex flex-col gap-4">
                {selectedDate && (
                  <PostList
                    posts={posts}
                    selectedDate={selectedDate}
                    onDelete={handleDeletePost}
                    onEdit={(post) => setEditingPost(post)}
                    onClose={() => setSelectedDate(null)}
                    onDuplicate={handleDuplicatePost}
                  />
                )}
                <PostForm
                  defaultDate={selectedDate ?? today}
                  onAdd={handleAddPost}
                />
              </div>
            </div>
          </>
        )}
      </main>
      <EditPostModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={handleUpdatePost}
      />
    </div>
  );
}
