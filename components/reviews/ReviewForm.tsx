"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReviewForm({ beachId, accommodationId, onCreated }: { beachId?: string; accommodationId?: string; onCreated?: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, beachId, accommodationId }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error ?? "Failed");
    else {
      setComment("");
      setMsg("Review created");
      onCreated?.();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded border px-2 py-1 text-sm">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <Input placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button type="submit" size="sm">
        Submit Review
      </Button>
      {msg ? <p className="text-xs text-muted-foreground">{msg}</p> : null}
    </form>
  );
}
