"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  featuredImage: string | null
  publishedAt: Date | null
  category: Category | null
}

function highlight(text: string, q: string) {
  if (!q) return text
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + q.length)
  const after = text.slice(idx + q.length)
  return (
    <>
      {before}
      <span className="bg-amber-100/60 font-bold text-[#1C2A28]">{match}</span>
      {after}
    </>
  )
}

export function BlogContent({
  posts,
  categories,
}: {
  posts: Post[]
  categories: Category[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category") ?? "all"
  const qParam = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(qParam)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    queueMicrotask(() => setQuery(qParam))
  }, [qParam])

  // Keep URL in sync for shareability when user types (debounced push not needed for instant filter)
  // filteredPosts updates instantly as user types (no Enter required)
  const normalizedQuery = query.trim().toLowerCase()

  const categoryFiltered = useMemo(() => {
    if (selectedCategory === "all") return posts
    return posts.filter((p) => p.category?.slug === selectedCategory)
  }, [posts, selectedCategory])

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return categoryFiltered
    return categoryFiltered.filter((p) => {
      return (
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.slug.toLowerCase().includes(normalizedQuery) ||
        (p.category?.name.toLowerCase().includes(normalizedQuery) ?? false) ||
        p.content.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [categoryFiltered, normalizedQuery])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as Post[]
    const pool =
      selectedCategory === "all"
        ? posts
        : posts.filter((p) => p.category?.slug === selectedCategory)
    const matched = pool.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category?.name.toLowerCase().includes(q) ?? false) ||
        p.content.toLowerCase().includes(q)
    )
    const scored = matched
      .map((p) => {
        const t = p.title.toLowerCase().includes(q)
          ? 0
          : p.category?.name.toLowerCase().includes(q)
            ? 1
            : 2
        return { p, t }
      })
      .sort(
        (a, b) =>
          a.t - b.t ||
          (b.p.publishedAt ? new Date(b.p.publishedAt).getTime() : 0) -
            (a.p.publishedAt ? new Date(a.p.publishedAt).getTime() : 0)
      )
      .slice(0, 5)
      .map((x) => x.p)
    return scored
  }, [query, selectedCategory, posts])

  useEffect(() => {
    queueMicrotask(() => {
      if (query.trim().length >= 1) setOpen(true)
      else setOpen(false)
      setHighlighted(-1)
    })
  }, [query])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  function buildUrl(next: { q?: string; category?: string }) {
    const params = new URLSearchParams()
    const qVal = next.q !== undefined ? next.q : qParam
    const catVal =
      next.category !== undefined ? next.category : selectedCategory
    if (qVal) params.set("q", qVal)
    if (catVal && catVal !== "all") params.set("category", catVal)
    return `/blog${params.toString() ? `?${params}` : ""}`
  }

  function handleCategoryClick(slug: string) {
    router.push(buildUrl({ category: slug }), { scroll: false })
  }

  function handleClear() {
    setQuery("")
    setOpen(false)
    router.push(buildUrl({ q: "" }), { scroll: false })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!open || suggestions.length === 0) return
      e.preventDefault()
      setHighlighted((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      if (!open || suggestions.length === 0) return
      e.preventDefault()
      setHighlighted(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      )
    } else if (e.key === "Enter") {
      if (open && highlighted >= 0 && highlighted < suggestions.length) {
        e.preventDefault()
        router.push(`/blog/${suggestions[highlighted].slug}`)
        setOpen(false)
      } else if (query.trim()) {
        // Keep URL in sync for shareability, but grid already filtered instantly
        router.push(buildUrl({ q: query.trim() }), { scroll: false })
        setOpen(false)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setHighlighted(-1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Editorial Header */}
      <section className="border-b border-[#1C2A28]/10 bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
            Samal Journal
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#1C2A28] sm:text-5xl">
            Travel Guides & Island Stories
          </h1>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-[#5A6B68] sm:text-sm">
            Essential guides for discovering Samal Island — from ferry schedules
            and island hopping tips to top beaches and resort recommendations.
          </p>

          {/* Category + search layout: Row 1 = first 6 pills + flexible search, Row 2 = remaining pills */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategoryClick("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "border-[#1C2A28] bg-[#1C2A28] text-white"
                    : "border-[#1C2A28]/10 bg-[#FAF8F5] text-[#1C2A28] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                All
              </button>
              {categories.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === c.slug
                      ? "border-[#2D6A4F] bg-[#2D6A4F] text-white shadow-md"
                      : "border-[#1C2A28]/10 bg-[#FAF8F5] text-[#1C2A28] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                  }`}
                >
                  {c.name}
                </button>
              ))}

              {/* Search — flexible but capped, aligned to the row's right edge */}
              <div
                ref={wrapperRef}
                className="relative mt-3 ml-auto w-full max-w-[380px] min-w-[220px] lg:mt-0"
              >
                <label htmlFor="blog-search" className="sr-only">
                  Search travel stories
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-[#5A6B68]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>
                  <input
                    id="blog-search"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="blog-search-listbox"
                    aria-autocomplete="list"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setOpen(true)
                    }}
                    onFocus={() => {
                      if (query.trim().length >= 1) setOpen(true)
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search"
                    className="w-full rounded-lg border border-[#1C2A28]/10 bg-[#FAF8F5] py-3 pr-8 pl-9 text-sm text-[#1C2A28] placeholder:text-[#5A6B68]/60 focus-visible:border-[#2D6A4F] focus-visible:ring-2 focus-visible:ring-[#2D6A4F]/20 focus-visible:outline-none"
                    autoComplete="off"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Clear search"
                      className="absolute right-2 rounded-md p-1 text-[#5A6B68] hover:bg-white hover:text-[#1C2A28]"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {open && query.trim().length >= 1 ? (
                  <div
                    id="blog-search-listbox"
                    role="listbox"
                    className="absolute top-full right-0 left-0 z-20 mt-2 max-h-80 overflow-auto rounded-lg border bg-white shadow-md"
                  >
                    {suggestions.length === 0 ? (
                      <div className="px-3 py-4 text-xs text-[#5A6B68]">
                        <p className="font-semibold text-[#1C2A28]">
                          No travel stories found.
                        </p>
                        <p className="mt-1">Try another keyword.</p>
                      </div>
                    ) : (
                      suggestions.map((s, i) => (
                        <button
                          key={s.id}
                          role="option"
                          aria-selected={i === highlighted}
                          type="button"
                          onClick={() => {
                            router.push(`/blog/${s.slug}`)
                            setOpen(false)
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#FAF8F5] ${i === highlighted ? "bg-[#FAF8F5]" : ""}`}
                        >
                          <img
                            src={
                              s.featuredImage ||
                              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80"
                            }
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover"
                            onError={(e) =>
                              ((
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none")
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-[#1C2A28]">
                              {highlight(s.title, query.trim())}
                            </span>
                            <span className="block text-[10px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                              {s.category?.name ?? "Travel"}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Row 2 — remaining categories */}
            {categories.length > 5 ? (
              <div className="flex flex-wrap gap-2">
                {categories.slice(5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryClick(c.slug)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      selectedCategory === c.slug
                        ? "border-[#2D6A4F] bg-[#2D6A4F] text-white shadow-md"
                        : "border-[#1C2A28]/10 bg-[#FAF8F5] text-[#1C2A28] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Active filter label */}
          {(selectedCategory !== "all" || query.trim() || qParam) && (
            <p className="mt-4 text-xs text-[#5A6B68]">
              {query.trim() || qParam ? (
                <>
                  Search results for &ldquo;
                  <span className="font-bold text-[#2D6A4F]">
                    {query.trim() || qParam}
                  </span>
                  &rdquo; ·{" "}
                </>
              ) : (
                <>Showing: </>
              )}
              {selectedCategory !== "all" ? (
                <span className="font-bold text-[#2D6A4F]">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </span>
              ) : query.trim() || qParam ? (
                <span>
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "post" : "posts"}
                </span>
              ) : (
                <span className="font-bold text-[#2D6A4F]">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </span>
              )}
              {!query.trim() && !qParam && selectedCategory !== "all" ? (
                <>
                  {" "}
                  · {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "post" : "posts"}
                </>
              ) : null}
            </p>
          )}
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-12 text-center">
            <p className="text-sm font-bold text-[#1C2A28]">No stories found</p>
            <p className="mt-1 text-xs text-[#5A6B68]">
              Try searching for beaches, resorts, travel guides, or things to
              do.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#1C2A28]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={
                      p.featuredImage ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {p.category && (
                    <button
                      onClick={() => handleCategoryClick(p.category!.slug)}
                      className="absolute top-3 left-3 rounded-full bg-[#1C2A28]/80 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md transition-colors hover:bg-[#2D6A4F]"
                    >
                      {p.category.name}
                    </button>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1C2A28] transition-colors group-hover:text-[#2D6A4F]">
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#5A6B68]">
                      {p.content}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#1C2A28]/10 pt-4 text-xs font-semibold text-[#1C2A28]">
                    <span>
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </span>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="font-bold text-[#2D6A4F] hover:underline"
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
