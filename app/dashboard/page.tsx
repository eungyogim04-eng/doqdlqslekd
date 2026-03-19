"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Calendar from "../components/Calendar";
import StatsCards from "../components/StatsCards";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import EditPostModal from "../components/EditPostModal";
import WeekView from "../components/WeekView";
import DayView from "../components/DayView";
import OnboardingModal from "../components/OnboardingModal";
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
  const [calView, setCalView] = useState<"month" | "week" | "day">("month");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" } | null>(null);
  const { dark, toggle: toggleDark } = useDarkMode();

  function showToast(message: string, type: "error" | "info" = "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

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

  // Onboarding: show once per user
  useEffect(() => {
    if (!user) return;
    const key = `postly_onboarded_${user.id}`;
    if (!localStorage.getItem(key)) {
      setShowOnboarding(true);
    }
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
          tags: row.tags ?? [],
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
      showToast(`${userPlan === "free" ? "Free" : "Pro"} 플랜은 월 ${limit.posts}개까지 예약 가능합니다. 업그레이드하려면 가격 페이지를 방문하세요.`, "error");
      return;
    }

    if (!limit.platforms.includes(post.platform)) {
      showToast("Free 플랜은 Instagram, Twitter만 사용 가능합니다. YouTube를 사용하려면 Pro 플랜으로 업그레이드하세요.", "error");
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
        tags: post.tags ?? [],
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
        tags: data.tags ?? [],
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

  // Diary: today's greeting
  const todayDate = new Date();
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const todayLabel = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일 ${weekdays[todayDate.getDay()]}`;
  const hour = todayDate.getHours();
  const greeting =
    hour < 6  ? "🌙 늦은 밤에도 열심히네요" :
    hour < 12 ? "☀️ 좋은 아침이에요" :
    hour < 18 ? "✏️ 오늘도 하나씩 기록해봐요" :
                "🌇 오늘 하루도 수고했어요";

  const todayPostCount = posts.filter(p => p.scheduledAt === today).length;
  const monthPostCount = posts.filter(p => p.scheduledAt.startsWith(currentMonth)).length;

  return (
    <div className="min-h-screen" style={{background: "var(--bg)"}}>

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md" style={{borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-card) 90%, transparent)"}}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6" style={{height: "52px"}}>
          <span className="text-base font-bold tracking-tight" style={{color: "var(--text-1)"}}>Postly ✦</span>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {[
              {href:"/dashboard", label:"캘린더", active:true},
              {href:"/analytics", label:"분석", active:false},
              {href:"/team", label:"팀", active:false},
              {href:"/approvals", label:"승인", active:false},
              {href:"/settings", label:"설정", active:false},
            ].map(n => (
              <Link
                key={n.href}
                href={n.href}
                style={{color: n.active ? "var(--text-1)" : "var(--text-2)"}}
                className="hover:opacity-80 transition-opacity font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{color: "var(--text-3)"}}
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

            <button
              onClick={() => { setShowSearch(v => !v); setSearchQuery(""); }}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              style={{color: showSearch ? "var(--accent)" : "var(--text-3)"}}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="w-px h-4 mx-1" style={{background: "var(--border)"}} />

            {userPlan === "free" ? (
              <Link href="/pricing" className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors" style={{background: "var(--accent)"}}>
                업그레이드
              </Link>
            ) : (
              <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize" style={{background: "var(--accent-bg)", color: "var(--accent-text)"}}>
                {userPlan} ✓
              </span>
            )}

            <button
              onClick={handleLogout}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{color: "var(--text-2)"}}
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-3 sm:px-6" style={{borderBottom: "1px solid var(--border)", background: "var(--bg-card)"}}>
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{color:"var(--text-3)"}}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="포스트 내용, 플랫폼으로 검색..."
                className="diary-input w-full py-2.5 pl-10 pr-4 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm" style={{color:"var(--text-3)"}}>✕</button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="text-3xl animate-pulse">📖</div>
            <p className="text-sm" style={{color:"var(--text-3)"}}>다이어리를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* Diary header — today's date */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium mb-1" style={{color: "var(--text-3)"}}>
                  {greeting}
                </p>
                <h1 className="text-2xl font-bold" style={{color: "var(--text-1)"}}>
                  {todayLabel}
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {todayPostCount > 0 && (
                  <span className="rounded-full px-3 py-1 text-xs font-medium" style={{background:"var(--accent-bg)", color:"var(--accent-text)"}}>
                    오늘 {todayPostCount}개 예정
                  </span>
                )}
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{background:"var(--bg-hover)", color:"var(--text-2)"}}>
                  이번 달 {monthPostCount}개 ✍️
                </span>
              </div>
            </div>

            <StatsCards posts={posts} today={today} currentMonth={currentMonth} userPlan={userPlan} />

            {/* Search results */}
            {showSearch && searchQuery.trim() && (() => {
              const q = searchQuery.trim().toLowerCase();
              const results = posts.filter(
                p => p.content.toLowerCase().includes(q) || p.platform.toLowerCase().includes(q)
              );
              return (
                <div className="mt-5 diary-card overflow-hidden">
                  <div className="flex items-center px-5 py-4" style={{borderBottom:"1px solid var(--border-light)"}}>
                    <h3 className="text-sm font-semibold" style={{color:"var(--text-1)"}}>
                      &ldquo;{searchQuery}&rdquo;{" "}
                      <span className="font-normal" style={{color:"var(--text-3)"}}>{results.length}건</span>
                    </h3>
                  </div>
                  {results.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm" style={{color:"var(--text-3)"}}>검색 결과가 없어요 🔍</p>
                  ) : (
                    <ul>
                      {results.map((post) => {
                        const platformColors: Record<string, string> = {instagram:"var(--ig-text)", twitter:"var(--tw-text)", youtube:"var(--yt-text)"};
                        const platformLabels: Record<string, string> = {instagram:"📸 Instagram", twitter:"🐦 Twitter/X", youtube:"🎬 YouTube"};
                        const highlighted = post.content.replace(
                          new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
                          "<mark style=\"background:#FEF9C3;border-radius:2px;padding:0 2px;\">$1</mark>"
                        );
                        return (
                          <li
                            key={post.id}
                            className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors"
                            style={{borderBottom:"1px solid var(--border-light)"}}
                            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "")}
                            onClick={() => {
                              setSelectedDate(post.scheduledAt);
                              const [y, m] = post.scheduledAt.split("-").map(Number);
                              setYear(y); setMonth(m - 1);
                              setShowSearch(false); setSearchQuery("");
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold" style={{color: platformColors[post.platform]}}>
                                  {platformLabels[post.platform] ?? post.platform}
                                </span>
                                <span className="text-xs" style={{color:"var(--text-3)"}}>{post.scheduledAt} {post.time}</span>
                              </div>
                              <p className="text-sm break-words" style={{color:"var(--text-1)"}} dangerouslySetInnerHTML={{ __html: highlighted }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })()}

            {/* Calendar toolbar */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-lg transition-colors" style={{color:"var(--text-3)"}} onMouseEnter={e=>{(e.target as HTMLElement).style.background="var(--bg-hover)"}} onMouseLeave={e=>{(e.target as HTMLElement).style.background=""}}>‹</button>
                <h2 className="text-sm font-semibold tabular-nums" style={{color:"var(--text-1)"}}>{year}년 {MONTH_NAMES[month]}</h2>
                <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-full text-lg transition-colors" style={{color:"var(--text-3)"}} onMouseEnter={e=>{(e.target as HTMLElement).style.background="var(--bg-hover)"}} onMouseLeave={e=>{(e.target as HTMLElement).style.background=""}}>›</button>
                <button onClick={goToday} className="ml-1 rounded-full px-3 py-1 text-xs font-medium transition-colors" style={{border:"1px solid var(--border)", color:"var(--text-2)"}}>
                  오늘
                </button>
              </div>
              <div className="flex items-center gap-0.5 rounded-full p-1" style={{background:"var(--bg-hover)"}}>
                {(["month", "week", "day"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalView(v)}
                    className="px-3 py-1 text-xs font-medium rounded-full transition-all"
                    style={calView === v
                      ? {background:"var(--bg-card)", color:"var(--text-1)", boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}
                      : {color:"var(--text-2)"}}
                  >
                    {v === "month" ? "월" : v === "week" ? "주" : "일"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {calView === "month" && (
                  <Calendar year={year} month={month} posts={posts} today={today}
                    onDayClick={(d) => setSelectedDate((prev) => (prev === d ? null : d))}
                    onMovePost={handleMovePost}
                  />
                )}
                {calView === "week" && (
                  <WeekView baseDate={selectedDate ?? today} posts={posts} today={today}
                    onDayClick={(d) => { setSelectedDate(d); setCalView("day"); }}
                  />
                )}
                {calView === "day" && (
                  <DayView date={selectedDate ?? today} posts={posts}
                    onEdit={(post) => setEditingPost(post)}
                    onDelete={handleDeletePost}
                    onDuplicate={handleDuplicatePost}
                  />
                )}
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
                <PostForm defaultDate={selectedDate ?? today} onAdd={handleAddPost} />
              </div>
            </div>
          </>
        )}
      </main>

      <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleUpdatePost} />
      {showOnboarding && (
        <OnboardingModal onComplete={() => {
          setShowOnboarding(false);
          if (user) localStorage.setItem(`postly_onboarded_${user.id}`, "1");
        }} />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl text-sm font-medium ${
          toast.type === "error" ? "bg-rose-500 text-white" : "text-white"
        }`} style={toast.type !== "error" ? {background:"var(--text-1)"} : undefined}>
          <span>{toast.type === "error" ? "⚠️" : "✓"}</span>
          <span>{toast.message}</span>
          {toast.type === "error" && (
            <a href="/pricing" className="ml-2 underline opacity-80 hover:opacity-100 shrink-0">업그레이드 →</a>
          )}
        </div>
      )}
    </div>
  );
}
