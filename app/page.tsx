"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Calendar from "./components/Calendar";
import StatsCards from "./components/StatsCards";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { ScheduledPost } from "./types";
import { supabase } from "../lib/supabase";
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
    const { data, error } = await supabase
      .from("posts")
      .insert({
        content: post.content,
        platform: post.platform,
        scheduled_at: post.scheduledAt,
        time: post.time,
        user_id: user!.id,
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
      };
      setPosts((prev) => [...prev, saved]);
      setSelectedDate(saved.scheduledAt);
    }
  }

  async function handleDeletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
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
            <Link href="/" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">분석</Link>
            <button className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">설정</button>
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-xs text-zinc-500 truncate max-w-[140px]">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              로그아웃
            </button>
            <button className="rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              업그레이드
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <>
            <StatsCards posts={posts} today={today} currentMonth={currentMonth} />

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors">‹</button>
                <h2 className="text-lg font-bold text-zinc-900">{year}년 {MONTH_NAMES[month]}</h2>
                <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors">›</button>
              </div>
              <button onClick={goToday} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">오늘</button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Calendar
                  year={year}
                  month={month}
                  posts={posts}
                  today={today}
                  onDayClick={(d) => setSelectedDate((prev) => (prev === d ? null : d))}
                />
              </div>

              <div className="flex flex-col gap-4">
                {selectedDate && (
                  <PostList
                    posts={posts}
                    selectedDate={selectedDate}
                    onDelete={handleDeletePost}
                    onClose={() => setSelectedDate(null)}
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
    </div>
  );
}
