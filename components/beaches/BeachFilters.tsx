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

  const districts = ["All Districts", "Babak", "Kaputian", "Aundanao", "Talikud Island", "San Jose"];

  function applyLocation(dist: string) {
    const targetLoc = dist === "All Districts" ? "" : dist;
    setLocation(targetLoc);
    const sp = new URLSearchParams(params.toString());
    if (q) sp.set("q", q);
    else sp.delete("q");
    if (targetLoc) sp.set("location", targetLoc);
    else sp.delete("location");
    sp.delete("page");
    router.push(`/beaches?${sp.toString()}`);
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="sticky top-16 z-30 w-full glass-nav border-y border-[#1C2A28]/10 py-4 px-4 sm:px-8 transition-all">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={applySearch} className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search beach name or cove..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-full border border-[#1C2A28]/20 bg-white/90 px-4 py-2 text-xs text-[#1C2A28] focus:border-[#2D6A4F] focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#1C2A28] px-5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#2D6A4F] transition-all"
          >
            Search
          </button>
        </form>

        {/* District Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {districts.map((d) => {
            const isSelected = (d === "All Districts" && !location) || location.toLowerCase() === d.toLowerCase();
            return (
              <button
                key={d}
                type="button"
                onClick={() => applyLocation(d)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-white/80 border border-[#1C2A28]/10 text-[#5A6B68] hover:text-[#1C2A28] hover:border-[#1C2A28]/30"
                }`}
              >
                {d}
              </button>
            );
          })}

          {(q || location) && (
            <button
              type="button"
              onClick={clear}
              className="text-[11px] font-bold uppercase tracking-wider text-[#E07A5F] hover:underline ml-2 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
