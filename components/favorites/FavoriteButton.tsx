"use client"

import { useState } from "react"

export function FavoriteButton({
  beachId,
  accommodationId,
}: {
  beachId?: string
  accommodationId?: string
}) {
  const [favorited, setFavorited] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beachId, accommodationId }),
    })
    const data = await res.json()
    if (res.ok) setFavorited(data.favorited)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md transition-all ${
        favorited
          ? "border-[#E07A5F] bg-[#E07A5F] text-white"
          : "border-white/30 bg-white/20 text-white hover:bg-white/30"
      } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {favorited ? "♥ Saved" : "♡ Save"}
    </button>
  )
}
