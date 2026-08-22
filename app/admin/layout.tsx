import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session) redirect("/login?callbackUrl=%2Fadmin");
  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="text-4xl block mb-2">🔒</span>
        <h1 className="text-3xl font-bold font-serif text-[#1C2A28]">403 — Access Restricted</h1>
        <p className="mt-2 text-xs text-[#5A6B68]">Admin privileges required. Current role: <strong className="uppercase">{role ?? "USER"}</strong></p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-[#1C2A28] px-6 py-2 text-xs font-bold text-white hover:bg-[#2D6A4F] transition-all">
          Return to Home Page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Dark Sidebar — Desktop */}
      <aside className="w-64 bg-[#1C2A28] text-white flex flex-col justify-between p-6 hidden md:flex">
        <div className="space-y-6">
          <div>
            <Link href="/" className="font-serif text-xl font-bold tracking-[0.25em] text-white">
              SAMAALON
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] block mt-1">Admin Workspace</span>
          </div>

          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/15 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            Back to Main Site
          </Link>

          <nav className="space-y-2 text-xs font-semibold tracking-wider uppercase">
            <Link href="/admin" className="block rounded-lg px-3 py-2.5 hover:bg-[#2D6A4F] transition-colors">
              📊 Dashboard
            </Link>
            <Link href="/admin/beaches" className="block rounded-lg px-3 py-2.5 hover:bg-[#2D6A4F] transition-colors">
              🏖️ Beaches & Coves
            </Link>
            <Link href="/admin/accommodations" className="block rounded-lg px-3 py-2.5 hover:bg-[#2D6A4F] transition-colors">
              🏨 Accommodations
            </Link>
            <Link href="/admin/blog" className="block rounded-lg px-3 py-2.5 hover:bg-[#2D6A4F] transition-colors">
              📰 Travel Blog
            </Link>
            <Link href="/admin/reviews" className="block rounded-lg px-3 py-2.5 hover:bg-[#2D6A4F] transition-colors">
              ⭐ Review Moderation
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-white/60">
          <span>Samaalon Admin v1.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-[#1C2A28] text-white">
          <div className="p-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-bold tracking-widest">
              SAMAALON ADMIN
            </Link>
            <nav className="flex items-center gap-3 text-xs">
              <Link href="/admin" className="hover:underline">Dashboard</Link>
              <Link href="/admin/beaches" className="hover:underline">Beaches</Link>
              <Link href="/admin/reviews" className="hover:underline">Reviews</Link>
            </nav>
          </div>
          <Link href="/" className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            Back to Main Site
          </Link>
        </header>

        <main className="p-6 sm:p-10 flex-1 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
