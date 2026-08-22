import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/beaches", label: "BEACHES" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT SAMAL" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user as unknown as { name?: string; email?: string; image?: string; role?: string } | undefined;
  const isAuthed = !!session;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1C2A28]/10 glass-nav transition-all overflow-x-hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" className="flex-shrink-0 font-serif text-xl font-bold tracking-[0.25em] text-[#1C2A28] whitespace-nowrap">
          SAMAALON
        </Link>

        {/* Desktop nav: HOME BEACHES BLOG ABOUT SAMAL LOGIN (LOGIN last, consistent gap, no wrap) */}
        <nav className="hidden md:flex items-center gap-6 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#5A6B68] flex-shrink-0">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex-shrink-0 whitespace-nowrap py-1 border-b border-transparent transition-colors hover:text-[#1C2A28] hover:border-[#2D6A4F]"
            >
              {l.label}
            </Link>
          ))}
          {isAuthed ? (
            <>
              <Link
                href="/profile"
                className="flex-shrink-0 whitespace-nowrap flex items-center gap-2 text-[#1C2A28] hover:text-[#2D6A4F]"
              >
                {user?.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-7 h-7 rounded-full border border-[#2D6A4F]/20 object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <span className="hidden lg:inline font-semibold">{user?.name?.split(" ")[0] || "PROFILE"}</span>
              </Link>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex-shrink-0 whitespace-nowrap rounded-full bg-[#1C2A28] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#2D6A4F] transition-all"
                >
                  ADMIN
                </Link>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="flex-shrink-0"
              >
                <button type="submit" className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#5A6B68] hover:text-[#1C2A28] transition-colors">
                  LOGOUT
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="flex-shrink-0 whitespace-nowrap rounded-full bg-[#1C2A28] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#2D6A4F] hover:shadow-md"
            >
              LOGIN
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <HeaderMobileMenu isAuthed={isAuthed} userName={user?.name?.split(" ")[0]} role={user?.role} />
      </div>
    </header>
  );
}
