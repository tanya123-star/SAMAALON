"use client";

import { useState } from "react";

export function FavoriteButton({ beachId, accommodationId }: { beachId?: string; accommodationId?: string }) {
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beachId, accommodationId }),
    });
    const data = await res.json();
    if (res.ok) setFavorited(data.favorited);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold border backdrop-blur-md transition-all shadow-sm ${
        favorited
          ? "bg-[#E07A5F] text-white border-[#E07A5F]"
          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {favorited ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
