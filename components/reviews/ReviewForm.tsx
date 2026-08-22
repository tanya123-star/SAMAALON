"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function ReviewForm({
  beachId,
  accommodationId,
  onCreated,
}: {
  beachId?: string;
  accommodationId?: string;
  onCreated?: () => void;
}) {
  const [session, setSession] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check auth status client-side
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setSession(data?.user ? "authenticated" : "unauthenticated"))
      .catch(() => setSession("unauthenticated"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setMsg({ text: "Please select a star rating.", ok: false }); return; }
    setSubmitting(true);
    setMsg(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, beachId, accommodationId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg({ text: data.error ?? "Failed to submit review.", ok: false });
    } else {
      setRating(0);
      setComment("");
      setMsg({ text: "✅ Review submitted! It will appear after moderation.", ok: true });
      onCreated?.();
    }
    setSubmitting(false);
  }

  // Loading state
  if (session === "loading") {
    return (
      <div className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 animate-pulse">
        <div className="h-4 w-32 bg-slate-100 rounded mb-3" />
        <div className="h-10 w-full bg-slate-100 rounded" />
      </div>
    );
  }

  // Not logged in — show login prompt
  if (session === "unauthenticated") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-2xl">🔒</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#1C2A28]">Login required to leave a review</p>
          <p className="text-xs text-[#5A6B68] mt-1">
            Sign in with your Google account to share your experience and rate this destination.
          </p>
        </div>
        <Link
          href="/api/auth/signin"
          className="rounded-full bg-[#1C2A28] px-5 py-2.5 text-xs font-bold text-white whitespace-nowrap hover:bg-[#2D6A4F] transition-all"
        >
          Sign in with Google →
        </Link>
      </div>
    );
  }

  // Logged in — show star rating form
  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 space-y-5">
      {/* Star Rating Picker */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[#5A6B68] block mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
            >
              <span className={`${(hovered || rating) >= star ? "text-[#E07A5F]" : "text-[#1C2A28]/20"}`}>
                ★
              </span>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-xs font-semibold text-[#5A6B68]">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[#5A6B68] block mb-2">
          Your Experience
        </label>
        <textarea
          placeholder="Share what you loved, tips for other visitors, or things to watch out for..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          className="w-full rounded-xl border border-[#1C2A28]/15 bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C2A28] placeholder-[#5A6B68]/60 focus:border-[#2D6A4F] focus:outline-none resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#1C2A28] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest hover:bg-[#2D6A4F] transition-all disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
        {msg && (
          <p className={`text-xs font-semibold ${msg.ok ? "text-[#2D6A4F]" : "text-[#E07A5F]"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
