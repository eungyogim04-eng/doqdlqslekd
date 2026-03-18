"use client";

import { useState, useRef } from "react";
import { Platform, ScheduledPost, PLATFORM_CONFIG } from "../types";
import { supabase } from "../../lib/supabase";

interface PostFormProps {
  defaultDate?: string;
  onAdd: (post: ScheduledPost) => void;
}

export default function PostForm({ defaultDate, onAdd }: PostFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [date, setDate] = useState(defaultDate ?? today);
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagLoading, setHashtagLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAiGenerate() {
    if (!topic.trim()) {
      setError("주제를 입력해 주세요.");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platform }),
      });
      const data = await res.json();
      if (data.result) {
        setContent(data.result);
        setTopic("");
      } else {
        setError("AI 생성에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch {
      setError("AI 생성 중 오류가 발생했습니다.");
    } finally {
      setAiLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("이미지는 5MB 이하만 가능해요."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleHashtagSuggest() {
    if (!content.trim()) { setError("먼저 포스트 내용을 입력해주세요."); return; }
    setHashtagLoading(true);
    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), platform }),
      });
      const data = await res.json();
      if (data.hashtags) setHashtags(data.hashtags);
    } catch {
      setError("해시태그 추천 실패. 다시 시도해주세요.");
    } finally {
      setHashtagLoading(false);
    }
  }

  function addHashtag(tag: string) {
    setContent((prev) => prev.trim() + " " + tag);
    setHashtags((prev) => prev.filter((t) => t !== tag));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { setError("내용을 입력해 주세요."); return; }
    if (!date) { setError("날짜를 선택해 주세요."); return; }

    let imageUrl: string | undefined;

    if (imageFile) {
      setImageUploading(true);
      const ext = imageFile.name.split(".").pop();
      const path = `posts/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, imageFile);

      if (uploadError) {
        setError("이미지 업로드에 실패했어요.");
        setImageUploading(false);
        return;
      }
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
      setImageUploading(false);
    }

    // 반복 예약: 최대 8주치 포스트 생성
    const dates: string[] = [date];
    if (repeat !== "none") {
      const base = new Date(date);
      const count = repeat === "daily" ? 13 : repeat === "weekly" ? 7 : 2;
      for (let i = 1; i <= count; i++) {
        const next = new Date(base);
        if (repeat === "daily") next.setDate(base.getDate() + i);
        else if (repeat === "weekly") next.setDate(base.getDate() + i * 7);
        else next.setMonth(base.getMonth() + i);
        dates.push(next.toISOString().split("T")[0]);
      }
    }

    for (const d of dates) {
      const post: ScheduledPost = {
        id: crypto.randomUUID(),
        content: content.trim(),
        platform,
        scheduledAt: d,
        time,
        createdAt: new Date().toISOString(),
        imageUrl,
      };
      onAdd(post);
    }

    setContent("");
    setError("");
    setRepeat("none");
    removeImage();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm p-5"
    >
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">새 포스트 예약</h2>

      {/* Platform selector */}
      <div className="flex gap-2 mb-4">
        {(["instagram", "twitter", "youtube"] as Platform[]).map((p) => {
          const cfg = PLATFORM_CONFIG[p];
          const selected = platform === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all
                ${
                  selected
                    ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                    : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* AI 글쓰기 */}
      <div className="mb-3 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/50 p-3">
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          AI 글쓰기
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAiGenerate())}
            placeholder="주제 입력 (예: 봄 신상품 출시)"
            className="flex-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {aiLoading ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                생성 중
              </>
            ) : "생성"}
          </button>
        </div>
      </div>

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError("");
        }}
        placeholder="포스트 내용을 입력하거나 AI로 생성하세요…"
        rows={4}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* 해시태그 추천 */}
      <div className="mt-2">
        <button
          type="button"
          onClick={handleHashtagSuggest}
          disabled={hashtagLoading}
          className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 disabled:opacity-50"
        >
          {hashtagLoading ? (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : "# "}
          {hashtagLoading ? "해시태그 추천 중..." : "AI 해시태그 추천"}
        </button>
        {hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addHashtag(tag)}
                className="rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {tag} +
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image upload */}
      <div className="mt-3">
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img src={imagePreview} alt="preview" className="w-full h-36 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 py-3 text-xs text-zinc-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M5.25 6.75h.008v.008H5.25V6.75zm0 0a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
            </svg>
            이미지 첨부 (선택, 최대 5MB)
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* 반복 예약 */}
      <div className="mt-3">
        <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">반복</label>
        <div className="flex gap-2">
          {(["none", "daily", "weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRepeat(r)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                repeat === r
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500"
              }`}
            >
              {r === "none" ? "없음" : r === "daily" ? "매일" : r === "weekly" ? "매주" : "매월"}
            </button>
          ))}
        </div>
        {repeat !== "none" && (
          <p className="mt-1 text-xs text-indigo-500 dark:text-indigo-400">
            {repeat === "daily" ? "14일간 매일" : repeat === "weekly" ? "8주간 매주" : "3개월간 매월"} 자동 등록됩니다
          </p>
        )}
      </div>

      {/* Date & time */}
      <div className="mt-3 flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div className="w-32">
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">시간</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={imageUploading}
        className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-60"
      >
        {imageUploading ? "이미지 업로드 중..." : "예약 등록"}
      </button>
    </form>
  );
}
