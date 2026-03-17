"use client";

import { useState } from "react";
import Calendar from "./components/Calendar";
import StatsCards from "./components/StatsCards";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { ScheduledPost } from "./types";

const SAMPLE_POSTS: ScheduledPost[] = [
  {
    id: "1",
    content: "봄 신상품 출시 소식 🌸",
    platform: "instagram",
    scheduledAt: new Date().toISOString().split("T")[0],
    time: "10:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    content: "오늘의 업데이트 공지",
    platform: "twitter",
    scheduledAt: new Date().toISOString().split("T")[0],
    time: "14:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    content: "신제품 리뷰 영상 업로드",
    platform: "youtube",
    scheduledAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toISOString().split("T")[0];
    })(),
    time: "18:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    content: "주간 인사이트 공유",
    platform: "instagram",
    scheduledAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      return d.toISOString().split("T")[0];
    })(),
    time: "12:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    content: "고객 이벤트 안내",
    platform: "twitter",
    scheduledAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    })(),
    time: "09:00",
    createdAt: new Date().toISOString(),
  },
];

const MONTH_NAMES = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export default function Home() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [posts, setPosts] = useState<ScheduledPost[]>(SAMPLE_POSTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = now.toISOString().split("T")[0];
  const currentMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  }

  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(today);
  }

  function handleAddPost(post: ScheduledPost) {
    setPosts((prev) => [...prev, post]);
    setSelectedDate(post.scheduledAt);
  }

  function handleDeletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg
                className="h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">
              Postly
            </span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <button className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50">
              캘린더
            </button>
            <button className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">
              분석
            </button>
            <button className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">
              설정
            </button>
          </nav>

          <button className="rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            업그레이드
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats */}
        <StatsCards posts={posts} today={today} currentMonth={currentMonth} />

        {/* Calendar header */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              ‹
            </button>
            <h2 className="text-lg font-bold text-zinc-900">
              {year}년 {MONTH_NAMES[month]}
            </h2>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              ›
            </button>
          </div>
          <button
            onClick={goToday}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            오늘
          </button>
        </div>

        {/* Main grid */}
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Calendar — takes 2 columns */}
          <div className="lg:col-span-2">
            <Calendar
              year={year}
              month={month}
              posts={posts}
              today={today}
              onDayClick={(d) => setSelectedDate((prev) => (prev === d ? null : d))}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Post detail or form */}
            {selectedDate ? (
              <PostList
                posts={posts}
                selectedDate={selectedDate}
                onDelete={handleDeletePost}
                onClose={() => setSelectedDate(null)}
              />
            ) : null}
            <PostForm
              defaultDate={selectedDate ?? today}
              onAdd={handleAddPost}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
