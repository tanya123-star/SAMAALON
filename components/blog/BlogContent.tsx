"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  category: Category | null;
}

export function BlogContent({
  posts,
  categories,
}: {
  posts: Post[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "all";

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.category?.slug === selectedCategory);

  function handleCategoryClick(slug: string) {
    const params = new URLSearchParams();
    if (slug !== "all") params.set("category", slug);
    router.push(`/blog${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#1C2A28]/10 py-16 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Samal Journal</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2A28] mt-2">Travel Guides & Island Stories</h1>
          <p className="mt-4 text-xs sm:text-sm text-[#5A6B68] max-w-2xl leading-relaxed">
            Essential guides for discovering Samal Island — from ferry schedules and island hopping tips to top beaches and resort recommendations.
          </p>

          {/* Clickable Category Filter Pills */}
          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {/* "All" pill */}
              <button
                onClick={() => handleCategoryClick("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-[#1C2A28] text-white border-[#1C2A28]"
                    : "bg-[#FAF8F5] text-[#1C2A28] border-[#1C2A28]/10 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                All
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                    selectedCategory === c.slug
                      ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md"
                      : "bg-[#FAF8F5] text-[#1C2A28] border-[#1C2A28]/10 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Active filter label */}
          {selectedCategory !== "all" && (
            <p className="mt-4 text-xs text-[#5A6B68]">
              Showing:{" "}
              <span className="font-bold text-[#2D6A4F]">
                {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>{" "}
              · {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          )}
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-16">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-12 text-center text-xs text-[#5A6B68]">
            No travel guides published in this category yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col rounded-2xl border border-[#1C2A28]/10 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 overflow-hidden bg-slate-100 relative">
                  <img
                    src={p.featuredImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {p.category && (
                    <button
                      onClick={() => handleCategoryClick(p.category!.slug)}
                      className="absolute top-3 left-3 rounded-full bg-[#1C2A28]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-[#2D6A4F] transition-colors"
                    >
                      {p.category.name}
                    </button>
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1C2A28] group-hover:text-[#2D6A4F] transition-colors">
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#5A6B68] line-clamp-3">{p.content}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1C2A28]/10 flex items-center justify-between text-xs font-semibold text-[#1C2A28]">
                    <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "Draft"}</span>
                    <Link href={`/blog/${p.slug}`} className="text-[#2D6A4F] font-bold hover:underline">
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
  );
}
