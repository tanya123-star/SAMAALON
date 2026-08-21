"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BeachFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");

  function apply() {
    const sp = new URLSearchParams(params.toString());
    if (q) sp.set("q", q);
    else sp.delete("q");
    if (location) sp.set("location", location);
    else sp.delete("location");
    sp.delete("page");
    router.push(`/beaches?${sp.toString()}`);
  }

  function clear() {
    setQ("");
    setLocation("");
    router.push("/beaches");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="text-xs font-medium">Search</label>
        <Input placeholder="Beach name or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex-1">
        <label className="text-xs font-medium">Location</label>
        <Input placeholder="e.g. Babak" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button onClick={apply} size="sm">
          Search
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
