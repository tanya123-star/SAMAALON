"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <Button variant="outline" size="sm" onClick={toggle} disabled={loading}>
      {favorited ? "★ Favorited" : "☆ Favorite"}
    </Button>
  );
}
