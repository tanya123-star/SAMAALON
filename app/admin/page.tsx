import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session) redirect("/login?callbackUrl=%2Fadmin");
  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">403 — Forbidden</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin only. Your role: {role ?? "USER"}.</p>
      </div>
    );
  }
  const [beachCount, accommodationCount, roomTypeCount, blogCount, blogPublished, reviewCount, reviewPending, userCount] = await Promise.all([
    prisma.beach.count(),
    prisma.accommodation.count(),
    prisma.roomType.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.review.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
  ]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Server-verified ADMIN — overview and quick links.</p>
      <div className="mt-4 rounded-lg border p-4 text-sm">
        <p>Logged in as: {session.user?.email} — Role: {role}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Beaches</p>
          <p className="text-2xl font-bold">{beachCount}</p>
          <Link href="/admin/beaches" className="text-xs text-primary hover:underline">
            Manage →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Accommodations</p>
          <p className="text-2xl font-bold">{accommodationCount}</p>
          <Link href="/admin/accommodations" className="text-xs text-primary hover:underline">
            Manage →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Room Types</p>
          <p className="text-2xl font-bold">{roomTypeCount}</p>
          <Link href="/admin/accommodations" className="text-xs text-primary hover:underline">
            View Accommodations →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Blog Posts</p>
          <p className="text-2xl font-bold">
            {blogCount} <span className="text-sm font-normal text-muted-foreground">({blogPublished} published)</span>
          </p>
          <Link href="/admin/blog" className="text-xs text-primary hover:underline">
            Manage →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Reviews</p>
          <p className="text-2xl font-bold">
            {reviewCount} <span className="text-sm font-normal text-muted-foreground">({reviewPending} pending)</span>
          </p>
          <Link href="/admin/reviews" className="text-xs text-primary hover:underline">
            Moderate →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Users</p>
          <p className="text-2xl font-bold">{userCount}</p>
          <p className="text-xs text-muted-foreground">Total Google users</p>
        </div>
      </div>
    </div>
  );
}
