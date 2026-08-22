import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

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

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span key={c.id} className="rounded-full bg-[#FAF8F5] border border-[#1C2A28]/10 px-4 py-1.5 text-xs font-semibold text-[#1C2A28]">
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-16">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-12 text-center text-xs text-[#5A6B68]">
            No travel guides published yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="group flex flex-col rounded-2xl border border-[#1C2A28]/10 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="h-52 overflow-hidden bg-slate-100 relative">
                  <img
                    src={p.featuredImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {p.category && (
                    <span className="absolute top-3 left-3 rounded-full bg-[#1C2A28]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      {p.category.name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1C2A28] group-hover:text-[#2D6A4F] transition-colors">
                      <Link href={`/blog/${p.slug}`}>
                        {p.title}
                      </Link>
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
