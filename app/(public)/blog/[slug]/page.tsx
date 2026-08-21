import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, include: { category: true } });
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Guides
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {post.category ? <Badge variant="secondary">{post.category.name}</Badge> : null}
        {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
      </div>
      <div className="prose prose-sm mt-6 max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap leading-7">{post.content}</p>
      </div>
    </article>
  );
}
