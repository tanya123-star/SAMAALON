import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LockKeyhole } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const role = (session?.user as unknown as { role?: string })?.role
  if (!session) redirect("/login?callbackUrl=%2Fadmin")
  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <LockKeyhole
          size={36}
          strokeWidth={2}
          className="mx-auto mb-2 block text-[#1C2A28]"
          aria-hidden
        />
        <h1 className="font-serif text-3xl font-bold text-[#1C2A28]">
          403 — Access Restricted
        </h1>
        <p className="mt-2 text-xs text-[#5A6B68]">
          Admin privileges required. Current role:{" "}
          <strong className="uppercase">{role ?? "USER"}</strong>
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[#1C2A28] px-6 py-2 text-xs font-bold text-white transition-all hover:bg-[#2D6A4F]"
        >
          Return to Home Page
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Dark Sidebar — Desktop */}
      <aside className="flex hidden w-64 flex-col justify-between bg-[#1C2A28] p-6 text-white md:flex">
        <div className="space-y-6">
          <div>
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-[0.25em] text-white"
            >
              SAMAALON
            </Link>
            <span className="mt-1 block text-[10px] font-bold tracking-widest text-[#E07A5F] uppercase">
              Admin Workspace
            </span>
          </div>

          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            Back to Main Site
          </Link>

          <nav className="space-y-2 text-xs font-semibold tracking-wider uppercase">
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#2D6A4F]"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/beaches"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#2D6A4F]"
            >
              🏖️ Beaches & Coves
            </Link>
            <Link
              href="/admin/accommodations"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#2D6A4F]"
            >
              🏨 Accommodations
            </Link>
            <Link
              href="/admin/blog"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#2D6A4F]"
            >
              📰 Travel Blog
            </Link>
            <Link
              href="/admin/reviews"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[#2D6A4F]"
            >
              ⭐ Review Moderation
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6 text-[11px] text-white/60">
          <span>Samaalon Admin v1.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header Bar */}
        <header className="bg-[#1C2A28] text-white md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link
              href="/"
              className="font-serif text-lg font-bold tracking-widest"
            >
              SAMAALON ADMIN
            </Link>
            <nav className="flex items-center gap-3 text-xs">
              <Link href="/admin" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/admin/beaches" className="hover:underline">
                Beaches
              </Link>
              <Link href="/admin/reviews" className="hover:underline">
                Reviews
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            Back to Main Site
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-6 sm:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
