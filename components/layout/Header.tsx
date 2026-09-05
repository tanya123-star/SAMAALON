import Link from "next/link"
import { auth } from "@/lib/auth"
import { HeaderMobileMenu } from "./HeaderMobileMenu"
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog"

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/beaches", label: "BEACHES" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT SAMAL" },
]

export async function Header() {
  const session = await auth()
  const user = session?.user as unknown as
    { name?: string; email?: string; image?: string; role?: string } | undefined
  const isAuthed = !!session
  return (
    <header className="glass-nav sticky top-0 z-50 w-full overflow-x-hidden border-b border-[#1C2A28]/10 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href="/"
          className="flex-shrink-0 font-serif text-xl font-bold tracking-[0.25em] whitespace-nowrap text-[#1C2A28]"
        >
          SAMAALON
        </Link>

        {/* Desktop nav: HOME BEACHES BLOG ABOUT SAMAL LOGIN (LOGIN last, consistent gap, no wrap) */}
        <nav className="hidden flex-shrink-0 items-center gap-6 text-xs font-semibold tracking-widest whitespace-nowrap text-[#5A6B68] uppercase md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex-shrink-0 border-b border-transparent py-1 whitespace-nowrap transition-colors hover:border-[#2D6A4F] hover:text-[#1C2A28]"
            >
              {l.label}
            </Link>
          ))}
          {isAuthed ? (
            <>
              <Link
                href="/profile"
                className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap text-[#1C2A28] hover:text-[#2D6A4F]"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-7 w-7 rounded-full border border-[#2D6A4F]/20 object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <span className="hidden font-semibold lg:inline">
                  {user?.name?.split(" ")[0] || "PROFILE"}
                </span>
              </Link>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex-shrink-0 rounded-full bg-[#1C2A28] px-3 py-1 text-[11px] font-bold tracking-wider whitespace-nowrap text-white uppercase transition-all hover:bg-[#2D6A4F]"
                >
                  ADMIN
                </Link>
              ) : null}
              <div className="flex-shrink-0">
                <LogoutConfirmDialog />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex-shrink-0 rounded-full bg-[#1C2A28] px-5 py-2 text-xs font-semibold tracking-widest whitespace-nowrap text-white uppercase transition-all hover:bg-[#2D6A4F] hover:shadow-md"
            >
              LOGIN
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <HeaderMobileMenu
          isAuthed={isAuthed}
          userName={user?.name?.split(" ")[0]}
          role={user?.role}
        />
      </div>
    </header>
  )
}
