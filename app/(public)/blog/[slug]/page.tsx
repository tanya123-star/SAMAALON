import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, include: { category: true } });
  if (!post || !post.published) notFound();

  return (
    <article className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-white border-b border-[#1C2A28]/10 py-16 px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] hover:text-[#1C2A28] mb-4 block">
            ← Back to Travel Guides
          </Link>
          {post.category && (
            <span className="rounded-full bg-[#FAF8F5] border border-[#1C2A28]/10 px-3.5 py-1 text-[11px] font-bold text-[#1C2A28] uppercase tracking-wider inline-block mb-3">
              {post.category.name}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2A28] leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-[#5A6B68]">
            <span>Published {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</span>
            <span>·</span>
            <span>Samal Tourism Journal</span>
          </div>
        </div>
      </section>

      {/* Featured Cover Image */}
      {post.featuredImage && (
        <div className="mx-auto max-w-4xl w-full px-4 sm:px-8 -mt-6 z-10">
          <div className="rounded-2xl overflow-hidden shadow-lg h-96 bg-slate-100">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="mx-auto max-w-3xl w-full px-4 sm:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#1C2A28]/10 p-8 sm:p-12 shadow-sm text-sm sm:text-base leading-relaxed text-[#1C2A28] space-y-6">
          <p className="whitespace-pre-wrap font-sans text-[#1C2A28]/90 leading-loose">{post.content}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#1C2A28]/10 flex items-center justify-between text-xs">
          <Link href="/blog" className="font-bold text-[#2D6A4F] hover:underline">
            ← Explore more Samal stories
          </Link>
          <Link href="/beaches" className="font-bold text-[#1C2A28] hover:underline">
            Browse Samal Beaches →
          </Link>
        </div>
      </section>
    </article>
  );
}
