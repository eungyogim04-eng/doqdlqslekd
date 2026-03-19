"use client";

import { useState, useRef } from "react";
import { Platform, ScheduledPost, PLATFORM_CONFIG } from "../types";
import { supabase } from "../../lib/supabase";
import LinkPreview from "./LinkPreview";

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
  const [bestTimes, setBestTimes] = useState<{ time: string; reason: string }[]>([]);
  const [bestTimeLoading, setBestTimeLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAiGenerate() {
    if (!topic.trim()) { setError("주제를 입력해 주세요."); return; }
    setAiLoading(true); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platform }),
      });
      const data = await res.json();
      if (data.result) { setContent(data.result); setTopic(""); }
      else setError("AI 생성에 실패했습니다. 다시 시도해 주세요.");
    } catch { setError("AI 생성 중 오류가 발생했습니다."); }
    finally { setAiLoading(false); }
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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), platform }),
      });
      const data = await res.json();
      if (data.hashtags) setHashtags(data.hashtags);
    } catch { setError("해시태그 추천 실패."); }
    finally { setHashtagLoading(false); }
  }

  async function handleBestTime() {
    setBestTimeLoading(true); setBestTimes([]);
    try {
      const res = await fetch("/api/best-time", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.times) setBestTimes(data.times);
    } catch { /* silent */ }
    finally { setBestTimeLoading(false); }
  }

  function addHashtag(tag: string) {
    setContent(prev => prev.trim() + " " + tag);
    setHashtags(prev => prev.filter(t => t !== tag));
  }

  function removeImage() {
    setImageFile(null); setImagePreview(null);
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
      const { error: uploadError } = await supabase.storage.from("post-images").upload(path, imageFile);
      if (uploadError) { setError("이미지 업로드에 실패했어요."); setImageUploading(false); return; }
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
      setImageUploading(false);
    }

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
      onAdd({
        id: crypto.randomUUID(), content: content.trim(), platform,
        scheduledAt: d, time, createdAt: new Date().toISOString(),
        imageUrl, tags: tags.length > 0 ? [...tags] : undefined,
      });
    }

    setContent(""); setError(""); setRepeat("none");
    setTags([]); setTagInput(""); removeImage(); setShowOptions(false);
  }

  const cfg = PLATFORM_CONFIG[platform];

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl overflow-hidden" style={{background:"var(--bg-card)", border:"1px solid var(--border)"}}>
      {/* Platform tabs */}
      <div className="flex" style={{borderBottom:"1px solid var(--border-light)"}}>
        {(["instagram", "twitter", "youtube"] as Platform[]).map((p) => {
          const c = PLATFORM_CONFIG[p];
          const active = platform === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all"
              style={{
                background: active ? "var(--bg)" : undefined,
                color: active ? "var(--text-1)" : "var(--text-3)",
                borderBottom: active ? `2px solid var(--accent)` : "2px solid transparent",
              }}
            >
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              {c.emoji} {p === "instagram" ? "Instagram" : p === "twitter" ? "Twitter" : "YouTube"}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {/* AI writing */}
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAiGenerate())}
            placeholder="✨ AI 글쓰기 — 주제 입력 후 Enter"
            className="diary-input flex-1 px-3 py-2 text-xs"
          />
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-1"
            style={{background:"var(--accent)"}}
          >
            {aiLoading ? (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "생성"}
          </button>
        </div>

        {/* Textarea — the main writing space */}
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setError(""); }}
          placeholder="오늘 올릴 내용을 써보세요…"
          rows={5}
          className="diary-input w-full px-4 py-3 text-sm resize-none"
          style={{lineHeight: "1.7"}}
        />

        {error && <p className="mt-1.5 text-xs" style={{color:"#F87171"}}>{error}</p>}

        <LinkPreview content={content} />

        {/* Hashtag suggestions */}
        <div className="mt-2">
          <button type="button" onClick={handleHashtagSuggest} disabled={hashtagLoading}
            className="text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
            style={{color:"var(--accent)"}}>
            {hashtagLoading ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "#"} {hashtagLoading ? "추천 중..." : "AI 해시태그 추천"}
          </button>
          {hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashtags.map(tag => (
                <button key={tag} type="button" onClick={() => addHashtag(tag)}
                  className="rounded-full px-2.5 py-1 text-xs transition-colors"
                  style={{background:"var(--accent-bg)", color:"var(--accent-text)", border:"1px solid color-mix(in srgb, var(--accent) 20%, transparent)"}}>
                  {tag} +
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="mt-3">
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden" style={{border:"1px solid var(--border)"}}>
              <img src={imagePreview} alt="preview" className="w-full h-32 object-cover" />
              <button type="button" onClick={removeImage}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl py-2.5 text-xs flex items-center justify-center gap-2 transition-colors"
              style={{border:"1px dashed var(--border)", color:"var(--text-3)"}}>
              🖼️ 이미지 첨부 (선택, 최대 5MB)
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Date & time (always visible) */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1">
            <label className="block text-[10px] font-medium mb-1" style={{color:"var(--text-3)"}}>날짜</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="diary-input w-full px-3 py-2 text-sm" />
          </div>
          <div className="w-28">
            <label className="block text-[10px] font-medium mb-1" style={{color:"var(--text-3)"}}>시간</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="diary-input w-full px-3 py-2 text-sm" />
          </div>
        </div>

        {/* AI best time */}
        <div className="mt-2">
          <button type="button" onClick={handleBestTime} disabled={bestTimeLoading}
            className="text-xs font-medium flex items-center gap-1 disabled:opacity-50 transition-colors"
            style={{color:"var(--accent)"}}>
            {bestTimeLoading ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "🕐"} {bestTimeLoading ? "AI 분석 중..." : "AI 최적 게시 시간"}
          </button>
          {bestTimes.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5">
              {bestTimes.map(t => (
                <button key={t.time} type="button" onClick={() => { setTime(t.time); setBestTimes([]); }}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors group"
                  style={{background:"var(--accent-bg)", border:"1px solid color-mix(in srgb, var(--accent) 20%, transparent)"}}>
                  <span className="text-xs font-bold" style={{color:"var(--accent-text)"}}>{t.time}</span>
                  <span className="text-[10px] flex-1 mx-2 truncate" style={{color:"var(--text-2)"}}>{t.reason}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{color:"var(--accent)"}}>적용 →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expandable options */}
        <button type="button" onClick={() => setShowOptions(v => !v)}
          className="mt-3 flex items-center gap-1 text-xs transition-colors"
          style={{color:"var(--text-3)"}}>
          <span className={`transition-transform ${showOptions ? "rotate-90" : ""}`}>›</span>
          {showOptions ? "옵션 접기" : "반복 예약 · 태그"}
        </button>

        {showOptions && (
          <div className="mt-3 space-y-3 animate-fade-up">
            {/* Repeat */}
            <div>
              <label className="block text-[10px] font-medium mb-1.5" style={{color:"var(--text-3)"}}>반복</label>
              <div className="flex gap-1.5">
                {(["none", "daily", "weekly", "monthly"] as const).map(r => (
                  <button key={r} type="button" onClick={() => setRepeat(r)}
                    className="flex-1 rounded-full py-1.5 text-xs font-medium transition-all"
                    style={repeat === r
                      ? {background:"var(--accent)", color:"white"}
                      : {background:"var(--bg-hover)", color:"var(--text-2)", border:"1px solid var(--border)"}}>
                    {r === "none" ? "없음" : r === "daily" ? "매일" : r === "weekly" ? "매주" : "매월"}
                  </button>
                ))}
              </div>
              {repeat !== "none" && (
                <p className="mt-1 text-[10px]" style={{color:"var(--accent-text)"}}>
                  {repeat === "daily" ? "14일간 매일" : repeat === "weekly" ? "8주간 매주" : "3개월간 매월"} 자동 등록
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] font-medium mb-1.5" style={{color:"var(--text-3)"}}>태그</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                    e.preventDefault();
                    const t = tagInput.trim().replace(/^#/, "");
                    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
                    setTagInput("");
                  } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                    setTags(prev => prev.slice(0, -1));
                  }
                }}
                placeholder="Enter 또는 쉼표로 태그 추가"
                className="diary-input w-full px-3 py-2 text-xs"
              />
              {tags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                      style={{background:"var(--bg-hover)", color:"var(--text-2)", border:"1px solid var(--border)"}}>
                      #{tag}
                      <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                        className="transition-colors" style={{color:"var(--text-3)"}}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={imageUploading}
          className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          style={{background: "var(--accent)"}}
        >
          {imageUploading ? "이미지 업로드 중..." : "📌 예약 등록"}
        </button>
      </div>
    </form>
  );
}
