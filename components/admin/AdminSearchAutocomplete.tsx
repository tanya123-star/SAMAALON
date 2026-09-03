"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  entity: "beaches" | "accommodations" | "blog" | "reviews";
  className?: string;
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <span className="font-bold text-[#1C2A28] bg-amber-100">{match}</span>
      {after}
    </>
  );
}

export function AdminSearchAutocomplete({ name, defaultValue = "", placeholder, entity, className }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!value || value.trim().length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/suggestions?entity=${entity}&q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        const list: string[] = Array.isArray(data.suggestions) ? data.suggestions : [];
        setSuggestions(list.slice(0, 8));
        setOpen(list.length >= 0);
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value, entity]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < suggestions.length) {
        e.preventDefault();
        setValue(suggestions[highlighted]);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  const showDropdown = open && value.trim().length >= 1;

  return (
    <div ref={wrapperRef} className={`relative flex-1 ${className ?? ""}`}>
      <Input
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0 && value.trim().length >= 1) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border bg-white shadow-md">
          {suggestions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">No matches found</div>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={`${s}-${i}`}
                type="button"
                onClick={() => {
                  setValue(s);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left text-xs hover:bg-muted ${i === highlighted ? "bg-muted" : ""}`}
              >
                <span className="truncate">{highlight(s, value.trim())}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
