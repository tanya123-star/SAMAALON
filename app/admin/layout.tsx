import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session) redirect("/api/auth/signin");
  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">403 — Admin Only</h1>
        <p className="text-sm text-muted-foreground">Your role: {role ?? "USER"}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          Go Home
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <nav className="mb-6 flex flex-wrap gap-4 border-b pb-3 text-sm">
        <Link href="/admin" className="font-medium hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/beaches" className="text-muted-foreground hover:text-foreground">
          Beaches
        </Link>
        <Link href="/admin/accommodations" className="text-muted-foreground hover:text-foreground">
          Accommodations
        </Link>
        <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
          Blog
        </Link>
        <Link href="/admin/reviews" className="text-muted-foreground hover:text-foreground">
          Reviews
        </Link>
      </nav>
      {children}
    </div>
  );
}
